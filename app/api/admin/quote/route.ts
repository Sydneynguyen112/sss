import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeQuote } from "@/lib/server/customizations";
import type { QuoteOverride, QuoteItem } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

export const runtime = "nodejs";

function sanitizeItem(raw: Partial<QuoteItem>): QuoteItem | null {
  const text = String(raw.text ?? "").trim().slice(0, 500);
  if (!text) return null;
  return {
    id: raw.id || randomId(),
    text,
    author: String(raw.author ?? "").trim().slice(0, 80) || "Vô danh",
  };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: QuoteOverride;
  try {
    body = (await req.json()) as QuoteOverride;
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const items = (body.items ?? []).map(sanitizeItem).filter((i): i is QuoteItem => !!i);
  const validIds = items.map((i) => i.id);

  const payload: QuoteOverride = {
    enabled: !!body.enabled,
    mode: body.mode === "fixed" ? "fixed" : "random",
    items,
    fixedId: body.fixedId && validIds.includes(body.fixedId) ? body.fixedId : undefined,
    schedule: cleanSchedule(body.schedule, new Set(validIds)),
  };

  try {
    await writeQuote(payload);
    return NextResponse.json({ ok: true, quote: payload });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không lưu được" },
      { status: 500 },
    );
  }
}

function cleanSchedule(s: unknown, validIds: Set<string>): Record<string, string> {
  if (!s || typeof s !== "object") return {};
  const out: Record<string, string> = {};
  for (const [date, id] of Object.entries(s as Record<string, string>)) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && validIds.has(id)) out[date] = id;
  }
  return out;
}
