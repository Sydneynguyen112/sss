"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Plus, Trash2, Pencil, Calendar, Save } from "lucide-react";
import type { KeywordOverride, KeywordItem } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

function emptyDraft(): KeywordItem {
  return { id: randomId(), word: "", wordEn: "", ipa: "", tagline: "" };
}

export function KeywordEditor({ initial }: { initial: KeywordOverride }) {
  const [data, setData] = useState<KeywordOverride>(initial);
  const [draft, setDraft] = useState<KeywordItem>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [scheduleItemId, setScheduleItemId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const upsert = () => {
    if (!draft.word.trim()) return;
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
      const res = await fetch("/api/admin/keyword", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({} as { error?: string }));
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setStatus("saved"); setTimeout(() => setStatus("idle"), 3000);
      window.alert("✓ Đã lưu thành công! User sẽ thấy thay đổi trong ≤30 giây.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      setStatus("error"); setError(msg);
      window.alert("✗ LƯU THẤT BẠI:\n\n" + msg);
    }
  };

  const scheduleEntries = Object.entries(data.schedule).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4 text-primary" />{editingId ? "Sửa từ khoá" : "Thêm từ khoá"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="k-word">Tiếng Việt *</Label>
            <Input id="k-word" value={draft.word} onChange={(e) => setDraft({ ...draft, word: e.target.value })} placeholder="Vd: Kiến tạo" maxLength={60} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="k-en">Tiếng Anh</Label>
            <Input id="k-en" value={draft.wordEn ?? ""} onChange={(e) => setDraft({ ...draft, wordEn: e.target.value })} placeholder="Vd: Create" maxLength={60} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="k-ipa">IPA (phát âm tiếng Anh)</Label>
            <Input id="k-ipa" value={draft.ipa ?? ""} onChange={(e) => setDraft({ ...draft, ipa: e.target.value })} placeholder="/krɪˈeɪt/" maxLength={60} className="font-mono" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="k-tag">Tagline (tuỳ chọn)</Label>
            <textarea id="k-tag" value={draft.tagline ?? ""} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
              placeholder="Một câu ngắn, gợi mở." maxLength={280} rows={2}
              className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {editingId && <Button variant="outline" onClick={() => { setDraft(emptyDraft()); setEditingId(null); }}>Huỷ</Button>}
          <Button onClick={upsert} disabled={!draft.word.trim()}>{editingId ? "Cập nhật" : "Thêm vào list"}</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold px-1">List từ khoá ({data.items.length})</h2>
        {data.items.length === 0
          ? <p className="text-sm text-text-muted px-1">Chưa có từ khoá nào — thêm một cái ở trên.</p>
          : (
            <ul className="space-y-2">
              {data.items.map((it) => (
                <li key={it.id} className="glass rounded-2xl p-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="font-semibold text-base">{it.word}</p>
                      {it.wordEn && <p className="text-sm text-text-muted">/ {it.wordEn}</p>}
                      {it.ipa && <p className="text-xs text-primary font-mono">{it.ipa}</p>}
                    </div>
                    {it.tagline && <p className="text-xs text-text-secondary mt-1">{it.tagline}</p>}
                  </div>
                  <button type="button" onClick={() => { setDraft({ ...it }); setEditingId(it.id); }} className="grid place-items-center w-7 h-7 rounded-full text-text-muted hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => remove(it.id)} className="grid place-items-center w-7 h-7 rounded-full text-text-muted hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
      </section>

      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Gán cho ngày cụ thể</h2>
        <p className="text-xs text-text-muted">Ngày nào có gán riêng sẽ ưu tiên cái đó. Còn lại app random từ list.</p>
        <div className="flex flex-wrap gap-2">
          <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-auto" />
          <select value={scheduleItemId} onChange={(e) => setScheduleItemId(e.target.value)}
            className="rounded-md border border-border bg-background px-3 text-sm h-8 flex-1 min-w-[200px]">
            <option value="">— Chọn từ khoá —</option>
            {data.items.map((i) => <option key={i.id} value={i.id}>{i.word}</option>)}
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
                  <span className="flex-1 truncate">→ {item?.word ?? "(đã xoá)"}</span>
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
