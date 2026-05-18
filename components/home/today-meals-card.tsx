"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Coffee, UtensilsCrossed, Apple, Moon, Flame, Drumstick, Heart } from "lucide-react";
import { useSessions } from "@/lib/hooks/use-sessions";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import { InlineMediaUpload } from "./inline-media-upload";
import { getDefaultMenu, type DowIdx } from "@/data/meal-program";
import type { MealSlotKey, MealEntry } from "@/types/customizations";

const SLOT_META: Record<MealSlotKey, { label: string; time: string; icon: typeof Coffee }> = {
  breakfast: { label: "Bữa sáng", time: "08:00", icon: Coffee },
  snack: { label: "Bữa phụ", time: "10:00", icon: Apple },
  lunch: { label: "Bữa trưa", time: "12:00", icon: UtensilsCrossed },
  dinner: { label: "Bữa tối", time: "19:00", icon: Moon },
};

const SHOW_SLOTS: MealSlotKey[] = ["breakfast", "snack", "lunch", "dinner"];

function todayDowIdx(now: Date): DowIdx {
  const js = now.getDay();
  return ((js === 0 ? 6 : js - 1) as DowIdx);
}

export function TodayMealsCard() {
  const today = useMemo(() => new Date(), []);
  const { getSessionFor, addMedia, removeMedia } = useSessions();
  const custom = useCustomizations();

  const menu = useMemo(() => {
    const dow = todayDowIdx(today);
    const defaults = getDefaultMenu(dow);
    const override = custom.meals?.program?.[String(dow)] ?? {};
    const out: Record<MealSlotKey, MealEntry> = {} as Record<MealSlotKey, MealEntry>;
    for (const slot of SHOW_SLOTS) {
      out[slot] = override[slot] ?? defaults[slot];
    }
    return out;
  }, [custom.meals, today]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      className="glass rounded-3xl p-6 sm:p-7 shadow-soft w-full h-full flex flex-col"
    >
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="label-eyebrow">Thực đơn hôm nay</p>
          <h2 className="text-xl font-semibold mt-1">4 bữa cho anh</h2>
        </div>
        <p className="text-xs text-text-muted">Em soạn theo profile của anh ♡</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SHOW_SLOTS.map((slot) => {
          const meta = SLOT_META[slot];
          const Icon = meta.icon;
          const item = menu[slot];
          const session = getSessionFor(`meal-${slot}`, today);

          return (
            <div
              key={slot}
              className="rounded-2xl border border-border/60 bg-surface/30 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-text-secondary">
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span className="text-[10px] uppercase tracking-[0.16em] font-medium">
                    {meta.label}
                  </span>
                </div>
                <span className="text-[10px] tabular-nums text-text-muted">{meta.time}</span>
              </div>

              <MealBody item={item} />

              <InlineMediaUpload
                photos={session.photos}
                onAdd={(m) => addMedia(`meal-${slot}`, today, m)}
                onRemove={(id) => removeMedia(`meal-${slot}`, today, id)}
                acceptVideo={false}
                label="Gửi hình ảnh"
                compact
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MealBody({ item }: { item: MealEntry }) {
  return (
    <div className="space-y-2 flex-1">
      <p className="font-semibold text-sm leading-tight">{item.name}</p>

      {(item.kcal !== undefined || item.protein !== undefined) && (
        <div className="flex items-center gap-3 text-[11px] text-text-muted">
          {item.kcal !== undefined && (
            <span className="inline-flex items-center gap-1">
              <Flame className="w-3 h-3 text-warning" strokeWidth={1.75} />
              <span className="tabular-nums">{item.kcal}kcal</span>
            </span>
          )}
          {item.protein !== undefined && (
            <span className="inline-flex items-center gap-1">
              <Drumstick className="w-3 h-3 text-success" strokeWidth={1.75} />
              <span className="tabular-nums">{item.protein}g protein</span>
            </span>
          )}
        </div>
      )}

      {(item.ingredients ?? []).length > 0 && (
        <ul className="space-y-0.5">
          {(item.ingredients ?? []).slice(0, 5).map((i, idx) => (
            <li key={idx} className="text-[11px] text-text-secondary flex items-center gap-1.5">
              <span className="text-text-muted">·</span>
              <span className="truncate flex-1">{i.name}</span>
              <span className="text-text-muted shrink-0">{i.amount}</span>
            </li>
          ))}
          {(item.ingredients ?? []).length > 5 && (
            <li className="text-[10px] text-text-muted">+ {(item.ingredients ?? []).length - 5} nguyên liệu khác</li>
          )}
        </ul>
      )}

      {item.note && (
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-2 text-[11px] text-text-primary leading-relaxed mt-1">
          <p className="inline-flex items-center gap-1 font-semibold text-primary mb-0.5">
            <Heart className="w-3 h-3 fill-primary" />
            Lời nhắn
          </p>
          {item.note}
        </div>
      )}
    </div>
  );
}
