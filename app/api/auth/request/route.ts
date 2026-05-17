import { NextResponse } from "next/server";
import { getKv, isKvConfigured, KV_KEYS } from "@/lib/server/kv";
import { isAdminEmail } from "@/lib/server/auth";
import { sendMagicLink } from "@/lib/server/email";

export const runtime = "nodejs";

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: Request) {
  if (!isKvConfigured()) {
    return NextResponse.json(
      { error: "KV chưa cấu hình. Cần KV_REST_API_URL + KV_REST_API_TOKEN." },
      { status: 500 },
    );
  }

  let email: string;
  try {
    const body = (await req.json()) as { email?: string };
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
  }

  // Allowlist check — không tiết lộ email có trong list hay không (anti-enum)
  const allowed = isAdminEmail(email);

  if (allowed) {
    try {
      const token = randomToken();
      await getKv().set(KV_KEYS.magicToken(token), email, { ex: 600 });
      const base = process.env.APP_URL || new URL(req.url).origin;
      const link = `${base.replace(/\/$/, "")}/api/auth/verify?token=${token}`;
      await sendMagicLink(email, link);
    } catch (e) {
      console.error("[auth/request] send failed:", e);
      return NextResponse.json(
        { error: "Không gửi được email. Kiểm tra RESEND_API_KEY." },
        { status: 500 },
      );
    }
  }

  // Luôn trả về OK để không lộ allowlist
  return NextResponse.json({ ok: true });
}
