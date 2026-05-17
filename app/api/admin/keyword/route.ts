import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeKeyword } from "@/lib/server/customizations";
import type { KeywordOverride } from "@/types/customizations";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: KeywordOverride;
  try {
    body = (await req.json()) as KeywordOverride;
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const payload: KeywordOverride = {
    enabled: !!body.enabled,
    word: String(body.word ?? "").trim().slice(0, 60),
    wordEn: String(body.wordEn ?? "").trim().slice(0, 60),
    tagline: String(body.tagline ?? "").trim().slice(0, 280),
  };

  if (payload.enabled && (!payload.word || !payload.tagline)) {
    return NextResponse.json(
      { error: "Bật override thì word và tagline phải có nội dung." },
      { status: 400 },
    );
  }

  await writeKeyword(payload);
  return NextResponse.json({ ok: true, keyword: payload });
}
