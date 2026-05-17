"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Home as HomeIcon, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGoals } from "@/lib/hooks/use-goals";
import { useSessions } from "@/lib/hooks/use-sessions";
import { deriveTodayPrimarySession, totalDurationMinutes } from "@/lib/utils/roadmap-content";
import { intensityLabel } from "@/lib/utils/session-content";
import { InlineMediaUpload } from "./inline-media-upload";

export function TodayTrainingCard() {
  const today = useMemo(() => new Date(), []);
  const { goals } = useGoals();
  const resolved = useMemo(() => deriveTodayPrimarySession(goals, today), [goals, today]);
  const { getSessionFor, toggleStep, addMedia, removeMedia, markComplete, unmarkComplete } = useSessions();

  if (!resolved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="glass rounded-3xl p-6 sm:p-7 shadow-soft flex flex-col items-center text-center gap-3 min-h-[280px] justify-center"
      >
        <Sparkles className="w-8 h-8 text-text-muted opacity-60" strokeWidth={1.25} />
        <div>
          <p className="label-eyebrow">Lộ trình luyện tập</p>
          <h2 className="text-xl font-semibold mt-1">Hôm nay là ngày nghỉ 🌿</h2>
        </div>
        <p className="text-sm text-text-secondary max-w-sm">
          Không có buổi tập nào hôm nay — đi dạo, đọc sách, hoặc gọi cho người yêu.
        </p>
      </motion.div>
    );
  }

  const { goal, session, kind } = resolved;
  const localSession = getSessionFor(goal.id, today);
  const allDone = localSession.completedSteps.length >= session.steps.length;
  const isHome = kind === "homeDrill";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="glass rounded-3xl p-6 sm:p-7 shadow-soft"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="label-eyebrow">Lộ trình luyện tập</p>
          <h2 className="text-xl font-semibold mt-1 leading-tight">{session.name}</h2>
          <p className="text-xs text-primary mt-1 font-medium">{goal.name}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge variant="outline" className="tabular-nums">{goal.progress}%</Badge>
          {isHome && (
            <Badge className="bg-secondary text-secondary-foreground text-[10px]">
              <HomeIcon className="w-2.5 h-2.5 mr-1" />
              Tại nhà
            </Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-4 line-clamp-2">{session.summary}</p>

      <div className="flex items-center gap-2 mb-4">
        <Chip icon={<Clock className="w-3 h-3" />}>{totalDurationMinutes(session)} phút</Chip>
        <Chip icon={<Zap className="w-3 h-3" />}>{intensityLabel(totalDurationMinutes(session))}</Chip>
      </div>

      <ol className="space-y-1.5 mb-4">
        {session.steps.map((step, idx) => {
          const checked = localSession.completedSteps.includes(idx);
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => toggleStep(goal.id, today, idx)}
                className={`w-full flex items-center gap-2.5 text-left p-2 rounded-lg transition ${
                  checked
                    ? "bg-success/5 border border-success/20"
                    : "hover:bg-tertiary/30 border border-border/40"
                }`}
              >
                <span
                  className={`grid place-items-center w-5 h-5 rounded-full shrink-0 text-[10px] font-bold tabular-nums ${
                    checked ? "bg-success text-white" : "bg-primary/10 text-primary"
                  }`}
                >
                  {checked ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                </span>
                <span className={`flex-1 text-xs font-medium leading-snug ${checked && "line-through opacity-60"}`}>
                  {step.title}
                </span>
                <span className="text-[10px] text-text-muted tabular-nums shrink-0">{step.minutes} phút</span>
              </button>
            </li>
          );
        })}
      </ol>

      <InlineMediaUpload
        photos={localSession.photos}
        onAdd={(m) => addMedia(goal.id, today, m)}
        onRemove={(id) => removeMedia(goal.id, today, id)}
        acceptVideo
        label="Gửi hình ảnh / video"
      />

      <div className="mt-4 pt-4 border-t border-border/60">
        {localSession.completed ? (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-success/10 border border-success/30 p-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
              <Check className="w-4 h-4" /> Đã hoàn thành 🎉
            </span>
            <Button variant="ghost" size="sm" onClick={() => unmarkComplete(goal.id, today)}>
              Hoàn tác
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => markComplete(goal.id, today)}
            disabled={!allDone}
          >
            {allDone
              ? "Hoàn thành buổi"
              : `Hoàn thành ${localSession.completedSteps.length}/${session.steps.length} bước`}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary/60 text-text-primary text-[11px] font-medium">
      {icon}
      {children}
    </span>
  );
}
