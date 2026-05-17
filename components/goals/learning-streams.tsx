"use client";

import Link from "next/link";
import { useGoals } from "@/lib/hooks/use-goals";
import { Progress } from "@/components/ui/progress";
import { categorize, getDaysRemaining } from "@/lib/utils/goals-analytics";
import { findTemplate } from "@/data/goal-templates";
import { resolveSession } from "@/lib/utils/session-content";
import { ChevronRight, BookOpen } from "lucide-react";

export function LearningStreams() {
  const { goals } = useGoals();
  const { learning } = categorize(goals);
  const items = learning.slice(0, 2);

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-eyebrow">Learning</p>
          <h3 className="text-lg font-semibold">Hành trình học</h3>
        </div>
        <BookOpen className="w-5 h-5 text-text-muted" strokeWidth={1.75} />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-text-muted py-6 text-center">
          Chưa có mục tiêu học tập. Vào <Link href="/roadmap" className="text-primary hover:underline">Hành Trình</Link> để bắt đầu.
        </p>
      ) : (
        items.map((g) => {
          const tpl = findTemplate(g.templateKey);
          const session = resolveSession(g, new Date());
          const daysLeft = getDaysRemaining(g);
          return (
            <Link
              key={g.id}
              href={`/roadmap?goalId=${g.id}`}
              className="block rounded-xl border border-border/60 p-4 hover:border-primary hover:bg-tertiary/20 transition group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-medium">{g.name}</p>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </div>
              <p className="text-xs text-text-muted truncate mb-2">
                {session?.name ?? tpl?.description}
              </p>
              <Progress value={g.progress} className="h-1.5" />
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-text-muted">
                <span className="tabular-nums">{g.progress}% hoàn thành</span>
                <span>{daysLeft} ngày còn lại</span>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
