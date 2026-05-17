"use client";

import { useGoals } from "@/lib/hooks/use-goals";
import { Progress } from "@/components/ui/progress";
import { findTemplate } from "@/data/goal-templates";
import { resolveSession } from "@/lib/utils/session-content";
import { dayOfWeek } from "@/lib/utils/date-helpers";
import Link from "next/link";
import { Target } from "lucide-react";

export function GoalsSidebar({ date }: { date: Date }) {
  const { goals } = useGoals();
  const dow = dayOfWeek(date);
  const list = goals.slice(0, 3);

  return (
    <div className="glass rounded-2xl p-5 shadow-soft space-y-4">
      <p className="label-eyebrow">Mục tiêu của bạn</p>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-4 text-text-muted">
          <Target className="w-6 h-6 opacity-50" />
          <p className="text-xs text-center">Chưa có mục tiêu</p>
          <Link href="/roadmap" className="text-xs text-primary hover:underline">
            Bắt đầu →
          </Link>
        </div>
      ) : (
        list.map((g) => {
          const tpl = findTemplate(g.templateKey);
          const today = g.schedule.includes(dow);
          const session = today ? resolveSession(g, date) : null;
          const status = g.progress >= 100 ? "Hoàn thành" : today ? "Hôm nay" : "Đang tiến hành";
          return (
            <div key={g.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{g.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-text-muted">
                  {status}
                </span>
              </div>
              <Progress value={g.progress} className="h-1.5" />
              <p className="text-xs text-text-muted truncate">
                {session?.name ?? tpl?.description ?? ""}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
