import { GoalsHeader } from "@/components/goals/goals-header";
import { StatsColumn } from "@/components/goals/stats-column";
import { LearningStreams } from "@/components/goals/learning-streams";
import { PhysicalHarmony } from "@/components/goals/physical-harmony";
import { ActivityChart } from "@/components/goals/lazy-charts";

export default function GoalsPage() {
  return (
    <div className="space-y-8">
      <GoalsHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <StatsColumn />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LearningStreams />
        <PhysicalHarmony />
      </div>
    </div>
  );
}
