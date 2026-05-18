import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/server/telegram";
import { readAllCustomizations } from "@/lib/server/customizations";
import { getDefaultMenu, rotationIdxForDate, PROGRAM_LENGTH } from "@/data/meal-program";
import { dateKey } from "@/lib/utils/date-helpers";
import { getProgramDay } from "@/data/tennis-program";
import type { MealEntry, MealSlotKey, TimeSlot } from "@/types/customizations";

export const runtime = "nodejs";

const SLOT_META: Record<MealSlotKey, { label: string; emoji: string; time: string }> = {
  breakfast: { label: "Bữa sáng", emoji: "🥐", time: "08:00" },
  snack: { label: "Bữa phụ", emoji: "🍎", time: "10:00" },
  lunch: { label: "Bữa trưa", emoji: "🍱", time: "12:00" },
  dinner: { label: "Bữa tối", emoji: "🌙", time: "19:00" },
};

const SHOW_SLOTS: MealSlotKey[] = ["breakfast", "snack", "lunch", "dinner"];

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMeal(slot: MealSlotKey, item: MealEntry): string {
  const meta = SLOT_META[slot];
  const lines: string[] = [];
  lines.push(`${meta.emoji} <b>${meta.label} · ${meta.time}</b>`);
  lines.push(escapeHtml(item.name));
  const macros: string[] = [];
  if (item.kcal !== undefined) macros.push(`${item.kcal} kcal`);
  if (item.protein !== undefined) macros.push(`${item.protein}g protein`);
  if (macros.length) lines.push(`<i>${macros.join(" · ")}</i>`);
  return lines.join("\n");
}

function pickMorningGreeting(now: Date, custom: Awaited<ReturnType<typeof readAllCustomizations>>): string | null {
  const tod: TimeSlot = "morning";
  const items = custom.greetings.items?.[tod] ?? [];
  if (items.length === 0) return null;
  const dk = dateKey(now);
  const scheduledId = custom.greetings.schedule?.[dk]?.[tod];
  if (scheduledId) {
    const item = items.find((i) => i.id === scheduledId);
    if (item) return item.text.replace(/\{name\}/g, "anh");
  }
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.abs(Math.floor((now.getTime() - start.getTime()) / 86_400_000));
  return items[dayOfYear % items.length]!.text.replace(/\{name\}/g, "anh");
}

async function buildMessage(): Promise<string> {
  // ICT (UTC+7) — Vercel chạy UTC, cộng 7h để khớp ngày VN
  const nowIct = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const custom = await readAllCustomizations();

  const customGreeting = pickMorningGreeting(nowIct, custom);
  const idx = rotationIdxForDate(nowIct);
  const defaults = getDefaultMenu(idx);
  const override = custom.meals?.program?.[String(idx)] ?? {};

  const lines: string[] = [];
  lines.push("☀️ <b>Chào buổi sáng, anh yêu!</b>");
  lines.push("");
  if (customGreeting) {
    lines.push(escapeHtml(customGreeting));
    lines.push("");
  }
  lines.push(`🍽️ <b>Thực đơn hôm nay</b> (Ngày ${idx + 1}/${PROGRAM_LENGTH})`);
  lines.push("");
  for (const slot of SHOW_SLOTS) {
    const item = override[slot] ?? defaults[slot];
    lines.push(formatMeal(slot, item));
    lines.push("");
  }

  // Tennis (nếu trong khung 18/05 → 15/07)
  const tennis = getProgramDay(dateKey(nowIct));
  if (tennis) {
    const tov = custom.tennis?.days?.[dateKey(nowIct)];
    const drills = tov?.drills && tov.drills.length > 0
      ? tov.drills.map((o, i) => ({
          name: o.name ?? tennis.drills[i]?.name ?? "",
          minutes: o.minutes ?? tennis.drills[i]?.minutes ?? 0,
        }))
      : tennis.drills.map((d) => ({ name: d.name, minutes: d.minutes }));
    const totalMins = drills.reduce((a, d) => a + d.minutes, 0);
    lines.push(`🎾 <b>Tennis hôm nay</b>: ${escapeHtml(tennis.weekFocus)}`);
    lines.push(`<i>${totalMins} phút · ${drills.length} drill</i>`);
    lines.push("");
  }

  lines.push("— Em yêu anh ♡");
  return lines.join("\n");
}

export async function GET(req: Request) {
  // Vercel cron đính kèm Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  const expected = secret ? `Bearer ${secret}` : null;

  // Cho phép test bằng ?key=<secret> trên browser (1 lần test)
  const url = new URL(req.url);
  const queryKey = url.searchParams.get("key");

  if (expected && authHeader !== expected && queryKey !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const text = await buildMessage();
    const result = await sendTelegramMessage(text);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true, length: text.length });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Lỗi" }, { status: 500 });
  }
}
