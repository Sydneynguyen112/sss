import { format, addDays as dfAddDays, addMinutes as dfAddMinutes, differenceInCalendarDays, parseISO, isSameDay as dfIsSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import type { DayOfWeek } from "@/types";

const DOW_MAP: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_LABEL_VI: Record<DayOfWeek, string> = {
  Mon: "Thứ Hai",
  Tue: "Thứ Ba",
  Wed: "Thứ Tư",
  Thu: "Thứ Năm",
  Fri: "Thứ Sáu",
  Sat: "Thứ Bảy",
  Sun: "Chủ Nhật",
};
const DOW_SHORT_VI: Record<DayOfWeek, string> = {
  Mon: "T2",
  Tue: "T3",
  Wed: "T4",
  Thu: "T5",
  Fri: "T6",
  Sat: "T7",
  Sun: "CN",
};

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseKey(key: string): Date {
  return parseISO(key);
}

export function dayOfWeek(d: Date): DayOfWeek {
  return DOW_MAP[d.getDay()]!;
}

export function dayOfWeekIdx(d: Date): number {
  // Mon=0..Sun=6 for human-friendly indexing
  const js = d.getDay();
  return js === 0 ? 6 : js - 1;
}

export function formatViDate(d: Date, fmt: string = "EEEE, d MMMM yyyy"): string {
  return format(d, fmt, { locale: vi });
}

export function formatViShort(d: Date): string {
  return format(d, "d 'thg' M", { locale: vi });
}

export function formatHM(d: Date): string {
  return format(d, "HH:mm");
}

export function dowLabelVi(dow: DayOfWeek): string {
  return DOW_LABEL_VI[dow];
}

export function dowShortVi(dow: DayOfWeek): string {
  return DOW_SHORT_VI[dow];
}

export function parseHHMM(hhmm: string): { hours: number; minutes: number } {
  const [h, m] = hhmm.split(":").map((s) => parseInt(s, 10));
  return { hours: h ?? 0, minutes: m ?? 0 };
}

export function addMinutesHHMM(hhmm: string, minutes: number): string {
  const { hours, minutes: mm } = parseHHMM(hhmm);
  const base = new Date(2000, 0, 1, hours, mm);
  const next = dfAddMinutes(base, minutes);
  return formatHM(next);
}

export function minutesFromMidnight(hhmm: string): number {
  const { hours, minutes } = parseHHMM(hhmm);
  return hours * 60 + minutes;
}

export function durationMinutes(start: string, end: string): number {
  return minutesFromMidnight(end) - minutesFromMidnight(start);
}

export function addDays(d: Date, n: number): Date {
  return dfAddDays(d, n);
}

export function isSameDay(a: Date, b: Date): boolean {
  return dfIsSameDay(a, b);
}

export function daysBetween(a: Date, b: Date): number {
  return Math.abs(differenceInCalendarDays(a, b));
}

export function weeksBetween(a: Date, b: Date): number {
  return Math.floor(daysBetween(a, b) / 7);
}

export function startOfTimeOfDay(d: Date): "morning" | "noon" | "evening" | "night" {
  const h = d.getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "noon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

export function greetingForHour(name: string, d: Date = new Date()): string {
  const tod = startOfTimeOfDay(d);
  const n = name.trim() || "anh yêu";
  switch (tod) {
    case "morning": return `Chào buổi sáng, ${n}!`;
    case "noon": return `Buổi trưa yên bình, ${n}!`;
    case "evening": return `Hoàng hôn về, ${n}!`;
    case "night": return `Đêm muộn rồi, ${n}!`;
  }
}
