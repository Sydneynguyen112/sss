import { dateKey } from "./date-helpers";

interface Item {
  id: string;
}

/**
 * 1) Nếu schedule[dateKey(date)] có gán → trả về item đó.
 * 2) Else nếu items không rỗng → pick deterministic theo dayOfYear.
 * 3) Else null.
 */
export function pickForToday<T extends Item>(
  items: T[],
  schedule: Record<string, string>,
  date: Date,
): T | null {
  if (items.length === 0) return null;
  const dk = dateKey(date);
  const scheduledId = schedule[dk];
  if (scheduledId) {
    const found = items.find((i) => i.id === scheduledId);
    if (found) return found;
  }
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.abs(
    Math.floor((date.getTime() - start.getTime()) / 86_400_000),
  );
  return items[dayOfYear % items.length]!;
}

export function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}
