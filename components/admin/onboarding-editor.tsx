"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { OnboardingOverride, OnboardingMessage } from "@/types/customizations";

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function OnboardingEditor({ initial }: { initial: OnboardingOverride }) {
  const [messages, setMessages] = useState<OnboardingMessage[]>(initial.messages ?? []);
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  const update = (id: string, text: string) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)));

  const remove = (id: string) => setMessages((prev) => prev.filter((m) => m.id !== id));

  const move = (idx: number, dir: -1 | 1) => {
    setMessages((prev) => {
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap]!, next[idx]!];
      return next;
    });
  };

  const add = () => setMessages((prev) => [...prev, { id: uid(), text: "" }]);

  const save = async () => {
    const clean = messages
      .map((m) => ({ ...m, text: m.text.trim() }))
      .filter((m) => m.text.length > 0);
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: clean }),
      });
      const json = await res.json().catch(() => ({} as { error?: string }));
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setMessages(clean);
      window.alert("✓ Đã lưu onboarding!");
    } catch (e) {
      window.alert("✗ LƯU THẤT BẠI: " + (e instanceof Error ? e.message : "Lỗi"));
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm">
          <span className="text-text-muted">Tổng: </span>
          <strong>{messages.length} message</strong>
        </p>
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Thêm message
        </Button>
      </div>

      {messages.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center text-text-muted">
          <p className="text-sm">Chưa có message nào.</p>
          <p className="text-xs mt-1">Bấm &ldquo;Thêm message&rdquo; để bắt đầu.</p>
        </div>
      )}

      <ul className="space-y-3">
        {messages.map((m, idx) => (
          <li key={m.id} className="glass rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-text-muted">
                Slide {idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled={idx === 0} onClick={() => move(idx, -1)}>
                  <ArrowUp className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" disabled={idx === messages.length - 1} onClick={() => move(idx, 1)}>
                  <ArrowDown className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(m.id)}>
                  <Trash2 className="w-3.5 h-3.5 text-danger" />
                </Button>
              </div>
            </div>
            <textarea
              value={m.text}
              onChange={(e) => update(m.id, e.target.value)}
              placeholder="Vd: Chào anh, em rất vui khi anh ghé thăm trang này. Mỗi ngày em sẽ gửi anh vài điều nhỏ ♡"
              rows={4}
              maxLength={800}
              className="w-full rounded-md border border-border bg-background p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <p className="text-[10px] text-text-muted text-right tabular-nums">
              {m.text.length}/800
            </p>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <div className="glass rounded-full px-4 py-2 shadow-soft flex items-center gap-3">
          <span className="text-xs text-text-muted">{messages.length} slide</span>
          <Button onClick={save} disabled={status === "saving"} size="sm">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
