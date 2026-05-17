import { NextResponse } from "next/server";
import { getKv, isKvConfigured, KV_KEYS } from "@/lib/server/kv";
import { isAdminEmail, setAdminCookie, signAdminToken } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";

  if (!token || !isKvConfigured()) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", url));
  }

  const key = KV_KEYS.magicToken(token);
  const email = await getKv().get<string>(key);
  if (!email) {
    return NextResponse.redirect(new URL("/admin/login?error=expired", url));
  }

  // single-use: delete immediately
  await getKv().del(key);

  if (!isAdminEmail(email)) {
    return NextResponse.redirect(new URL("/admin/login?error=forbidden", url));
  }

  const jwt = await signAdminToken(email);
  await setAdminCookie(jwt);
  return NextResponse.redirect(new URL("/admin", url));
}
