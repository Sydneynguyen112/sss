"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Coffee, UtensilsCrossed, Moon, Flame, Drumstick, Heart } from "lucide-react";
import { getTodayMeals, MEAL_SLOT_LABELS } from "@/lib/utils/today-meals";
import { useSessions } from "@/lib/hooks/use-sessions";
import { useCustomizations } from "@/lib/hooks/use-customizations";
import { dayOfWeek } from "@/lib/utils/date-helpers";
import { InlineMediaUpload } from "./inline-media-upload";
import type { MealOption, MealSlot } from "@/types";

const SLOT_ICON = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  dinner: Moon,
} as const;

const SHOW_SLOTS: ("breakfast" | "lunch" | "dinner")[] = ["breakfast", "lunch", "dinner"];

export function TodayMealsCard() {
  const today = useMemo(() => new Date(), []);
  const todayMeals = useMemo(() => getTodayMeals(today), [today]);
  const { getSessionFor, addMedia, removeMedia } = useSessions();
  const custom = useCustomizations();

  const dow = dayOfWeek(today);
  const weekendDay =
    dow === "Sat" ? custom.weekendMeals.saturday :
    dow === "Sun" ? custom.weekendMeals.sunday : null;
  const dailyBreakfastOverride = custom.weekendMeals.enabled
    ? custom.weekendMeals.dailyBreakfast
    : null;

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
          <h2 className="text-xl font-semibold mt-1">3 bữa cho anh</h2>
        </div>
        <p className="text-xs text-text-muted">Profile · Bulk · 1m70/60kg</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {SHOW_SLOTS.map((slot) => {
          const data = todayMeals[slot];
          const Icon = SLOT_ICON[slot];
          const session = getSessionFor(`meal-${slot}`, today);
          const weekendText =
            custom.weekendMeals.enabled && weekendDay
              ? weekendDay[slot]
              : undefined;
          return (
            <div
              key={slot}
              className="rounded-2xl border border-border/60 bg-surface/30 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-text-secondary">
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span className="text-[10px] uppercase tracking-[0.16em] font-medium">
                    {MEAL_SLOT_LABELS[slot]}
                  </span>
                </div>
                <span className="text-[10px] tabular-nums text-text-muted">{data.time}</span>
              </div>

              <MealBody meal={data.meal} weekendText={weekendText} />

              {slot === "breakfast" && dailyBreakfastOverride?.text && (
                <div className="rounded-lg bg-warning/10 border border-warning/30 p-2 text-[11px] text-text-primary leading-relaxed">
                  <p className="inline-flex items-center gap-1 font-semibold text-warning mb-0.5">
                    <Heart className="w-3 h-3 fill-warning" />
                    Gợi ý từ em
                  </p>
                  {dailyBreakfastOverride.text}
                </div>
              )}

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

function MealBody({ meal, weekendText }: { meal: MealOption; weekendText?: string }) {
  return (
    <div className="space-y-2 flex-1">
      {weekendText ? (
        <>
          <p className="font-semibold text-sm leading-tight text-primary">{weekendText}</p>
          <p className="text-[10px] text-text-muted italic">Gợi ý cuối tuần từ em</p>
        </>
      ) : (
        <p className="font-semibold text-sm leading-tight">{meal.name}</p>
      )}

      <div className="flex items-center gap-3 text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1">
          <Flame className="w-3 h-3" strokeWidth={1.75} />
          <span className="tabular-nums">{meal.kcal}kcal</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Drumstick className="w-3 h-3" strokeWidth={1.75} />
          <span className="tabular-nums">{meal.protein}g protein</span>
        </span>
      </div>

      <ul className="space-y-0.5">
        {meal.ingredients.slice(0, 4).map((i, idx) => (
          <li key={idx} className="text-[11px] text-text-secondary flex items-center gap-1.5">
            <span className="text-text-muted">·</span>
            <span className="truncate flex-1">{i.name}</span>
            <span className="text-text-muted shrink-0">{i.amount}</span>
          </li>
        ))}
        {meal.ingredients.length > 4 && (
          <li className="text-[10px] text-text-muted">+ {meal.ingredients.length - 4} nguyên liệu khác</li>
        )}
      </ul>
    </div>
  );
}
