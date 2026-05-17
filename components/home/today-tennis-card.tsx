"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Trophy, Heart } from "lucide-react";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import { dateKey } from "@/lib/utils/date-helpers";
import { getProgramDay, type TennisDrill } from "@/data/tennis-program";
import type { TennisDrillOverride } from "@/types/customizations";

function mergeDrills(defaults: TennisDrill[], override?: TennisDrillOverride[]): TennisDrill[] {
  if (!override || override.length === 0) return defaults;
  return override.map((o, i) => ({
    name: o.name ?? defaults[i]?.name ?? "",
    minutes: o.minutes ?? defaults[i]?.minutes ?? 0,
    description: o.description ?? defaults[i]?.description ?? "",
  }));
}

export function TodayTennisCard() {
  const custom = useCustomizations();
  const today = useMemo(() => new Date(), []);
  const dk = dateKey(today);
  const program = useMemo(() => getProgramDay(dk), [dk]);

  if (!program) {
    return null; // Outside program window
  }

  const ov = custom.tennis?.days?.[dk];
  const drills = mergeDrills(program.drills, ov?.drills);
  const note = ov?.note ?? program.note;
  const totalMins = drills.reduce((a, d) => a + d.minutes, 0);

  // Days until 15/07
  const target = new Date("2026-07-15T00:00:00");
  const daysLeft = Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86_400_000));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
      className="glass rounded-3xl p-6 sm:p-7 shadow-soft w-full h-full flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="label-eyebrow flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-warning" />
            Lịch trình Tennis
          </p>
          <h2 className="text-xl font-semibold mt-1 leading-tight">{program.weekFocus}</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Tới giải</p>
          <p className="text-2xl font-bold tabular-nums text-primary leading-none">{daysLeft}</p>
          <p className="text-[10px] text-text-muted">ngày</p>
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs text-text-muted mb-3">
        <Clock className="w-3 h-3" />
        <span className="tabular-nums">{totalMins} phút</span>
        <span>·</span>
        <span>{drills.length} drill</span>
      </div>

      <ol className="space-y-2 flex-1">
        {drills.map((d, idx) => (
          <li key={idx} className="rounded-lg border border-border/50 p-2.5 flex gap-2.5">
            <span className="grid place-items-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold tabular-nums shrink-0">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium leading-tight">{d.name}</p>
                <span className="text-[10px] text-text-muted tabular-nums shrink-0">{d.minutes}p</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{d.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {note && (
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 mt-3 text-xs text-text-primary leading-relaxed">
          <p className="inline-flex items-center gap-1 font-semibold text-primary mb-0.5">
            <Heart className="w-3 h-3 fill-primary" />
            Em nhắn
          </p>
          {note}
        </div>
      )}
    </motion.div>
  );
}
