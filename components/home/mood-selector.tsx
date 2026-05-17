"use client";

import { motion } from "framer-motion";
import { useMoods } from "@/lib/hooks/use-moods";
import { cn } from "@/lib/utils";
import type { MoodKind } from "@/types";

const MOODS: { kind: MoodKind; label: string }[] = [
  { kind: "peaceful", label: "Bình yên" },
  { kind: "energetic", label: "Năng lượng" },
  { kind: "sleepy", label: "Ngái ngủ" },
  { kind: "creative", label: "Sáng tạo" },
];

export function MoodSelector() {
  const { todayMood, addMood } = useMoods();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="glass rounded-3xl p-7 shadow-soft"
    >
      <p className="label-eyebrow mb-5">Cảm xúc lúc này</p>
      <div
        role="radiogroup"
        aria-label="Chọn cảm xúc hiện tại"
        className="flex flex-wrap gap-2"
      >
        {MOODS.map((m) => {
          const active = todayMood === m.kind;
          return (
            <button
              key={m.kind}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => addMood(m.kind)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-all",
                "border border-border/60",
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-surface/40 text-text-secondary hover:text-text-primary hover:bg-surface/70",
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
