"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Heart } from "lucide-react";
import type { PopupMessage } from "@/types/customizations";

const EMPTY_FORM = {
  title: "",
  body: "",
  emoji: "💛",
  activeFrom: "",
  activeUntil: "",
  oncePerVisitor: true,
};

export function PopupsEditor({ initial }: { initial: PopupMessage[] }) {
  const [list, setList] = useState<PopupMessage[]>(initial);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      setError("Cần tiêu đề và nội dung.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/popups", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ popup: form }),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Create failed");
      const data = (await res.json()) as { popups: PopupMessage[] };
      setList(data.popups);
      setForm(EMPTY_FORM);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra");
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/popups?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      const data = (await res.json()) as { popups: PopupMessage[] };
      setList(data.popups);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" strokeWidth={2} />
          <h2 className="font-semibold">Tạo popup mới</h2>
        </div>

        <div className="grid sm:grid-cols-[80px_1fr] gap-4">
          <div className="space-y-2">
            <Label htmlFor="p-emoji">Emoji</Label>
            <Input
              id="p-emoji"
              value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              placeholder="💛"
              maxLength={4}
              className="text-center text-2xl h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-title">Tiêu đề</Label>
            <Input
              id="p-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ví dụ: Em yêu anh nhiều lắm!"
              maxLength={80}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="p-body">Nội dung</Label>
          <textarea
            id="p-body"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Viết một thông điệp ngọt ngào hoặc bất ngờ cho anh..."
            rows={4}
            maxLength={500}
            className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <p className="text-xs text-text-muted text-right">{form.body.length}/500</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="p-from">Hiện từ ngày (tùy chọn)</Label>
            <Input
              id="p-from"
              type="date"
              value={form.activeFrom}
              onChange={(e) => setForm({ ...form, activeFrom: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-until">Đến ngày (tùy chọn)</Label>
            <Input
              id="p-until"
              type="date"
              value={form.activeUntil}
              onChange={(e) => setForm({ ...form, activeUntil: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-tertiary/30 p-3">
          <div>
            <p className="font-medium text-sm">Chỉ hiện 1 lần</p>
            <p className="text-xs text-text-muted">Bạn trai xem một lần là popup không hiện lại</p>
          </div>
          <Switch
            checked={form.oncePerVisitor}
            onCheckedChange={(v) => setForm({ ...form, oncePerVisitor: v })}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex justify-end pt-2 border-t border-border/60">
          <Button onClick={create} disabled={creating}>
            {creating ? "Đang gửi..." : "Tạo popup"}
          </Button>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Heart className="w-4 h-4 text-primary" strokeWidth={1.75} />
          <h2 className="font-semibold">Popup đang hoạt động ({list.length})</h2>
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-text-muted py-8 text-center">Chưa có popup nào.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((p) => (
              <li key={p.id} className="glass rounded-2xl p-5 flex items-start gap-3">
                <span className="text-2xl shrink-0">{p.emoji || "💌"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-text-secondary mt-1 whitespace-pre-wrap">{p.body}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-text-muted uppercase tracking-wider">
                    {p.oncePerVisitor && <span>Chỉ 1 lần</span>}
                    {p.activeFrom && <span>Từ {p.activeFrom}</span>}
                    {p.activeUntil && <span>Đến {p.activeUntil}</span>}
                    <span className="ml-auto">{new Date(p.createdAt).toLocaleDateString("vi")}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="grid place-items-center w-8 h-8 rounded-full text-text-muted hover:text-danger hover:bg-danger/10 transition"
                  aria-label="Xoá popup"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
