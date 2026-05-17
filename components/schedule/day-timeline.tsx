"use client";

import { useState } from "react";
import type { Event } from "@/types";
import { hoursRange, TIMELINE_HEIGHT } from "@/lib/utils/timeline-math";
import { EventCard } from "./event-card";
import { NowLine } from "./now-line";
import { EventModal } from "./event-modal";
import { isSameDay } from "@/lib/utils/date-helpers";

export function DayTimeline({
  events,
  selectedDate,
}: {
  events: Event[];
  selectedDate: Date;
}) {
  const [openEvent, setOpenEvent] = useState<Event | null>(null);
  const hours = hoursRange();
  const showNow = isSameDay(selectedDate, new Date());

  // Simple overlap offset: events sharing exact same time slot get cascaded
  const offsetMap = computeOffsets(events);

  return (
    <>
      <div
        className="relative w-full scrollbar-thin overflow-y-auto"
        style={{ maxHeight: "70vh" }}
      >
        <div className="relative" style={{ height: TIMELINE_HEIGHT + 24 }}>
          {hours.map((h) => (
            <div
              key={h.hour}
              className="absolute left-0 right-0 border-t border-border/60"
              style={{ top: h.top }}
            >
              <span className="absolute -top-2 left-0 text-[10px] tabular-nums font-medium text-text-muted bg-background pr-1">
                {h.label}
              </span>
            </div>
          ))}

          {events.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              onClick={() => setOpenEvent(e)}
              leftOffset={(offsetMap.get(e.id) ?? 0) * 12}
            />
          ))}

          {showNow && <NowLine />}
        </div>
      </div>

      <EventModal
        event={openEvent}
        open={!!openEvent}
        onOpenChange={(v) => !v && setOpenEvent(null)}
      />
    </>
  );
}

function computeOffsets(events: Event[]): Map<string, number> {
  const map = new Map<string, number>();
  // group by start time
  const byTime = new Map<string, Event[]>();
  for (const e of events) {
    const list = byTime.get(e.time) ?? [];
    list.push(e);
    byTime.set(e.time, list);
  }
  for (const list of byTime.values()) {
    list.forEach((e, i) => map.set(e.id, i));
  }
  return map;
}
