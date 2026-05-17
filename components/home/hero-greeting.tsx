"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { formatViDate, greetingForHour, startOfTimeOfDay } from "@/lib/utils/date-helpers";
import { getSubtitleForDate } from "@/data/quotes";
import { useCustomizations } from "@/lib/hooks/use-customizations";

function pickGreeting(
  name: string,
  now: Date,
  override: ReturnType<typeof useCustomizations>["greetings"],
): string {
  if (!override.enabled) return greetingForHour(name, now);
  const tod = startOfTimeOfDay(now);
  const map = {
    morning: override.morning,
    noon: override.noon,
    evening: override.evening,
    night: override.night,
  } as const;
  const custom = map[tod];
  if (!custom?.trim()) return greetingForHour(name, now);
  return custom.replace(/\{name\}/g, name.trim() || "anh yêu");
}

function formatClock(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function HeroGreeting() {
  const { settings } = useTheme();
  const custom = useCustomizations();
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 py-2 sm:py-4"
    >
      <div className="space-y-3 min-w-0 flex-1">
        <p className="label-eyebrow">{formatViDate(now)}</p>
        <h1 className="text-[28px] sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-[1.15]">
          {pickGreeting(settings.userName ?? "anh yêu", now, custom.greetings)}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-xl text-balance font-light leading-relaxed">
          {getSubtitleForDate(now)}
        </p>
      </div>

      <div className="md:text-right shrink-0">
        <p className="label-eyebrow">Thời gian hiện tại</p>
        <p className="mt-1 font-mono font-semibold text-2xl sm:text-3xl tabular-nums gradient-text">
          {formatClock(now)}
        </p>
        <p className="text-xs text-text-muted mt-0.5 capitalize">
          {now.toLocaleDateString("vi-VN", { weekday: "long" })}
        </p>
      </div>
    </motion.section>
  );
}
