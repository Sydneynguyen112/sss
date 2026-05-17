"use client";

import { motion } from "framer-motion";
import { useGoals } from "@/lib/hooks/use-goals";
import { deriveHeroTitle, overallProgress } from "@/lib/utils/roadmap-content";
import { Progress } from "@/components/ui/progress";

const HERO_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A3A4F"/>
      <stop offset="35%" stop-color="#0077C2"/>
      <stop offset="70%" stop-color="#FFC371"/>
      <stop offset="100%" stop-color="#FF7E6B"/>
    </linearGradient>
    <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4FA8E0"/>
      <stop offset="100%" stop-color="#0A1929"/>
    </linearGradient>
    <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2D5A7B"/>
      <stop offset="100%" stop-color="#1A3A4F"/>
    </linearGradient>
    <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#132F4C"/>
      <stop offset="100%" stop-color="#0A1929"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#sky)"/>
  <circle cx="900" cy="180" r="60" fill="#FFF8E1" opacity="0.85"/>
  <circle cx="900" cy="180" r="90" fill="#FFF8E1" opacity="0.18"/>
  <path d="M0,360 L160,250 L320,290 L500,200 L680,260 L860,220 L1040,280 L1200,250 L1200,400 L0,400 Z" fill="url(#mtn1)"/>
  <path d="M0,400 L120,340 L260,370 L420,310 L600,360 L780,330 L960,380 L1200,350 L1200,440 L0,440 Z" fill="url(#mtn2)"/>
  <rect x="0" y="440" width="1200" height="160" fill="url(#lake)"/>
  <g opacity="0.4">
    <ellipse cx="240" cy="470" rx="80" ry="3" fill="#fff"/>
    <ellipse cx="600" cy="490" rx="120" ry="3" fill="#fff"/>
    <ellipse cx="940" cy="510" rx="100" ry="3" fill="#fff"/>
  </g>
</svg>
`);

export function JourneyHero() {
  const { goals } = useGoals();
  const { eyebrow, title, tagline } = deriveHeroTitle(goals);
  const pct = overallProgress(goals);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl shadow-soft h-[280px] sm:h-[340px] md:h-[400px]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("data:image/svg+xml,${HERO_SVG}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

      <div className="relative h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between text-white">
        <p className="label-eyebrow text-white/80 tracking-[0.15em]">{eyebrow}</p>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-balance max-w-2xl drop-shadow-md">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-xl text-balance">
            {tagline}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">Tiến độ tổng</span>
              <span className="font-bold tabular-nums">{pct}% Hoàn thành</span>
            </div>
            <Progress value={pct} className="h-2 bg-white/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
