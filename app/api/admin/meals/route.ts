import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeMeals } from "@/lib/server/customizations";
import type { CustomMealsOverride, CustomMealItem, MealSlotKey } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

export const runtime = "nodejs";

const SLOTS: MealSlotKey[] = ["breakfast", "lunch", "dinner"];

function toNumber(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.round(n);
}

function sanitizeIngredients(raw: unknown): { name: string; amount: string }[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: { name: string; amount: string }[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const name = String(obj.name ?? "").trim().slice(0, 80);
    const amount = String(obj.amount ?? "").trim().slice(0, 40);
    if (name) out.push({ name, amount });
  }
  return out.length > 0 ? out.slice(0, 20) : undefined;
}

function sanitizeItem(slot: MealSlotKey, raw: Partial<CustomMealItem>): CustomMealItem | null {
  const name = String(raw.name ?? "").trim().slice(0, 160);
  if (!name) return null;
  return {
    id: raw.id || randomId(),
    slot,
    name,
    note: String(raw.note ?? "").trim().slice(0, 320) || undefined,
    kcal: toNumber(raw.kcal),
    protein: toNumber(raw.protein),
    ingredients: sanitizeIngredients(raw.ingredients),
  };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: CustomMealsOverride;
  try { body = (await req.json()) as CustomMealsOverride; }
  catch { return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 }); }

  const items = {} as Record<MealSlotKey, CustomMealItem[]>;
  for (const slot of SLOTS) {
    items[slot] = (body.items?.[slot] ?? [])
      .map((r) => sanitizeItem(slot, r))
      .filter((i): i is CustomMealItem => !!i);
  }
  const validIds = new Set(Object.values(items).flatMap((arr) => arr.map((i) => i.id)));

  const schedule: Record<string, Partial<Record<MealSlotKey, string>>> = {};
  for (const [date, slots] of Object.entries(body.schedule ?? {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !slots) continue;
    const filtered: Partial<Record<MealSlotKey, string>> = {};
    for (const slot of SLOTS) {
      const id = slots[slot];
      if (id && validIds.has(id)) filtered[slot] = id;
    }
    if (Object.keys(filtered).length) schedule[date] = filtered;
  }

  try {
    await writeMeals({ items, schedule });
    return NextResponse.json({ ok: true, meals: { items, schedule } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không lưu được" }, { status: 500 });
  }
}
