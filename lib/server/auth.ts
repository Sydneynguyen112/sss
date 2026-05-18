import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "hanhtrinh_admin";
const VISITOR_COOKIE_NAME = "hanhtrinh_visitor";
const COOKIE_MAX_AGE_DAYS = 30;
const VISITOR_COOKIE_MAX_AGE_DAYS = 180;

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET must be set (>=16 chars).");
  }
  return new TextEncoder().encode(s);
}

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export async function signAdminToken(email: string): Promise<string> {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_DAYS}d`)
    .sign(getSecret());
}

export async function verifyAdminToken(
  token: string,
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin") return null;
    const email = String(payload.email ?? "");
    if (!isAdminEmail(email)) return null;
    return { email };
  } catch {
    return null;
  }
}

export async function setAdminCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

// ─── Visitor (user-side) auth ───────────────────────────────────────────────

export async function signVisitorToken(): Promise<string> {
  return await new SignJWT({ role: "visitor" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${VISITOR_COOKIE_MAX_AGE_DAYS}d`)
    .sign(getSecret());
}

export async function verifyVisitorToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "visitor";
  } catch {
    return false;
  }
}

export async function setVisitorCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set({
    name: VISITOR_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: VISITOR_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export async function clearVisitorCookie(): Promise<void> {
  const store = await cookies();
  store.delete(VISITOR_COOKIE_NAME);
}

export async function isVisitorAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(VISITOR_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyVisitorToken(token);
}

export const VISITOR_COOKIE = VISITOR_COOKIE_NAME;
