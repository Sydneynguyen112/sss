"use client";

import Link from "next/link";
import { useGoals } from "@/lib/hooks/use-goals";
import { useSessions } from "@/lib/hooks/use-sessions";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { categorize } from "@/lib/utils/goals-analytics";
import { dowShortVi } from "@/lib/utils/date-helpers";
import { Dumbbell } from "lucide-react";

const HERO_GRADIENT = "linear-gradient(135deg, #0077C2 0%, #4FA8E0 50%, #8ECAE6 100%)";

export function PhysicalHarmony() {
  const { goals } = useGoals();
  const { sessions } = useSessions();
  const { physical } = categorize(goals);

  const primary = physical[0];
  const secondary = physical[1];

  if (physical.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 shadow-soft text-center">
        <Dumbbell className="w-8 h-8 mx-auto opacity-50 mb-2" />
        <p className="text-sm text-text-muted">
          Chưa có mục tiêu thể chất. Vào <Link href="/roadmap" className="text-primary hover:underline">Hành Trình</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {primary && (
        <Link
          href={`/roadmap?goalId=${primary.id}`}
          className="block relative overflow-hidden rounded-2xl shadow-soft h-[220px] group"
        >
          <div className="absolute inset-0 transition-transform group-hover:scale-105" style={{ background: HERO_GRADIENT }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
          <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between text-white">
            <div>
              <p className="label-eyebrow text-white/70">Physical Harmony</p>
              <h3 className="text-xl sm:text-2xl font-semibold mt-1">{primary.name}</h3>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold tabular-nums leading-none">
                  {sessions.filter((s) => s.goalId === primary.id && s.completed).length}
                </p>
                <p className="text-sm text-white/80">buổi đã hoàn thành</p>
              </div>
              <Progress value={primary.progress} className="h-1.5 mt-2 bg-white/20" />
            </div>
          </div>
        </Link>
      )}

      {secondary && (
        <Link
          href={`/roadmap?goalId=${secondary.id}`}
          className="block glass rounded-2xl p-4 shadow-soft hover:border-primary/50 transition group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium truncate">{secondary.name}</p>
              <p className="text-xs text-text-muted">{secondary.time} · {secondary.duration} phút</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {secondary.schedule.map((d) => (
                  <Badge key={d} variant="secondary" className="text-[10px]">
                    {dowShortVi(d)}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">
              {secondary.progress >= 100 ? "Hoàn thành" : "Đang tập"}
            </Badge>
          </div>
        </Link>
      )}
    </div>
  );
}
