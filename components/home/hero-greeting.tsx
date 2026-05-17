"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { dateKey, formatViDate, greetingForHour, startOfTimeOfDay } from "@/lib/utils/date-helpers";
import { getSubtitleForDate } from "@/data/quotes";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import type { GreetingOverride, TimeSlot } from "@/types/customizations";

function pickGreeting(name: string, now: Date, override: GreetingOverride): string {
  const tod = startOfTimeOfDay(now) as TimeSlot;
  const items = override.items?.[tod] ?? [];

  // 1) Có gán cho ngày cụ thể?
  const dk = dateKey(now);
  const scheduledId = override.schedule?.[dk]?.[tod];
  if (scheduledId) {
    const item = items.find((i) => i.id === scheduledId);
    if (item) return item.text.replace(/\{name\}/g, name.trim() || "anh yêu");
  }

  // 2) Có items → random theo dayOfYear
  if (items.length > 0) {
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.abs(Math.floor((now.getTime() - start.getTime()) / 86_400_000));
    const item = items[dayOfYear % items.length]!;
    return item.text.replace(/\{name\}/g, name.trim() || "anh yêu");
  }

  // 3) Fallback hardcoded greeting (chỉ scaffold UI)
  return greetingForHour(name, now);
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
        <h1 className="text-[28px] sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-[1.15]">
          {pickGreeting(settings.userName ?? "anh yêu", now, custom.greetings)}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-xl text-balance font-light leading-relaxed">
          {getSubtitleForDate(now)}
        </p>
      </div>

      <div className="md:text-right shrink-0">
        <p className="label-eyebrow">{formatViDate(now)}</p>
        <p className="mt-1 font-mono font-semibold text-3xl sm:text-4xl tabular-nums gradient-text leading-none">
          {formatClock(now)}
        </p>
      </div>
    </motion.section>
  );
}
