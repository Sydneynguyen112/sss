import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { writeOnboarding } from "@/lib/server/customizations";
import type { OnboardingOverride, OnboardingMessage } from "@/types/customizations";

export const runtime = "nodejs";

function sanitizeMessage(raw: Partial<OnboardingMessage>): OnboardingMessage | null {
  const id = typeof raw.id === "string" ? raw.id.trim().slice(0, 64) : "";
  const text = typeof raw.text === "string" ? raw.text.trim().slice(0, 800) : "";
  if (!id || !text) return null;
  return { id, text };
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: OnboardingOverride;
  try { body = (await req.json()) as OnboardingOverride; }
  catch { return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 }); }

  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .map(sanitizeMessage)
    .filter((m): m is OnboardingMessage => m !== null)
    .slice(0, 20);

  try {
    await writeOnboarding({ messages });
    return NextResponse.json({ ok: true, onboarding: { messages } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không lưu được" }, { status: 500 });
  }
}
