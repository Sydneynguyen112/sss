"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useGoals } from "@/lib/hooks/use-goals";
import { useSchedule } from "@/lib/hooks/use-schedule";
import { GOAL_TEMPLATES } from "@/data/goal-templates";
import { StepGoalPicker } from "./step-goal-picker";
import { StepGoalSchedule, type GoalDraft } from "./step-goal-schedule";
import { cn } from "@/lib/utils";
import type { GoalTemplateKey } from "@/types";

export function OnboardingDialog({
  onComplete,
  initialStep = 1,
  startOpen = true,
}: {
  onComplete: () => void;
  initialStep?: 1 | 2 | 3;
  startOpen?: boolean;
}) {
  const { settings, setSettings } = useTheme();
  const { addGoal } = useGoals();
  const { regenerateFromGoals } = useSchedule();

  const [open, setOpen] = useState(startOpen);
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [userName, setUserName] = useState(settings.userName ?? "");
  const [partnerName, setPartnerName] = useState(settings.partnerName ?? "");
  const [selectedKeys, setSelectedKeys] = useState<GoalTemplateKey[]>([]);
  const [drafts, setDrafts] = useState<Record<GoalTemplateKey, GoalDraft>>({} as Record<GoalTemplateKey, GoalDraft>);

  const next = () => setStep((s) => (Math.min(3, s + 1) as 1 | 2 | 3));
  const back = () => setStep((s) => (Math.max(1, s - 1) as 1 | 2 | 3));

  const finish = () => {
    setSettings((s) => ({
      ...s,
      userName: userName.trim() || "anh yêu",
      partnerName: partnerName.trim() || undefined,
      autoTheme: s.autoTheme ?? true,
      language: s.language ?? "vi",
    }));
    const today = new Date().toISOString().slice(0, 10);
    const goalsToAdd = selectedKeys.map((k) => {
      const tpl = GOAL_TEMPLATES.find((t) => t.key === k)!;
      const d = drafts[k] ?? {
        schedule: tpl.defaultSchedule,
        time: tpl.defaultTime,
        duration: tpl.defaultDuration,
      };
      return {
        templateKey: k,
        name: tpl.name,
        startDate: today,
        durationWeeks: 8,
        schedule: d.schedule,
        time: d.time,
        duration: d.duration,
        progress: 0,
      };
    });
    const created = goalsToAdd.map(addGoal);
    regenerateFromGoals(created);
    setOpen(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={() => { /* undismissable — controlled state, never close */ }}>
      <DialogContent
        className="max-w-2xl max-h-[90dvh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1 && "Chào em, mình bắt đầu nhé 🌿"}
            {step === 2 && "Chọn mục tiêu của tháng này"}
            {step === 3 && "Sắp lịch cho từng mục tiêu"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Hãy cho mình biết tên bạn để hành trình thêm thân quen."}
            {step === 2 && "Chọn tối đa 3 mục tiêu — đừng tham quá, từ từ thôi."}
            {step === 3 && "Đặt giờ và ngày trong tuần phù hợp với nhịp sống."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <StepIndicator step={step} />

          {step === 1 && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ob-user">Tên bạn</Label>
                <Input
                  id="ob-user"
                  autoFocus
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Vd: Minh"
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-partner">Tên người yêu (tuỳ chọn)</Label>
                <Input
                  id="ob-partner"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Vd: Linh"
                  className="text-base"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <StepGoalPicker
              selected={selectedKeys}
              onChange={setSelectedKeys}
            />
          )}

          {step === 3 && (
            <StepGoalSchedule
              selectedKeys={selectedKeys}
              drafts={drafts}
              onChange={setDrafts}
            />
          )}
        </div>

        <div className="flex justify-between gap-2 pt-2 border-t border-border">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 1}
            className={cn(step === 1 && "invisible")}
          >
            Quay lại
          </Button>
          {step < 3 ? (
            <Button
              onClick={next}
              disabled={
                (step === 1 && !userName.trim()) ||
                (step === 2 && selectedKeys.length === 0)
              }
            >
              Tiếp tục
            </Button>
          ) : (
            <Button onClick={finish}>Hoàn tất ✨</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            n <= step ? "bg-primary" : "bg-border",
          )}
        />
      ))}
    </div>
  );
}
