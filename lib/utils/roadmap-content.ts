import type { Goal, GoalTemplate, SessionTemplate } from "@/types";
import { dayOfWeek } from "./date-helpers";
import { findTemplate } from "@/data/goal-templates";
import { resolveSession, type SessionKind } from "./session-content";

export function deriveHeroTitle(goals: Goal[]): { eyebrow: string; title: string; tagline: string } {
  if (goals.length === 0) {
    return {
      eyebrow: "Hành trình của bạn",
      title: "Luyện tập chánh niệm & Sức bền",
      tagline: "Mỗi ngày một bước nhỏ — đó là cách những điều lớn được xây dựng.",
    };
  }
  const sorted = [...goals].sort((a, b) => b.progress - a.progress);
  const top = sorted[0]!;
  return {
    eyebrow: "Hành trình của bạn",
    title: top.name,
    tagline: `Bạn đã đi được ${top.progress}% — tiếp tục với nhịp của em.`,
  };
}

export function deriveTodayPrimarySession(
  goals: Goal[],
  date: Date = new Date(),
): {
  goal: Goal;
  template: GoalTemplate;
  session: SessionTemplate;
  idx: number;
  kind: SessionKind;
} | null {
  const dow = dayOfWeek(date);
  // Ưu tiên goal có lịch chính hôm nay; nếu không có, lấy goal đầu tiên có homeDrill
  const onSchedule = goals.filter((g) => g.schedule.includes(dow));
  const candidates = onSchedule.length > 0 ? onSchedule : goals.filter((g) => {
    const tpl = findTemplate(g.templateKey);
    return !!tpl?.homeDrills?.length;
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.time.localeCompare(b.time));
  const goal = candidates[0]!;
  const tpl = findTemplate(goal.templateKey);
  if (!tpl) return null;
  const session = resolveSession(goal, date);
  if (!session) return null;
  return { goal, template: tpl, session, idx: session.idx, kind: session.kind };
}

export function totalDurationMinutes(session: SessionTemplate): number {
  return session.steps.reduce((a, s) => a + s.minutes, 0);
}

export function overallProgress(goals: Goal[]): number {
  if (goals.length === 0) return 0;
  return Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length);
}
