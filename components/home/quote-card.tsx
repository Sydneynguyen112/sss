"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import { pickForToday } from "@/lib/utils/pick-for-today";

const MOUNTAIN_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1726"/>
      <stop offset="100%" stop-color="#0B0A14"/>
    </linearGradient>
    <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3A2E3F" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#1F1A26" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#sky)"/>
  <path d="M0,420 L200,300 L400,360 L600,260 L800,340 L1000,290 L1200,330 L1200,600 L0,600 Z" fill="url(#mtn1)"/>
</svg>
`);

export function QuoteCard() {
  const custom = useCustomizations();
  const picked = useMemo(
    () => pickForToday(custom.quote.items, custom.quote.schedule, new Date()),
    [custom.quote],
  );

  const imageUrl = picked?.imageUrl;

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
          backgroundImage: imageUrl
            ? `url("${imageUrl}")`
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
        {picked ? (
          <>
            <blockquote className="text-lg sm:text-xl font-light leading-snug text-balance">
              {picked.text}
            </blockquote>
            {picked.author && (
              <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-white/70 font-medium">
                {picked.author}
              </figcaption>
            )}
          </>
        ) : (
          <p className="text-sm font-light text-white/70 leading-relaxed">
            Em chưa gửi châm ngôn nào — sẽ có sớm thôi anh ơi ♡
          </p>
        )}
      </div>
    </motion.figure>
  );
}
