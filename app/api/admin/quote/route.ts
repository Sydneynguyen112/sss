import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeQuote } from "@/lib/server/customizations";
import type { QuoteOverride, QuoteItem } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

export const runtime = "nodejs";

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

function sanitizeItem(raw: Partial<QuoteItem>): QuoteItem | null {
  const text = String(raw.text ?? "").trim().slice(0, 500);
  if (!text) return null;
  const url = String(raw.imageUrl ?? "").trim();
  return {
    id: raw.id || randomId(),
    text,
    author: String(raw.author ?? "").trim().slice(0, 80) || undefined,
    imageUrl: isHttpUrl(url) ? url : undefined,
  };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: QuoteOverride;
  try { body = (await req.json()) as QuoteOverride; }
  catch { return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 }); }

  const items = (body.items ?? []).map(sanitizeItem).filter((i): i is QuoteItem => !!i);
  const validIds = new Set(items.map((i) => i.id));
  const schedule: Record<string, string> = {};
  for (const [date, id] of Object.entries(body.schedule ?? {})) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && validIds.has(id)) schedule[date] = id;
  }

  try {
    await writeQuote({ items, schedule });
    return NextResponse.json({ ok: true, quote: { items, schedule } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không lưu được" }, { status: 500 });
  }
}
