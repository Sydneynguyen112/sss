"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { MiniCalendar } from "./mini-calendar";
import { GoalsSidebar } from "./goals-sidebar";
import { DayTimeline } from "./day-timeline";
import { EventCreateDialog } from "./event-create-dialog";
import { GoalFilterTabs } from "./goal-filter-tabs";
import { useSchedule } from "@/lib/hooks/use-schedule";
import { dateKey, parseKey, formatViDate, dowLabelVi, dayOfWeek } from "@/lib/utils/date-helpers";

export function ScheduleShell({ initialDate }: { initialDate?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startKey = initialDate || searchParams.get("date") || dateKey(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    try { return parseKey(startKey); } catch { return new Date(); }
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const { getEventsForDate } = useSchedule();

  useEffect(() => {
    const q = new URLSearchParams(searchParams.toString());
    q.set("date", dateKey(selectedDate));
    router.replace(`/schedule?${q.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const allEvents = getEventsForDate(dateKey(selectedDate));
  const events = selectedGoalId
    ? allEvents.filter((e) => e.goalId === selectedGoalId)
    : allEvents;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label-eyebrow">{dowLabelVi(dayOfWeek(selectedDate)).toUpperCase()}</p>
          <h1 className="text-2xl sm:text-3xl font-bold capitalize">
            {formatViDate(selectedDate, "d MMMM yyyy")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "lg:hidden",
              )}
            >
              <CalendarIcon className="w-4 h-4 mr-1.5" />
              Lịch
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] sm:w-[360px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Lịch & mục tiêu</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4 px-4 pb-6">
                <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
                <GoalsSidebar date={selectedDate} />
              </div>
            </SheetContent>
          </Sheet>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Thêm
          </Button>
        </div>
      </header>

      <GoalFilterTabs
        selectedGoalId={selectedGoalId}
        onSelect={setSelectedGoalId}
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <aside className="hidden lg:flex flex-col gap-4">
          <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
          <GoalsSidebar date={selectedDate} />
        </aside>

        <section className="min-w-0">
          <DayTimeline events={events} selectedDate={selectedDate} />
        </section>
      </div>

      <EventCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultDate={dateKey(selectedDate)}
      />
    </div>
  );
}
