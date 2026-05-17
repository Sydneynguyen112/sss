import { NextResponse } from "next/server";
import { isAdminEmail, setAdminCookie, signAdminToken } from "@/lib/server/auth";

export const runtime = "nodejs";

// Constant-time string compare để chống timing attack
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Cần nhập email và mật khẩu" }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Server chưa cấu hình ADMIN_PASSWORD." },
      { status: 500 },
    );
  }

  // Đồng thời check email allowlist + password match. Trả lỗi chung để không lộ thông tin.
  const emailOk = isAdminEmail(email);
  const passOk = safeEqual(password, expected);

  if (!emailOk || !passOk) {
    return NextResponse.json(
      { error: "Email hoặc mật khẩu không đúng" },
      { status: 401 },
    );
  }

  const jwt = await signAdminToken(email);
  await setAdminCookie(jwt);
  return NextResponse.json({ ok: true });
}
