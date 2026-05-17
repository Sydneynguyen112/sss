"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { getQuoteForDate } from "@/data/quotes";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import { pickForToday } from "@/lib/utils/pick-for-today";

const MOUNTAIN_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E0FBFC"/>
      <stop offset="60%" stop-color="#C8E6F0"/>
      <stop offset="100%" stop-color="#A6CFE2"/>
    </linearGradient>
    <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8AA7B7" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#5A7E92" stop-opacity="0.75"/>
    </linearGradient>
    <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6B8A9C" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#3F5E73" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#sky)"/>
  <path d="M0,360 L160,260 L320,300 L500,220 L680,280 L860,240 L1040,300 L1200,270 L1200,600 L0,600 Z" fill="url(#mtn1)"/>
  <path d="M0,420 L160,330 L320,370 L500,300 L680,360 L860,320 L1040,380 L1200,350 L1200,600 L0,600 Z" fill="url(#mtn2)"/>
</svg>
`);

export function QuoteCard() {
  const custom = useCustomizations();
  const quote = useMemo(() => {
    const now = new Date();
    if (custom.quote.enabled && custom.quote.items.length > 0) {
      const picked = pickForToday(custom.quote.items, custom.quote.mode, custom.quote.schedule, now, custom.quote.fixedId);
      if (picked) return { text: picked.text, author: picked.author };
    }
    return getQuoteForDate(now);
  }, [custom.quote]);
  const customImage = useMemo(() => {
    if (!custom.background.enabled || custom.background.items.length === 0) return null;
    const picked = pickForToday(custom.background.items, custom.background.mode, custom.background.schedule, new Date(), custom.background.fixedId);
    return picked?.imageUrl ?? null;
  }, [custom.background]);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl shadow-soft w-full h-full min-h-[260px]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: customImage
            ? `url("${customImage}")`
            : `url("data:image/svg+xml,${MOUNTAIN_SVG}")`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(10,25,41,0.18) 55%, rgba(10,25,41,0.55) 100%)",
        }}
        aria-hidden
      />

      <span
        aria-hidden
        className="absolute top-5 left-7 font-serif text-white/35 leading-none select-none"
        style={{ fontSize: "120px", letterSpacing: "-0.05em" }}
      >
        &ldquo;
      </span>

      <div className="relative h-full flex flex-col justify-end p-7 sm:p-8 text-white">
        <blockquote className="text-lg sm:text-xl font-light leading-snug text-balance">
          {quote.text}
        </blockquote>
        <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-white/70 font-medium">
          {quote.author}
        </figcaption>
      </div>
    </motion.figure>
  );
}
