import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeGreetings } from "@/lib/server/customizations";
import type { GreetingOverride, GreetingItem, TimeSlot } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

export const runtime = "nodejs";

const SLOTS: TimeSlot[] = ["morning", "noon", "evening", "night"];

function sanitizeItem(raw: Partial<GreetingItem>): GreetingItem | null {
  const text = String(raw.text ?? "").trim().slice(0, 200);
  if (!text) return null;
  return { id: raw.id || randomId(), text };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: GreetingOverride;
  try { body = (await req.json()) as GreetingOverride; }
  catch { return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 }); }

  const items = {} as Record<TimeSlot, GreetingItem[]>;
  for (const slot of SLOTS) {
    items[slot] = (body.items?.[slot] ?? []).map(sanitizeItem).filter((i): i is GreetingItem => !!i);
  }
  const validIds = new Set(Object.values(items).flatMap((arr) => arr.map((i) => i.id)));

  const schedule: Record<string, Partial<Record<TimeSlot, string>>> = {};
  for (const [date, slots] of Object.entries(body.schedule ?? {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !slots) continue;
    const filtered: Partial<Record<TimeSlot, string>> = {};
    for (const slot of SLOTS) {
      const id = slots[slot];
      if (id && validIds.has(id)) filtered[slot] = id;
    }
    if (Object.keys(filtered).length) schedule[date] = filtered;
  }

  try {
    await writeGreetings({ items, schedule });
    return NextResponse.json({ ok: true, greetings: { items, schedule } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không lưu được" }, { status: 500 });
  }
}
