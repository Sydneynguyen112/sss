"use client";

import { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useGoals } from "@/lib/hooks/use-goals";
import { JourneyHero } from "./journey-hero";
import { TodaySessionCard } from "./today-session-card";
import { GoalExerciseCard } from "./goal-exercise-card";
import { buttonVariants } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const ProgressChart = dynamic(() => import("./progress-chart"), { ssr: false });

export function RoadmapShell({ scrollToGoalId }: { scrollToGoalId?: string }) {
  const { goals } = useGoals();

  useEffect(() => {
    if (!scrollToGoalId) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`goal-card-${scrollToGoalId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => clearTimeout(t);
  }, [scrollToGoalId]);

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <JourneyHero />
        <TodaySessionCard />
      </div>

      <ProgressChart />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="label-eyebrow">Hôm nay</p>
            <h2 className="text-2xl sm:text-3xl font-bold">Gợi ý bài tập theo mục tiêu</h2>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center space-y-3">
            <Compass className="w-10 h-10 mx-auto opacity-60 text-primary" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold">Hành trình chưa bắt đầu</h3>
            <p className="text-text-secondary max-w-md mx-auto text-balance">
              Hoàn tất phần giới thiệu để hệ thống tạo ra phiên tập đầu tiên cho bạn.
            </p>
            <Link href="/" className={cn(buttonVariants())}>
              Quay về trang chủ
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {goals.map((g) => (
              <GoalExerciseCard key={g.id} goal={g} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
