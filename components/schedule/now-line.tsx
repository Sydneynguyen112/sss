"use client";

import { useEffect, useState } from "react";
import { nowTopPx, isWithinTimeline, TIMELINE_HEIGHT } from "@/lib/utils/timeline-math";
import { formatHM } from "@/lib/utils/date-helpers";

export function NowLine() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(i);
  }, []);

  const hhmm = formatHM(now);
  if (!isWithinTimeline(hhmm)) return null;
  const top = nowTopPx(now);
  if (top < 0 || top > TIMELINE_HEIGHT) return null;

  return (
    <div
      className="absolute left-0 right-0 z-30 pointer-events-none"
      style={{ top }}
      aria-label={`Bây giờ ${hhmm}`}
    >
      <div className="relative flex items-center">
        <span className="absolute -left-1 w-3 h-3 rounded-full bg-danger shadow-glow" />
        <span className="absolute left-5 text-[10px] font-bold text-danger bg-background/80 px-1 rounded">
          {hhmm}
        </span>
        <div className="h-px w-full bg-danger" />
      </div>
    </div>
  );
}
