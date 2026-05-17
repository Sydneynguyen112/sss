"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { getKeywordForDate } from "@/data/keywords";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import { pickForToday } from "@/lib/utils/pick-for-today";

export function DailyKeyword() {
  const custom = useCustomizations();
  const kw = useMemo(() => {
    const now = new Date();
    if (custom.keyword.enabled && custom.keyword.items.length > 0) {
      const picked = pickForToday(
        custom.keyword.items,
        custom.keyword.mode,
        custom.keyword.schedule,
        now,
        custom.keyword.fixedId,
      );
      if (picked) {
        return {
          word: picked.word,
          wordEn: picked.wordEn,
          ipa: picked.ipa,
          tagline: picked.tagline,
        };
      }
    }
    const def = getKeywordForDate(now);
    return { word: def.word, wordEn: def.wordEn, ipa: undefined, tagline: def.tagline };
  }, [custom.keyword]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="glass rounded-3xl p-7 sm:p-8 shadow-soft relative overflow-hidden w-full h-full flex flex-col justify-center"
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
          {kw.wordEn && (
            <span className="text-sm sm:text-base text-text-muted font-light tracking-[0.04em] uppercase">
              / {kw.wordEn}
            </span>
          )}
        </div>
        {kw.ipa && (
          <p className="mt-2 text-sm text-primary font-mono">{kw.ipa}</p>
        )}
        <p className="mt-4 text-sm sm:text-base text-text-secondary font-light leading-relaxed text-balance max-w-md">
          {kw.tagline}
        </p>
      </div>
    </motion.div>
  );
}
