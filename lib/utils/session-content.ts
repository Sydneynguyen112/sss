import type { Goal, GoalTemplate, SessionTemplate } from "@/types";
import { findTemplate } from "@/data/goal-templates";
import { dayOfWeek, dayOfWeekIdx, weeksBetween, parseKey } from "./date-helpers";

export type SessionKind = "court" | "homeDrill";

export interface ResolvedSession extends SessionTemplate {
  idx: number;
  kind: SessionKind;
  template: GoalTemplate;
}

function rotateIndex(weeksIn: number, dowIdx: number, len: number): number {
  return ((weeksIn + dowIdx) % len + len) % len;
}

export function resolveSession(goal: Goal, date: Date): ResolvedSession | null {
  const template = findTemplate(goal.templateKey);
  if (!template) return null;
  const start = parseKey(goal.startDate);
  const weeksIn = Math.max(0, weeksBetween(date, start));
  const dowIdx = dayOfWeekIdx(date);
  const dow = dayOfWeek(date);

  // Ngày có lịch chính → dùng dailySessions
  if (goal.schedule.includes(dow) || !template.homeDrills?.length) {
    const len = template.dailySessions.length;
    const idx = rotateIndex(weeksIn, dowIdx, len);
    return { ...template.dailySessions[idx]!, idx, kind: "court", template };
  }

  // Ngày off + template có homeDrills → gợi ý drill tại nhà
  const drills = template.homeDrills;
  const idx = rotateIndex(weeksIn, dowIdx, drills.length);
  return { ...drills[idx]!, idx, kind: "homeDrill", template };
}

export function intensityLabel(durationMinutes: number): "Nhẹ" | "Trung bình" | "Cao" {
  if (durationMinutes < 30) return "Nhẹ";
  if (durationMinutes < 60) return "Trung bình";
  return "Cao";
}
