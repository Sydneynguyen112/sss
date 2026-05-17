import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeWeekendMeals } from "@/lib/server/customizations";
import type { WeekendMealsOverride } from "@/types/customizations";

export const runtime = "nodejs";

function cleanDay(d: unknown) {
  if (!d || typeof d !== "object") return undefined;
  const obj = d as Record<string, unknown>;
  const trim = (s: unknown, max: number) => String(s ?? "").trim().slice(0, max) || undefined;
  return {
    breakfast: trim(obj.breakfast, 160),
    lunch: trim(obj.lunch, 160),
    dinner: trim(obj.dinner, 160),
    note: trim(obj.note, 320),
  };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: WeekendMealsOverride;
  try {
    body = (await req.json()) as WeekendMealsOverride;
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const payload: WeekendMealsOverride = {
    enabled: !!body.enabled,
    saturday: cleanDay(body.saturday),
    sunday: cleanDay(body.sunday),
  };

  await writeWeekendMeals(payload);
  return NextResponse.json({ ok: true, weekendMeals: payload });
}
