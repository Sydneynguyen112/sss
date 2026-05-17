import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeTennis } from "@/lib/server/customizations";
import type { TennisOverride, TennisDayOverride, TennisDrillOverride } from "@/types/customizations";

export const runtime = "nodejs";

function sanitizeDrill(raw: Partial<TennisDrillOverride>): TennisDrillOverride {
  return {
    name: typeof raw.name === "string" ? raw.name.trim().slice(0, 120) : undefined,
    minutes: typeof raw.minutes === "number" && raw.minutes > 0 && raw.minutes < 200 ? Math.round(raw.minutes) : undefined,
    description: typeof raw.description === "string" ? raw.description.trim().slice(0, 500) : undefined,
  };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: TennisOverride;
  try { body = (await req.json()) as TennisOverride; }
  catch { return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 }); }

  const days: Record<string, TennisDayOverride> = {};
  for (const [date, day] of Object.entries(body.days ?? {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !day) continue;
    const out: TennisDayOverride = {};
    if (Array.isArray(day.drills)) {
      out.drills = day.drills.map(sanitizeDrill).slice(0, 10);
    }
    if (typeof day.note === "string") {
      const n = day.note.trim().slice(0, 320);
      if (n) out.note = n;
    }
    if (Object.keys(out).length > 0) days[date] = out;
  }

  try {
    await writeTennis({ days });
    return NextResponse.json({ ok: true, tennis: { days } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không lưu được" }, { status: 500 });
  }
}
