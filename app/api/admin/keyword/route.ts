import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeKeyword } from "@/lib/server/customizations";
import type { KeywordOverride, KeywordItem } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

export const runtime = "nodejs";

function trim(s: unknown, max: number): string {
  return String(s ?? "").trim().slice(0, max);
}

function sanitizeItem(raw: Partial<KeywordItem>): KeywordItem | null {
  const word = trim(raw.word, 60);
  if (!word) return null;
  return {
    id: raw.id || randomId(),
    word,
    wordEn: trim(raw.wordEn, 60),
    ipa: trim(raw.ipa, 60) || undefined,
    tagline: trim(raw.tagline, 280),
  };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: KeywordOverride;
  try {
    body = (await req.json()) as KeywordOverride;
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const items = (body.items ?? []).map(sanitizeItem).filter((i): i is KeywordItem => !!i);
  const payload: KeywordOverride = {
    enabled: !!body.enabled,
    mode: body.mode === "fixed" ? "fixed" : "random",
    items,
    fixedId: body.fixedId && items.some((i) => i.id === body.fixedId) ? body.fixedId : undefined,
    schedule: cleanSchedule(body.schedule, items.map((i) => i.id)),
  };

  try {
    await writeKeyword(payload);
    return NextResponse.json({ ok: true, keyword: payload });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không lưu được" },
      { status: 500 },
    );
  }
}

function cleanSchedule(s: unknown, validIds: string[]): Record<string, string> {
  if (!s || typeof s !== "object") return {};
  const ids = new Set(validIds);
  const out: Record<string, string> = {};
  for (const [date, id] of Object.entries(s as Record<string, string>)) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && ids.has(id)) {
      out[date] = id;
    }
  }
  return out;
}
