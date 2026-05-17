"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { greetingForHour, formatViDate } from "@/lib/utils/date-helpers";
import { getSubtitleForDate } from "@/data/quotes";

export function HeroGreeting() {
  const { settings } = useTheme();
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
        {greetingForHour(settings.userName ?? "anh yêu", now)}
      </h1>
      <p className="text-text-secondary text-sm sm:text-base max-w-xl text-balance font-light leading-relaxed">
        {getSubtitleForDate(now)}
      </p>
    </motion.section>
  );
}
