"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Plus, Trash2, Pencil, Calendar, Save } from "lucide-react";
import { Toggle, ModePicker } from "./keyword-editor";
import type { QuoteOverride, QuoteItem } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

function emptyDraft(): QuoteItem {
  return { id: randomId(), text: "", author: "" };
}

export function QuoteEditor({ initial }: { initial: QuoteOverride }) {
  const [data, setData] = useState<QuoteOverride>(initial);
  const [draft, setDraft] = useState<QuoteItem>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [scheduleItemId, setScheduleItemId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const upsert = () => {
    if (!draft.text.trim()) return;
    setData((p) => {
      const exists = p.items.some((i) => i.id === draft.id);
      return { ...p, items: exists ? p.items.map((i) => i.id === draft.id ? draft : i) : [...p.items, draft] };
    });
    setDraft(emptyDraft());
    setEditingId(null);
  };

  const remove = (id: string) => {
    setData((p) => {
      const schedule = { ...p.schedule };
      for (const [k, v] of Object.entries(schedule)) if (v === id) delete schedule[k];
      return { ...p, items: p.items.filter((i) => i.id !== id), fixedId: p.fixedId === id ? undefined : p.fixedId, schedule };
    });
  };

  const save = async () => {
    setStatus("saving"); setError(null);
    try {
      const res = await fetch("/api/admin/quote", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Save failed");
      setStatus("saved"); setTimeout(() => setStatus("idle"), 2000);
    } catch (e) { setStatus("error"); setError(e instanceof Error ? e.message : "Lỗi"); }
  };

  const scheduleEntries = Object.entries(data.schedule).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <Toggle title="Bật override châm ngôn" desc="BẬT → dùng list em đặt. TẮT → 30 câu mặc định."
          checked={data.enabled} onChange={(v) => setData({ ...data, enabled: v })} />
        <ModePicker mode={data.mode} onChange={(m) => setData({ ...data, mode: m })}
          fixedId={data.fixedId} items={data.items.map((i) => ({ id: i.id, label: i.text.slice(0, 50) }))}
          onFixedChange={(id) => setData({ ...data, fixedId: id })} />
      </section>

      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4 text-primary" />{editingId ? "Sửa châm ngôn" : "Thêm châm ngôn mới"}</h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="q-text">Nội dung</Label>
            <textarea id="q-text" value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder="Vd: Hơi thở vào, tôi biết tôi đang sống. Hơi thở ra, tôi mỉm cười."
              maxLength={500} rows={3}
              className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-author">Tác giả</Label>
            <Input id="q-author" value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              placeholder="Vd: Thích Nhất Hạnh" maxLength={80} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {editingId && <Button variant="outline" onClick={() => { setDraft(emptyDraft()); setEditingId(null); }}>Huỷ</Button>}
          <Button onClick={upsert} disabled={!draft.text.trim()}>{editingId ? "Cập nhật" : "Thêm"}</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold px-1">List châm ngôn ({data.items.length})</h2>
        {data.items.length > 0 && (
          <ul className="space-y-2">
            {data.items.map((it) => (
              <li key={it.id} className="glass rounded-2xl p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">&ldquo;{it.text}&rdquo;</p>
                  <p className="text-xs text-primary mt-1 uppercase tracking-wider">— {it.author}</p>
                </div>
                <button type="button" onClick={() => { setDraft({ ...it }); setEditingId(it.id); }} className="grid place-items-center w-7 h-7 rounded-full text-text-muted hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => remove(it.id)} className="grid place-items-center w-7 h-7 rounded-full text-text-muted hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Gán theo ngày</h2>
        <div className="flex flex-wrap gap-2">
          <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-auto" />
          <select value={scheduleItemId} onChange={(e) => setScheduleItemId(e.target.value)}
            className="rounded-md border border-border bg-background px-3 text-sm h-8 flex-1 min-w-[200px]">
            <option value="">— Chọn châm ngôn —</option>
            {data.items.map((i) => <option key={i.id} value={i.id}>{i.text.slice(0, 60)}…</option>)}
          </select>
          <Button size="sm" disabled={!scheduleItemId} onClick={() => {
            setData((p) => ({ ...p, schedule: { ...p.schedule, [scheduleDate]: scheduleItemId } }));
            setScheduleItemId("");
          }}><Plus className="w-3.5 h-3.5 mr-1" />Gán</Button>
        </div>
        {scheduleEntries.length > 0 && (
          <ul className="space-y-1.5">
            {scheduleEntries.map(([date, id]) => {
              const item = data.items.find((i) => i.id === id);
              return (
                <li key={date} className="flex items-center gap-3 rounded-lg bg-tertiary/30 px-3 py-2 text-sm">
                  <span className="font-mono text-xs text-text-muted shrink-0">{date}</span>
                  <span className="flex-1 truncate">→ {item?.text.slice(0, 60) ?? "(đã xoá)"}</span>
                  <button type="button" onClick={() => setData((p) => { const s = { ...p.schedule }; delete s[date]; return { ...p, schedule: s }; })} className="grid place-items-center w-6 h-6 rounded-full text-text-muted hover:text-danger"><Trash2 className="w-3 h-3" /></button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="sticky bottom-4 z-10 flex justify-end">
        <div className="glass rounded-full px-4 py-2 shadow-soft flex items-center gap-3">
          {status === "saved" && <span className="inline-flex items-center gap-1 text-xs text-success"><Check className="w-3.5 h-3.5" /> Đã lưu</span>}
          <Button onClick={save} disabled={status === "saving"} size="sm">
            <Save className="w-3.5 h-3.5 mr-1.5" />{status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
