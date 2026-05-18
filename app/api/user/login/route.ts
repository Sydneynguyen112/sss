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
  let body: { username?: string; password?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 }); }

  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  const expectedUser = process.env.USER_NAME;
  const expectedPass = process.env.USER_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return NextResponse.json(
      { error: "Server chưa cấu hình USER_NAME hoặc USER_PASSWORD." },
      { status: 500 },
    );
  }

  const userOk = safeEqual(username, expectedUser);
  const passOk = safeEqual(password, expectedPass);

  if (!username || !password || !userOk || !passOk) {
    return NextResponse.json(
      { error: "Tên đăng nhập hoặc mật khẩu không đúng" },
      { status: 401 },
    );
  }

  const jwt = await signVisitorToken();
  await setVisitorCookie(jwt);
  return NextResponse.json({ ok: true });
}
