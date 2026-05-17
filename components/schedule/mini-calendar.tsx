"use client";

import { Calendar } from "@/components/ui/calendar";
import { useSchedule } from "@/lib/hooks/use-schedule";
import { vi } from "date-fns/locale";
import { dateKey } from "@/lib/utils/date-helpers";
import { cn } from "@/lib/utils";

export function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: Date;
  onSelect: (d: Date) => void;
}) {
  const { datesWithEvents } = useSchedule();

  return (
    <div className="glass rounded-2xl p-3 shadow-soft">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(d) => d && onSelect(d)}
        locale={vi}
        showOutsideDays
        modifiers={{
          hasEvent: (d) => datesWithEvents.has(dateKey(d)),
        }}
        modifiersClassNames={{
          hasEvent:
            "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
        }}
        className={cn("p-0")}
      />
    </div>
  );
}
