import { addMinutesHHMM, minutesFromMidnight } from "./date-helpers";

export const TIMELINE_START_HOUR = 6;
export const TIMELINE_END_HOUR = 22;
export const PX_PER_HOUR = 60;
export const TIMELINE_HEIGHT = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * PX_PER_HOUR;

export function minutesFromStart(hhmm: string): number {
  return minutesFromMidnight(hhmm) - TIMELINE_START_HOUR * 60;
}

export function eventTop(hhmm: string): number {
  return Math.max(0, minutesFromStart(hhmm));
}

export function eventHeight(start: string, end: string): number {
  const startMin = minutesFromStart(start);
  const endMin = Math.min(
    minutesFromStart(end),
    (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60,
  );
  return Math.max(28, endMin - startMin);
}

export function isWithinTimeline(hhmm: string): boolean {
  const m = minutesFromMidnight(hhmm);
  return m >= TIMELINE_START_HOUR * 60 && m < TIMELINE_END_HOUR * 60;
}

export function nowTopPx(now: Date): number {
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return eventTop(hhmm);
}

export function endTimeFromDuration(start: string, durationMinutes: number): string {
  return addMinutesHHMM(start, durationMinutes);
}

export function hoursRange(): { hour: number; label: string; top: number }[] {
  const out: { hour: number; label: string; top: number }[] = [];
  for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
    out.push({
      hour: h,
      label: `${String(h).padStart(2, "0")}:00`,
      top: (h - TIMELINE_START_HOUR) * PX_PER_HOUR,
    });
  }
  return out;
}
