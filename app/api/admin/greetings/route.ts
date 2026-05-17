import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeGreetings } from "@/lib/server/customizations";
import type { GreetingOverride } from "@/types/customizations";

export const runtime = "nodejs";

function clean(s: unknown): string {
  return String(s ?? "").trim().slice(0, 160);
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: GreetingOverride;
  try {
    body = (await req.json()) as GreetingOverride;
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const payload: GreetingOverride = {
    enabled: !!body.enabled,
    morning: clean(body.morning),
    noon: clean(body.noon),
    evening: clean(body.evening),
    night: clean(body.night),
  };

  try {
    await writeGreetings(payload);
    return NextResponse.json({ ok: true, greetings: payload });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không lưu được" },
      { status: 500 },
    );
  }
}
