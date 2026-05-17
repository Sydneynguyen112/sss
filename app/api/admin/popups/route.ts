import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writePopups } from "@/lib/server/customizations";
import { readAllCustomizations } from "@/lib/server/customizations";
import type { PopupMessage } from "@/types/customizations";

export const runtime = "nodejs";

function randomId(): string {
  const b = new Uint8Array(8);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

// POST = create or replace whole list. Body: { popups: PopupMessage[] } or { popup: <new> }.
export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { popups?: PopupMessage[]; popup?: Partial<PopupMessage> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  try {
    if (Array.isArray(body.popups)) {
      const sanitized = body.popups.map(sanitizePopup);
      await writePopups(sanitized);
      return NextResponse.json({ ok: true, popups: sanitized });
    }

    if (body.popup && body.popup.title) {
      const current = (await readAllCustomizations()).popups;
      const newOne: PopupMessage = sanitizePopup({
        ...body.popup,
        id: randomId(),
        createdAt: new Date().toISOString(),
      } as PopupMessage);
      const next = [newOne, ...current].slice(0, 50);
      await writePopups(next);
      return NextResponse.json({ ok: true, popups: next });
    }

    return NextResponse.json({ error: "Cần 'popups' (array) hoặc 'popup' (object)." }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không lưu được" },
      { status: 500 },
    );
  }
}

// DELETE?id=xxx
export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Cần id" }, { status: 400 });

  try {
    const current = (await readAllCustomizations()).popups;
    const next = current.filter((p) => p.id !== id);
    await writePopups(next);
    return NextResponse.json({ ok: true, popups: next });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không xoá được" },
      { status: 500 },
    );
  }
}

function sanitizePopup(p: PopupMessage): PopupMessage {
  return {
    id: p.id || randomId(),
    title: String(p.title ?? "").trim().slice(0, 80),
    body: String(p.body ?? "").trim().slice(0, 500),
    emoji: p.emoji?.trim().slice(0, 4) || undefined,
    createdAt: p.createdAt || new Date().toISOString(),
    activeFrom: p.activeFrom || undefined,
    activeUntil: p.activeUntil || undefined,
    oncePerVisitor: !!p.oncePerVisitor,
  };
}
