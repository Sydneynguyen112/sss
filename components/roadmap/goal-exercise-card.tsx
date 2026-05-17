"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Calendar as CalendarIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSessions } from "@/lib/hooks/use-sessions";
import { resolveSession } from "@/lib/utils/session-content";
import { dayOfWeek, dowShortVi } from "@/lib/utils/date-helpers";
import { totalDurationMinutes } from "@/lib/utils/roadmap-content";
import { StepCheckboxRow } from "./step-checkbox-row";
import { MediaUploadZone } from "./media-upload-zone";
import { MediaThumbnailGrid } from "./media-thumbnail-grid";
import type { Goal } from "@/types";

function getIcon(name: string): React.ComponentType<{ className?: string; strokeWidth?: number }> {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>;
  return Icons[name] ?? LucideIcons.Sparkles;
}

export function GoalExerciseCard({ goal }: { goal: Goal }) {
  const today = new Date();
  const resolved = resolveSession(goal, today);
  const dow = dayOfWeek(today);
  const isScheduledToday = goal.schedule.includes(dow);

  const { getSessionFor, toggleStep, markComplete, unmarkComplete } = useSessions();
  const session = getSessionFor(goal.id, today);
  const allStepsDone =
    resolved && session.completedSteps.length >= resolved.steps.length;

  if (!resolved) return null;
  const Icon = getIcon(resolved.template.icon);
  const isHomeDrill = resolved.kind === "homeDrill";

  return (
    <motion.section
      id={`goal-card-${goal.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-5 sm:p-7 shadow-soft scroll-mt-24"
    >
      <header className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="grid place-items-center w-11 h-11 rounded-2xl text-white shrink-0"
            style={{ backgroundColor: resolved.template.accent }}
          >
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold leading-tight">{goal.name}</h2>
            <div className="flex items-center gap-3 text-xs text-text-muted mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {goal.time} ({totalDurationMinutes(resolved)} phút)
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {goal.schedule.map((d) => dowShortVi(d)).join(", ")}
              </span>
              {isScheduledToday && (
                <Badge className="bg-primary text-primary-foreground">Hôm nay</Badge>
              )}
              {isHomeDrill && (
                <Badge className="bg-secondary text-secondary-foreground">Tại nhà</Badge>
              )}
            </div>
          </div>
        </div>
        <Badge variant="outline" className="tabular-nums">{goal.progress}%</Badge>
      </header>

      <div className="space-y-2 mb-4">
        <p className="text-base sm:text-lg font-medium text-primary">{resolved.name}</p>
        <p className="text-sm text-text-secondary text-balance">{resolved.summary}</p>
      </div>

      <ol className="space-y-2 mb-5">
        {resolved.steps.map((step, idx) => (
          <StepCheckboxRow
            key={idx}
            idx={idx}
            step={step}
            checked={session.completedSteps.includes(idx)}
            onToggle={() => toggleStep(goal.id, today, idx)}
          />
        ))}
      </ol>

      <div className="space-y-3 mb-5">
        <p className="label-eyebrow">Tải lên ảnh / clip</p>
        <MediaUploadZone goalId={goal.id} date={today} />
        {session.photos.length > 0 && (
          <MediaThumbnailGrid goalId={goal.id} date={today} items={session.photos} />
        )}
      </div>

      <AnimatePresence mode="wait">
        {session.completed ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between gap-3 rounded-xl bg-success/10 border border-success/30 p-4"
          >
            <div className="flex items-center gap-2 text-success font-medium">
              <Check className="w-5 h-5" />
              Đã hoàn thành buổi hôm nay 🎉
            </div>
            <Button variant="ghost" size="sm" onClick={() => unmarkComplete(goal.id, today)}>
              Hoàn tác
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              size="lg"
              className="w-full"
              onClick={() => markComplete(goal.id, today)}
              disabled={!allStepsDone}
            >
              {allStepsDone ? "Hoàn thành buổi" : `Hoàn thành ${session.completedSteps.length}/${resolved.steps.length} bước`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
