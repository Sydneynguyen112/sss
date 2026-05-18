import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeMeals } from "@/lib/server/customizations";
import type { CustomMealsOverride, MealEntry, MealSlotKey } from "@/types/customizations";

export const runtime = "nodejs";

const SLOTS: MealSlotKey[] = ["breakfast", "snack", "lunch", "dinner"];
const DOW_KEYS = ["0", "1", "2", "3", "4", "5", "6"];

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

function sanitizeEntry(raw: Partial<MealEntry> | undefined): MealEntry | null {
  if (!raw) return null;
  const name = String(raw.name ?? "").trim().slice(0, 160);
  if (!name) return null;
  return {
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

  const program: Record<string, Partial<Record<MealSlotKey, MealEntry>>> = {};
  for (const dow of DOW_KEYS) {
    const day = body.program?.[dow];
    if (!day) continue;
    const filtered: Partial<Record<MealSlotKey, MealEntry>> = {};
    for (const slot of SLOTS) {
      const entry = sanitizeEntry(day[slot]);
      if (entry) filtered[slot] = entry;
    }
    if (Object.keys(filtered).length) program[dow] = filtered;
  }

  try {
    await writeMeals({ program });
    return NextResponse.json({ ok: true, meals: { program } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không lưu được" }, { status: 500 });
  }
}
