"use client";

import { Leaf, Target } from "lucide-react";
import { useGoals } from "@/lib/hooks/use-goals";
import { useSessions } from "@/lib/hooks/use-sessions";
import { getFocusStreak, getCompletionPercent } from "@/lib/utils/goals-analytics";
import { StatCard } from "./stat-card";

export function StatsColumn() {
  const { goals } = useGoals();
  const { sessions } = useSessions();
  const streak = getFocusStreak(sessions);
  const completion = getCompletionPercent(goals);
  const totalSessions = sessions.filter((s) => s.completed).length;

  return (
    <div className="space-y-4">
      <StatCard
        icon={Leaf}
        value={streak}
        label="Focus Streak"
        caption={streak === 0 ? "Bắt đầu ngày hôm nay" : `${streak} ngày liên tiếp`}
      />
      <StatCard
        icon={Target}
        value={`${completion}%`}
        label="Goal Completion"
        caption={`${totalSessions} buổi đã hoàn thành`}
      />
    </div>
  );
}
