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

export function HeroGreeting() {
  const { settings } = useTheme();
  const custom = useCustomizations();
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-3 py-2 sm:py-4"
    >
      <p className="label-eyebrow">{formatViDate(now)}</p>
      <h1 className="text-[28px] sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-[1.15]">
        {pickGreeting(settings.userName ?? "anh yêu", now, custom.greetings)}
      </h1>
      <p className="text-text-secondary text-sm sm:text-base max-w-xl text-balance font-light leading-relaxed">
        {getSubtitleForDate(now)}
      </p>
    </motion.section>
  );
}
