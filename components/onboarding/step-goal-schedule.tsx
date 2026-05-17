"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { findTemplate } from "@/data/goal-templates";
import { dowShortVi } from "@/lib/utils/date-helpers";
import type { DayOfWeek, GoalTemplateKey } from "@/types";

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface GoalDraft {
  schedule: DayOfWeek[];
  time: string;
  duration: number;
}

export function StepGoalSchedule({
  selectedKeys,
  drafts,
  onChange,
}: {
  selectedKeys: GoalTemplateKey[];
  drafts: Record<GoalTemplateKey, GoalDraft>;
  onChange: (next: Record<GoalTemplateKey, GoalDraft>) => void;
}) {
  // Init drafts for any keys not yet set
  useEffect(() => {
    const next = { ...drafts };
    let changed = false;
    for (const k of selectedKeys) {
      if (!next[k]) {
        const tpl = findTemplate(k);
        if (tpl) {
          next[k] = {
            schedule: [...tpl.defaultSchedule],
            time: tpl.defaultTime,
            duration: tpl.defaultDuration,
          };
          changed = true;
        }
      }
    }
    if (changed) onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys]);

  const updateDraft = (key: GoalTemplateKey, patch: Partial<GoalDraft>) => {
    onChange({ ...drafts, [key]: { ...(drafts[key]!), ...patch } });
  };

  const toggleDay = (key: GoalTemplateKey, day: DayOfWeek) => {
    const cur = drafts[key]?.schedule ?? [];
    const next = cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day];
    updateDraft(key, { schedule: next });
  };

  if (selectedKeys.length === 0) {
    return <p className="text-sm text-text-muted text-center py-6">Quay lại bước 2 và chọn ít nhất 1 mục tiêu nhé.</p>;
  }

  return (
    <div className="space-y-5 mt-4 max-h-[55dvh] overflow-y-auto pr-1 scrollbar-thin">
      {selectedKeys.map((key) => {
        const tpl = findTemplate(key);
        const draft = drafts[key];
        if (!tpl || !draft) return null;
        return (
          <div key={key} className="rounded-2xl border border-border p-4 space-y-4">
            <p className="font-semibold">{tpl.name}</p>

            <div>
              <Label className="text-xs">Ngày trong tuần</Label>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {DAYS.map((d) => {
                  const active = draft.schedule.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(key, d)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-tertiary/60 text-text-primary hover:bg-tertiary",
                      )}
                    >
                      {dowShortVi(d)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`time-${key}`} className="text-xs">Giờ</Label>
                <Input
                  id={`time-${key}`}
                  type="time"
                  value={draft.time}
                  onChange={(e) => updateDraft(key, { time: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`dur-${key}`} className="text-xs">Thời lượng (phút)</Label>
                <Input
                  id={`dur-${key}`}
                  type="number"
                  min={15}
                  max={180}
                  step={5}
                  value={draft.duration}
                  onChange={(e) => updateDraft(key, { duration: Math.max(15, parseInt(e.target.value || "0", 10)) })}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
