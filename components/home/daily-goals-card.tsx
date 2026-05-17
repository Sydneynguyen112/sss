"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGoals } from "@/lib/hooks/use-goals";
import { Progress } from "@/components/ui/progress";
import { dayOfWeek } from "@/lib/utils/date-helpers";
import { findTemplate } from "@/data/goal-templates";
import { resolveSession } from "@/lib/utils/session-content";
import { Target } from "lucide-react";

export function DailyGoalsCard() {
  const { goals } = useGoals();
  const today = new Date();
  const dow = dayOfWeek(today);
  const todayGoals = goals.filter((g) => g.schedule.includes(dow)).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
      className="glass rounded-3xl p-7 shadow-soft"
    >
      <p className="label-eyebrow mb-5">Mục tiêu ngày</p>

      {todayGoals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-text-muted">
          <Target className="w-8 h-8 opacity-50" />
          <p className="text-sm text-center">Hôm nay không có lịch tập.</p>
          <Link href="/roadmap" className="text-xs text-primary hover:underline mt-1">
            Xem Hành trình →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {todayGoals.map((g) => {
            const tpl = findTemplate(g.templateKey);
            const session = resolveSession(g, today);
            return (
              <li key={g.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{g.name}</span>
                  <span className="text-xs text-text-muted tabular-nums">{g.progress}%</span>
                </div>
                <Progress value={g.progress} className="h-2" />
                {session && (
                  <p className="mt-1 text-xs text-text-muted truncate">
                    {session.name}
                  </p>
                )}
                {!session && tpl && (
                  <p className="mt-1 text-xs text-text-muted">{tpl.shortName}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
