import { RoadmapShell } from "@/components/roadmap/roadmap-shell";

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ goalId?: string }>;
}) {
  const sp = await searchParams;
  return <RoadmapShell scrollToGoalId={sp.goalId} />;
}
