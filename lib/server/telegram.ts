// Telegram Bot API helper — gửi message theo HTML format.
// Lấy TOKEN từ @BotFather, CHAT_ID từ /api/admin/telegram/chat-id helper.

const API_BASE = "https://api.telegram.org";

export async function sendTelegramMessage(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID chưa cấu hình" };
  }

  try {
    const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const json = (await res.json()) as { ok: boolean; description?: string };
    if (!json.ok) return { ok: false, error: json.description ?? `HTTP ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

// Lấy danh sách chat gần đây — dùng 1 lần để find chat_id của anh.
export async function getRecentChats(): Promise<{ ok: boolean; chats?: { id: number; name: string }[]; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, error: "TELEGRAM_BOT_TOKEN chưa cấu hình" };

  try {
    const res = await fetch(`${API_BASE}/bot${token}/getUpdates`);
    const json = (await res.json()) as { ok: boolean; result?: Array<{ message?: { chat: { id: number; first_name?: string; username?: string; type: string } } }>; description?: string };
    if (!json.ok) return { ok: false, error: json.description ?? `HTTP ${res.status}` };

    const seen = new Set<number>();
    const chats: { id: number; name: string }[] = [];
    for (const update of json.result ?? []) {
      const chat = update.message?.chat;
      if (!chat || seen.has(chat.id)) continue;
      seen.add(chat.id);
      chats.push({
        id: chat.id,
        name: chat.first_name ?? chat.username ?? `chat ${chat.id}`,
      });
    }
    return { ok: true, chats };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}
