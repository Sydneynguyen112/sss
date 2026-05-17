import { Suspense } from "react";
import { ScheduleShell } from "@/components/schedule/schedule-shell";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Suspense fallback={null}>
      <ScheduleShell initialDate={sp.date} />
    </Suspense>
  );
}
