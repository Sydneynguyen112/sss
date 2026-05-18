import { NextResponse } from "next/server";
import { signVisitorToken, setVisitorCookie } from "@/lib/server/auth";

export const runtime = "nodejs";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  let body: { password?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 }); }

  const password = String(body.password ?? "");
  const expected = process.env.USER_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "Server chưa cấu hình USER_PASSWORD." },
      { status: 500 },
    );
  }

  if (!password || !safeEqual(password, expected)) {
    return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
  }

  const jwt = await signVisitorToken();
  await setVisitorCookie(jwt);
  return NextResponse.json({ ok: true });
}
