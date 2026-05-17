import type { Event, Goal, MealSlot } from "@/types";
import { addDays, addMinutesHHMM, dateKey, dayOfWeek } from "./date-helpers";
import { MEAL_SLOT_TIMES, mealsForSlot } from "@/data/meals";
import { findTemplate } from "@/data/goal-templates";
import { resolveSession } from "./session-content";

const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "snack", "dinner"];
const MEAL_TITLE_VI: Record<MealSlot, string> = {
  breakfast: "Bữa sáng",
  lunch: "Bữa trưa",
  snack: "Bữa xế",
  dinner: "Bữa tối",
};

function pickMeal(slot: MealSlot, dayIndex: number) {
  const list = mealsForSlot(slot);
  return list[dayIndex % list.length]!;
}

function dayIndexFromDate(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.abs(Math.floor((d.getTime() - start.getTime()) / 86_400_000));
}

export function generateSchedule(goals: Goal[], fromDate: Date, days = 14): Event[] {
  const out: Event[] = [];
  for (let d = 0; d < days; d++) {
    const date = addDays(fromDate, d);
    const dKey = dateKey(date);
    const dow = dayOfWeek(date);
    const dayIdx = dayIndexFromDate(date);

    for (const slot of MEAL_SLOTS) {
      const meal = pickMeal(slot, dayIdx);
      const { start, duration } = MEAL_SLOT_TIMES[slot];
      out.push({
        id: `evt-${dKey}-meal-${slot}`,
        date: dKey,
        time: start,
        endTime: addMinutesHHMM(start, duration),
        title: `${MEAL_TITLE_VI[slot]} · ${meal.name}`,
        type: "meal",
        description: meal.tip,
        tags: [slot],
        mealData: {
          kcal: meal.kcal,
          protein: meal.protein,
          ingredients: meal.ingredients,
        },
      });
    }

    for (const g of goals) {
      const template = findTemplate(g.templateKey);
      if (!template) continue;
      const onSchedule = g.schedule.includes(dow);
      const session = resolveSession(g, date);
      if (!session) continue;

      if (onSchedule) {
        out.push({
          id: `evt-${dKey}-goal-${g.id}`,
          date: dKey,
          time: g.time,
          endTime: addMinutesHHMM(g.time, g.duration),
          title: `${g.name} · ${session.name}`,
          type: "goal",
          description: session.summary,
          tags: [template.shortName],
          goalId: g.id,
        });
      } else if (session.kind === "homeDrill") {
        const time = template.homeDrillTime ?? "18:00";
        const duration = template.homeDrillDuration ?? 20;
        out.push({
          id: `evt-${dKey}-home-${g.id}`,
          date: dKey,
          time,
          endTime: addMinutesHHMM(time, duration),
          title: `${g.name} · Tại nhà · ${session.name}`,
          type: "self",
          description: session.summary,
          tags: [template.shortName, "Tại nhà"],
          goalId: g.id,
        });
      }
    }
  }
  return out;
}

export function mergeSchedule(existing: Event[], next: Event[]): Event[] {
  const byId = new Map(existing.map((e) => [e.id, e]));
  for (const ev of next) {
    const cur = byId.get(ev.id);
    if (!cur) {
      byId.set(ev.id, ev);
      continue;
    }
    // Preserve user-edited fields (attachments, custom notes) but refresh title/time/desc
    byId.set(ev.id, {
      ...cur,
      title: ev.title,
      time: ev.time,
      endTime: ev.endTime,
      description: ev.description,
      tags: ev.tags,
      mealData: ev.mealData,
    });
  }
  return Array.from(byId.values()).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
}
