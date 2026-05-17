import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeKeyword } from "@/lib/server/customizations";
import type { KeywordOverride, KeywordItem } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

export const runtime = "nodejs";

const trim = (s: unknown, max: number) => String(s ?? "").trim().slice(0, max);

function sanitizeItem(raw: Partial<KeywordItem>): KeywordItem | null {
  const word = trim(raw.word, 60);
  if (!word) return null;
  return {
    id: raw.id || randomId(),
    word,
    wordEn: trim(raw.wordEn, 60) || undefined,
    ipa: trim(raw.ipa, 60) || undefined,
    tagline: trim(raw.tagline, 280) || undefined,
  };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: KeywordOverride;
  try { body = (await req.json()) as KeywordOverride; }
  catch { return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 }); }

  const items = (body.items ?? []).map(sanitizeItem).filter((i): i is KeywordItem => !!i);
  const validIds = new Set(items.map((i) => i.id));
  const schedule: Record<string, string> = {};
  for (const [date, id] of Object.entries(body.schedule ?? {})) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && validIds.has(id)) schedule[date] = id;
  }

  try {
    await writeKeyword({ items, schedule });
    return NextResponse.json({ ok: true, keyword: { items, schedule } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không lưu được" }, { status: 500 });
  }
}
