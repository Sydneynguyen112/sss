"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { getKeywordForDate } from "@/data/keywords";

export function DailyKeyword() {
  const kw = useMemo(() => getKeywordForDate(new Date()), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="glass rounded-3xl p-7 sm:p-8 shadow-soft relative overflow-hidden"
    >
      <span
        aria-hidden
        className="absolute -top-6 -right-2 font-serif text-primary/8 select-none leading-none"
        style={{ fontSize: "180px", letterSpacing: "-0.06em" }}
      >
        &ldquo;
      </span>

      <div className="relative">
        <p className="label-eyebrow mb-3">Từ khoá hôm nay</p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight gradient-text leading-none">
            {kw.word}
          </h2>
          <span className="text-sm sm:text-base text-text-muted font-light tracking-[0.04em] uppercase">
            / {kw.wordEn}
          </span>
        </div>
        <p className="mt-4 text-sm sm:text-base text-text-secondary font-light leading-relaxed text-balance max-w-md">
          {kw.tagline}
        </p>
      </div>
    </motion.div>
  );
}
