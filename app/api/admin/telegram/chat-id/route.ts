// Helper: GET /api/admin/telegram/chat-id → list các chat đã /start với bot.
// Admin chỉ chạy 1 lần để find chat_id, rồi paste vào TELEGRAM_CHAT_ID env.

import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/server/auth";
import { getRecentChats, sendTelegramMessage } from "@/lib/server/telegram";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getRecentChats();
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({
    chats: result.chats,
    hint: "Copy id của anh, paste vào env TELEGRAM_CHAT_ID trên Vercel.",
  });
}

// POST: test gửi 1 message
export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await sendTelegramMessage("🧪 Test từ admin panel: bot đã kết nối thành công ♡");
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
