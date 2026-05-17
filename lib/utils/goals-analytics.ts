import type { Goal, Session, GoalTemplate } from "@/types";
import { addDays, dateKey, daysBetween, parseKey } from "./date-helpers";
import { findTemplate } from "@/data/goal-templates";

export function getFocusHoursByDay(
  sessions: Session[],
  goals: Goal[],
  fromDate: Date,
  days = 7,
): { label: string; hours: number; dateKey: string }[] {
  const labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const out: { label: string; hours: number; dateKey: string }[] = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(fromDate, i);
    const dk = dateKey(d);
    const done = sessions.filter((s) => s.date === dk && s.completed);
    const minutes = done.reduce((acc, s) => {
      const g = goals.find((x) => x.id === s.goalId);
      return acc + (g?.duration ?? 30);
    }, 0);
    const dowIdx = (d.getDay() + 6) % 7; // Mon=0
    out.push({ label: labels[dowIdx]!, hours: minutes / 60, dateKey: dk });
  }
  return out;
}

export function getMonthlySessionCounts(
  sessions: Session[],
  year: number,
): { label: string; sessions: number; monthIdx: number }[] {
  const monthLabels = ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"];
  const counts = new Array(12).fill(0) as number[];
  for (const s of sessions) {
    if (!s.completed) continue;
    const d = parseKey(s.date);
    if (d.getFullYear() === year) counts[d.getMonth()]! += 1;
  }
  return monthLabels.map((label, idx) => ({ label, sessions: counts[idx]!, monthIdx: idx }));
}

export function getFocusStreak(sessions: Session[], today: Date = new Date()): number {
  const done = new Set(sessions.filter((s) => s.completed).map((s) => s.date));
  let streak = 0;
  const cursor = new Date(today);
  while (done.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getCompletionPercent(goals: Goal[]): number {
  if (goals.length === 0) return 0;
  const avg = goals.reduce((a, g) => a + g.progress, 0) / goals.length;
  return Math.round(avg);
}

export function getDaysRemaining(goal: Goal, today: Date = new Date()): number {
  const start = parseKey(goal.startDate);
  const endDate = addDays(start, goal.durationWeeks * 7);
  if (endDate < today) return 0;
  return daysBetween(endDate, today);
}

export function categorize(goals: Goal[]) {
  const out: Record<"learning" | "physical" | "creative", Goal[]> = {
    learning: [],
    physical: [],
    creative: [],
  };
  for (const g of goals) {
    const tpl = findTemplate(g.templateKey);
    if (!tpl) continue;
    out[tpl.category].push(g);
  }
  return out;
}

export function withTemplate(goals: Goal[]): { goal: Goal; template: GoalTemplate }[] {
  const out: { goal: Goal; template: GoalTemplate }[] = [];
  for (const g of goals) {
    const t = findTemplate(g.templateKey);
    if (t) out.push({ goal: g, template: t });
  }
  return out;
}
