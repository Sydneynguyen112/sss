import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeBackground } from "@/lib/server/customizations";
import type { BackgroundOverride } from "@/types/customizations";

export const runtime = "nodejs";

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: BackgroundOverride;
  try {
    body = (await req.json()) as BackgroundOverride;
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const url = String(body.imageUrl ?? "").trim();
  if (body.enabled && url && !isHttpUrl(url)) {
    return NextResponse.json({ error: "URL ảnh không hợp lệ (cần http/https)." }, { status: 400 });
  }

  const payload: BackgroundOverride = {
    enabled: !!body.enabled,
    imageUrl: url || undefined,
  };

  try {
    await writeBackground(payload);
    return NextResponse.json({ ok: true, background: payload });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không lưu được" },
      { status: 500 },
    );
  }
}
