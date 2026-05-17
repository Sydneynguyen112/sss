"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Calendar as CalendarIcon,
  UtensilsCrossed,
  Target,
  Sparkles,
  MessageSquare,
  Briefcase,
  Moon,
  type LucideIcon,
} from "lucide-react";
import { useSchedule } from "@/lib/hooks/use-schedule";
import { dateKey, formatHM, formatViShort } from "@/lib/utils/date-helpers";
import { useEffect, useState } from "react";
import type { EventType } from "@/types";

const ICON_BY_TYPE: Record<EventType, LucideIcon> = {
  meal: UtensilsCrossed,
  goal: Target,
  self: Sparkles,
  meeting: MessageSquare,
  work: Briefcase,
  rest: Moon,
};

export function TodaySchedulePreview() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(i);
  }, []);

  const { upcomingFromNow } = useSchedule();
  const today = dateKey(now);
  const upcoming = upcomingFromNow(today, formatHM(now), 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      className="glass rounded-3xl p-7 shadow-soft"
    >
      <div className="flex items-baseline justify-between mb-5">
        <p className="label-eyebrow">Lịch trình hôm nay</p>
        <span className="text-xs text-text-muted tabular-nums">{formatViShort(now)}</span>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-text-muted">
          <CalendarIcon className="w-6 h-6 opacity-40" strokeWidth={1.25} />
          <p className="text-sm text-center">Chưa có sự kiện sắp tới — cứ nghỉ ngơi.</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {upcoming.map((e) => {
            const Icon = ICON_BY_TYPE[e.type];
            return (
              <li key={e.id}>
                <Link
                  href={`/schedule?date=${today}`}
                  className="flex items-center gap-4 py-3 px-1 rounded-xl hover:bg-tertiary/30 transition group"
                >
                  <div className="flex flex-col items-end shrink-0 w-14 tabular-nums">
                    <span className="text-sm font-semibold text-primary leading-none">{e.time}</span>
                    <span className="text-[10px] text-text-muted mt-1">{e.endTime}</span>
                  </div>
                  <div className="w-px self-stretch bg-border/60" aria-hidden />
                  <Icon className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.title}</p>
                    {e.description && (
                      <p className="text-xs text-text-muted truncate mt-0.5">{e.description}</p>
                    )}
                  </div>
                  <ChevronRight
                    className="w-4 h-4 text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
