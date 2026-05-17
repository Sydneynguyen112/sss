"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Plus, Trash2, Calendar, Save } from "lucide-react";
import { Toggle, ModePicker } from "./keyword-editor";
import type { BackgroundOverride, BackgroundItem } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

function emptyDraft(): BackgroundItem {
  return { id: randomId(), imageUrl: "", label: "" };
}

const PRESETS = [
  { label: "Núi sương sớm", url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=80" },
  { label: "Bãi biển Đà Nẵng", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80" },
  { label: "Đêm thành phố", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80" },
  { label: "Rừng thu", url: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=1920&q=80" },
];

export function BackgroundEditor({ initial }: { initial: BackgroundOverride }) {
  const [data, setData] = useState<BackgroundOverride>(initial);
  const [draft, setDraft] = useState<BackgroundItem>(emptyDraft);
  const [scheduleDate, setScheduleDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [scheduleItemId, setScheduleItemId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    if (!draft.imageUrl.trim()) return;
    setData((p) => ({ ...p, items: [...p.items, draft] }));
    setDraft(emptyDraft());
  };

  const addPreset = (p: { label: string; url: string }) => {
    if (data.items.some((i) => i.imageUrl === p.url)) return;
    setData((prev) => ({ ...prev, items: [...prev.items, { id: randomId(), imageUrl: p.url, label: p.label }] }));
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
      const res = await fetch("/api/admin/background", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Save failed");
      setStatus("saved"); setTimeout(() => setStatus("idle"), 2000);
    } catch (e) { setStatus("error"); setError(e instanceof Error ? e.message : "Lỗi"); }
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <Toggle title="Bật ảnh tuỳ chỉnh" desc="BẬT → ảnh trong list em đặt thay ảnh núi mặc định. TẮT → núi gradient."
          checked={data.enabled} onChange={(v) => setData({ ...data, enabled: v })} />
        <ModePicker mode={data.mode} onChange={(m) => setData({ ...data, mode: m })}
          fixedId={data.fixedId} items={data.items.map((i) => ({ id: i.id, label: i.label || i.imageUrl.slice(0, 50) }))}
          onFixedChange={(id) => setData({ ...data, fixedId: id })} />
      </section>

      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4 text-primary" />Thêm ảnh mới</h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="bg-url">URL ảnh (https)</Label>
            <Input id="bg-url" type="url" value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bg-label">Tên gợi nhớ (tuỳ chọn)</Label>
            <Input id="bg-label" value={draft.label ?? ""} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Vd: Núi tuyết Sa Pa" maxLength={80} />
          </div>
        </div>
        <Button onClick={addItem} disabled={!draft.imageUrl.trim()} className="w-full">Thêm vào list</Button>

        <div className="space-y-2 pt-3 border-t border-border/60">
          <p className="text-xs text-text-muted">Hoặc thêm nhanh từ preset:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map((p) => {
              const has = data.items.some((i) => i.imageUrl === p.url);
              return (
                <button key={p.url} type="button" onClick={() => addPreset(p)} disabled={has}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 group transition ${has ? "opacity-50 border-success" : "border-border hover:border-primary"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-medium text-white drop-shadow">
                    {has ? "✓ Đã thêm" : p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold px-1">List ảnh ({data.items.length})</h2>
        {data.items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.items.map((it) => (
              <div key={it.id} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.imageUrl} alt={it.label ?? ""} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {it.label && <span className="absolute bottom-1.5 left-2 text-[10px] font-medium text-white drop-shadow">{it.label}</span>}
                <button type="button" onClick={() => remove(it.id)} aria-label="Xoá"
                  className="absolute top-1.5 right-1.5 grid place-items-center w-7 h-7 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Gán theo ngày</h2>
        <div className="flex flex-wrap gap-2">
          <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-auto" />
          <select value={scheduleItemId} onChange={(e) => setScheduleItemId(e.target.value)}
            className="rounded-md border border-border bg-background px-3 text-sm h-8 flex-1 min-w-[200px]">
            <option value="">— Chọn ảnh —</option>
            {data.items.map((i) => <option key={i.id} value={i.id}>{i.label || i.imageUrl.slice(0, 60)}</option>)}
          </select>
          <Button size="sm" disabled={!scheduleItemId} onClick={() => {
            setData((p) => ({ ...p, schedule: { ...p.schedule, [scheduleDate]: scheduleItemId } }));
            setScheduleItemId("");
          }}><Plus className="w-3.5 h-3.5 mr-1" />Gán</Button>
        </div>
        {Object.entries(data.schedule).sort(([a], [b]) => a.localeCompare(b)).map(([date, id]) => {
          const it = data.items.find((i) => i.id === id);
          return (
            <div key={date} className="flex items-center gap-3 rounded-lg bg-tertiary/30 px-3 py-2 text-sm">
              <span className="font-mono text-xs text-text-muted shrink-0">{date}</span>
              <span className="flex-1 truncate">→ {it?.label || it?.imageUrl.slice(0, 60) || "(đã xoá)"}</span>
              <button type="button" onClick={() => setData((p) => { const s = { ...p.schedule }; delete s[date]; return { ...p, schedule: s }; })} className="grid place-items-center w-6 h-6 rounded-full text-text-muted hover:text-danger"><Trash2 className="w-3 h-3" /></button>
            </div>
          );
        })}
      </section>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="sticky bottom-4 z-10 flex justify-end">
        <div className="glass rounded-full px-4 py-2 shadow-soft flex items-center gap-3">
          {status === "saved" && <span className="inline-flex items-center gap-1 text-xs text-success"><Check className="w-3.5 h-3.5" /> Đã lưu</span>}
          <Button onClick={save} disabled={status === "saving"} size="sm"><Save className="w-3.5 h-3.5 mr-1.5" />{status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}</Button>
        </div>
      </div>
    </div>
  );
}
