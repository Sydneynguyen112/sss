import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeMeals } from "@/lib/server/customizations";
import type { CustomMealsOverride, CustomMealItem, MealSlotKey } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

export const runtime = "nodejs";

const SLOTS: MealSlotKey[] = ["breakfast", "lunch", "dinner"];

function sanitizeItem(slot: MealSlotKey, raw: Partial<CustomMealItem>): CustomMealItem | null {
  const name = String(raw.name ?? "").trim().slice(0, 160);
  if (!name) return null;
  return {
    id: raw.id || randomId(),
    slot,
    name,
    note: String(raw.note ?? "").trim().slice(0, 320) || undefined,
  };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: CustomMealsOverride;
  try {
    body = (await req.json()) as CustomMealsOverride;
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const items = {} as Record<MealSlotKey, CustomMealItem[]>;
  const fixedIds: Partial<Record<MealSlotKey, string>> = {};
  for (const slot of SLOTS) {
    const raw = body.items?.[slot] ?? [];
    const sanitized = raw
      .map((r) => sanitizeItem(slot, r))
      .filter((i): i is CustomMealItem => !!i);
    items[slot] = sanitized;
    const fid = body.fixedIds?.[slot];
    if (fid && sanitized.some((i) => i.id === fid)) fixedIds[slot] = fid;
  }

  const validIdSet = new Set<string>(
    Object.values(items).flatMap((arr) => arr.map((i) => i.id)),
  );

  const payload: CustomMealsOverride = {
    enabled: !!body.enabled,
    mode: body.mode === "fixed" ? "fixed" : "random",
    items,
    fixedIds,
    schedule: cleanSchedule(body.schedule, validIdSet),
  };

  try {
    await writeMeals(payload);
    return NextResponse.json({ ok: true, meals: payload });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không lưu được" },
      { status: 500 },
    );
  }
}

function cleanSchedule(
  s: unknown,
  validIds: Set<string>,
): Record<string, Partial<Record<MealSlotKey, string>>> {
  if (!s || typeof s !== "object") return {};
  const out: Record<string, Partial<Record<MealSlotKey, string>>> = {};
  for (const [date, slots] of Object.entries(s as Record<string, Partial<Record<MealSlotKey, string>>>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !slots) continue;
    const filtered: Partial<Record<MealSlotKey, string>> = {};
    for (const slot of SLOTS) {
      const id = slots[slot];
      if (id && validIds.has(id)) filtered[slot] = id;
    }
    if (Object.keys(filtered).length) out[date] = filtered;
  }
  return out;
}
