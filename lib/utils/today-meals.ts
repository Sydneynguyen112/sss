import { MEALS, MEAL_SLOT_TIMES, mealsForSlot } from "@/data/meals";
import type { MealOption, MealSlot } from "@/types";

function dayIndex(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.abs(Math.floor((d.getTime() - start.getTime()) / 86_400_000));
}

export type TodayMealsResult = Record<MealSlot, { meal: MealOption; time: string; endTime: string }>;

export function getTodayMeals(date: Date): TodayMealsResult {
  const idx = dayIndex(date);
  const slots: MealSlot[] = ["breakfast", "lunch", "snack", "dinner"];
  const out = {} as TodayMealsResult;
  for (const slot of slots) {
    const list = mealsForSlot(slot);
    const meal = list[idx % list.length]!;
    const { start, duration } = MEAL_SLOT_TIMES[slot];
    const [h, m] = start.split(":").map((s) => parseInt(s, 10));
    const baseMin = h! * 60 + m! + duration;
    const endH = Math.floor(baseMin / 60);
    const endM = baseMin % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    out[slot] = { meal, time: start, endTime };
  }
  return out;
}

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: "Bữa sáng",
  lunch: "Bữa trưa",
  snack: "Bữa xế",
  dinner: "Bữa tối",
};

// Compat export to suppress unused warnings if any caller wants raw MEALS
export { MEALS };
