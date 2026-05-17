"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Plus, Trash2, Pencil, Calendar, Save } from "lucide-react";
import type { QuoteOverride, QuoteItem } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

const PRESETS = [
  { label: "Núi sương sớm", url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=80" },
  { label: "Biển bình minh", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80" },
  { label: "Đêm thành phố", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80" },
  { label: "Rừng thu", url: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=1920&q=80" },
];

function emptyDraft(): QuoteItem {
  return { id: randomId(), text: "", author: "", imageUrl: "" };
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
      return { ...p, items: p.items.filter((i) => i.id !== id), schedule };
    });
    if (editingId === id) { setDraft(emptyDraft()); setEditingId(null); }
  };

  const save = async () => {
    setStatus("saving"); setError(null);
    try {
      const res = await fetch("/api/admin/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Save failed");
      setStatus("saved"); setTimeout(() => setStatus("idle"), 2000);
    } catch (e) { setStatus("error"); setError(e instanceof Error ? e.message : "Lỗi"); }
  };

  const scheduleEntries = Object.entries(data.schedule).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4 text-primary" />{editingId ? "Sửa cặp châm ngôn + ảnh" : "Thêm cặp châm ngôn + ảnh"}</h2>
        <p className="text-xs text-text-muted">Mỗi item gồm 1 châm ngôn + 1 ảnh nền. App chọn cặp này cùng nhau.</p>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="q-text">Châm ngôn *</Label>
            <textarea id="q-text" value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder="Vd: Hơi thở vào, tôi biết tôi đang sống..." maxLength={500} rows={3}
              className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-author">Tác giả</Label>
            <Input id="q-author" value={draft.author ?? ""} onChange={(e) => setDraft({ ...draft, author: e.target.value })} placeholder="Vd: Thích Nhất Hạnh" maxLength={80} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-img">URL ảnh (https)</Label>
            <Input id="q-img" type="url" value={draft.imageUrl ?? ""} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {PRESETS.map((p) => (
                <button key={p.url} type="button" onClick={() => setDraft({ ...draft, imageUrl: p.url })}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition ${draft.imageUrl === p.url ? "border-primary shadow-glow" : "border-border hover:border-primary/50"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-1.5 text-[9px] font-medium text-white drop-shadow">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {draft.text && (
          <div className="rounded-2xl border-2 border-dashed border-primary/30 overflow-hidden">
            <div className="relative h-[160px]">
              {draft.imageUrl
                ? // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                : <div className="absolute inset-0 bg-gradient-to-b from-tertiary to-surface" />
              }
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
              <div className="relative h-full p-4 flex flex-col justify-end text-white">
                <p className="text-sm font-light italic">&ldquo;{draft.text}&rdquo;</p>
                {draft.author && <p className="text-[10px] uppercase tracking-wider text-white/80 mt-1">— {draft.author}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {editingId && <Button variant="outline" onClick={() => { setDraft(emptyDraft()); setEditingId(null); }}>Huỷ</Button>}
          <Button onClick={upsert} disabled={!draft.text.trim()}>{editingId ? "Cập nhật" : "Thêm vào list"}</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold px-1">List châm ngôn ({data.items.length})</h2>
        {data.items.length === 0
          ? <p className="text-sm text-text-muted px-1">Chưa có. Thêm cặp đầu tiên ở trên.</p>
          : (
            <div className="grid sm:grid-cols-2 gap-3">
              {data.items.map((it) => (
                <div key={it.id} className="glass rounded-2xl overflow-hidden relative">
                  <div className="relative h-[140px]">
                    {it.imageUrl
                      ? // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      : <div className="absolute inset-0 bg-gradient-to-b from-tertiary to-surface" />
                    }
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                    <div className="relative h-full p-3 flex flex-col justify-end text-white">
                      <p className="text-xs leading-snug line-clamp-3 italic">&ldquo;{it.text}&rdquo;</p>
                      {it.author && <p className="text-[9px] uppercase tracking-wider text-white/80 mt-1">— {it.author}</p>}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button type="button" onClick={() => { setDraft({ ...it }); setEditingId(it.id); }} aria-label="Sửa" className="grid place-items-center w-7 h-7 rounded-full bg-black/60 text-white"><Pencil className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => remove(it.id)} aria-label="Xoá" className="grid place-items-center w-7 h-7 rounded-full bg-black/60 text-white hover:bg-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </section>

      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Gán cho ngày cụ thể</h2>
        <div className="flex flex-wrap gap-2">
          <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-auto" />
          <select value={scheduleItemId} onChange={(e) => setScheduleItemId(e.target.value)}
            className="rounded-md border border-border bg-background px-3 text-sm h-8 flex-1 min-w-[200px]">
            <option value="">— Chọn cặp —</option>
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
          {status === "saved" && <span className="inline-flex items-center gap-1 text-xs text-success"><Check className="w-3.5 h-3.5" />Đã lưu</span>}
          <Button onClick={save} disabled={status === "saving"} size="sm"><Save className="w-3.5 h-3.5 mr-1.5" />{status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}</Button>
        </div>
      </div>
    </div>
  );
}
