import { dateKey } from "./date-helpers";
import type { PickMode } from "@/types/customizations";

interface Item {
  id: string;
}

/**
 * Chọn item cho ngày `date` theo logic:
 *   1) Nếu schedule[dateKey] có gán cụ thể → trả về item đó.
 *   2) Nếu mode = "fixed" + fixedId tồn tại → trả về item đó.
 *   3) Nếu mode = "random" → chọn deterministic theo dayOfYear (same day = same item).
 *   4) Nếu items rỗng → null.
 */
export function pickForToday<T extends Item>(
  items: T[],
  mode: PickMode,
  schedule: Record<string, string>,
  date: Date,
  fixedId?: string,
): T | null {
  if (items.length === 0) return null;
  const dk = dateKey(date);
  const scheduledId = schedule[dk];
  if (scheduledId) {
    const found = items.find((i) => i.id === scheduledId);
    if (found) return found;
  }
  if (mode === "fixed" && fixedId) {
    const found = items.find((i) => i.id === fixedId);
    if (found) return found;
  }
  // random deterministic by dayOfYear
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.abs(Math.floor((date.getTime() - start.getTime()) / 86_400_000));
  return items[dayOfYear % items.length]!;
}

export function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}
