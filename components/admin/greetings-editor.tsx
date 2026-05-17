"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Plus, Trash2, Calendar, Save } from "lucide-react";
import type { GreetingOverride, GreetingItem, TimeSlot } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

const SLOTS: { key: TimeSlot; label: string; range: string }[] = [
  { key: "morning", label: "Sáng", range: "5h – 11h" },
  { key: "noon", label: "Trưa", range: "11h – 17h" },
  { key: "evening", label: "Chiều", range: "17h – 22h" },
  { key: "night", label: "Đêm", range: "22h – 5h" },
];

export function GreetingsEditor({ initial }: { initial: GreetingOverride }) {
  const [data, setData] = useState<GreetingOverride>(initial);
  const [drafts, setDrafts] = useState<Record<TimeSlot, string>>({ morning: "", noon: "", evening: "", night: "" });
  const [scheduleDate, setScheduleDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [scheduleSlot, setScheduleSlot] = useState<TimeSlot>("morning");
  const [scheduleItemId, setScheduleItemId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const addItem = (slot: TimeSlot) => {
    const text = drafts[slot].trim();
    if (!text) return;
    const item: GreetingItem = { id: randomId(), text };
    setData((p) => ({ ...p, items: { ...p.items, [slot]: [...p.items[slot], item] } }));
    setDrafts((d) => ({ ...d, [slot]: "" }));
  };

  const remove = (slot: TimeSlot, id: string) => {
    setData((p) => {
      const schedule = { ...p.schedule };
      for (const date of Object.keys(schedule)) {
        if (schedule[date]?.[slot] === id) {
          const next = { ...schedule[date] };
          delete next[slot];
          if (Object.keys(next).length === 0) delete schedule[date];
          else schedule[date] = next;
        }
      }
      return { ...p, items: { ...p.items, [slot]: p.items[slot].filter((i) => i.id !== id) }, schedule };
    });
  };

  const save = async () => {
    setStatus("saving"); setError(null);
    try {
      const res = await fetch("/api/admin/greetings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({} as { error?: string }));
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setStatus("saved"); setTimeout(() => setStatus("idle"), 3000);
      window.alert("✓ Đã lưu thành công! User sẽ thấy thay đổi trong ≤30 giây.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      setStatus("error"); setError(msg);
      window.alert("✗ LƯU THẤT BẠI:\n\n" + msg + "\n\n(Lý do thường: KV chưa cấu hình, hoặc Vercel deploy chưa xong.)");
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted px-1">
        Mỗi khung giờ có list lời chúc riêng. Có items → app random theo ngày. Dùng <code className="bg-tertiary/40 px-1 rounded">{"{name}"}</code> để chèn tên anh.
      </p>

      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid grid-cols-4">
          {SLOTS.map((s) => <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>)}
        </TabsList>

        {SLOTS.map((s) => (
          <TabsContent key={s.key} value={s.key} className="space-y-4 mt-4">
            <p className="text-xs text-text-muted px-1">Khung giờ {s.range}</p>

            <div className="glass rounded-3xl p-5 space-y-3">
              <Label htmlFor={`new-${s.key}`}>Thêm lời chúc {s.label.toLowerCase()}</Label>
              <div className="flex gap-2">
                <Input id={`new-${s.key}`} value={drafts[s.key]}
                  onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: e.target.value }))}
                  placeholder={`Vd: Chào ${s.label.toLowerCase()}, {name}!`} maxLength={200} />
                <Button onClick={() => addItem(s.key)} disabled={!drafts[s.key].trim()}><Plus className="w-3.5 h-3.5" /></Button>
              </div>
            </div>

            <ul className="space-y-2">
              {data.items[s.key].length === 0
                ? <p className="text-xs text-text-muted text-center py-4">Chưa có lời chúc cho khung giờ này.</p>
                : data.items[s.key].map((it) => (
                    <li key={it.id} className="glass rounded-xl p-3 flex items-center gap-3">
                      <p className="flex-1 text-sm">{it.text}</p>
                      <button type="button" onClick={() => remove(s.key, it.id)} className="grid place-items-center w-7 h-7 rounded-full text-text-muted hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                    </li>
                  ))
              }
            </ul>
          </TabsContent>
        ))}
      </Tabs>

      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Gán theo ngày + khung giờ</h2>
        <div className="flex flex-wrap gap-2">
          <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-auto" />
          <select value={scheduleSlot} onChange={(e) => setScheduleSlot(e.target.value as TimeSlot)} className="rounded-md border border-border bg-background px-3 text-sm h-8">
            {SLOTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select value={scheduleItemId} onChange={(e) => setScheduleItemId(e.target.value)}
            className="rounded-md border border-border bg-background px-3 text-sm h-8 flex-1 min-w-[180px]">
            <option value="">— Chọn lời chúc —</option>
            {data.items[scheduleSlot].map((i) => <option key={i.id} value={i.id}>{i.text}</option>)}
          </select>
          <Button size="sm" disabled={!scheduleItemId} onClick={() => {
            setData((p) => ({
              ...p,
              schedule: { ...p.schedule, [scheduleDate]: { ...(p.schedule[scheduleDate] ?? {}), [scheduleSlot]: scheduleItemId } },
            }));
            setScheduleItemId("");
          }}><Plus className="w-3.5 h-3.5 mr-1" />Gán</Button>
        </div>

        {Object.entries(data.schedule).sort(([a], [b]) => a.localeCompare(b)).flatMap(([date, slots]) =>
          Object.entries(slots ?? {}).map(([slot, id]) => {
            const item = data.items[slot as TimeSlot]?.find((i) => i.id === id);
            return (
              <div key={`${date}-${slot}`} className="flex items-center gap-3 rounded-lg bg-tertiary/30 px-3 py-2 text-sm">
                <span className="font-mono text-xs text-text-muted shrink-0">{date}</span>
                <span className="text-xs text-primary font-medium shrink-0">{SLOTS.find((s) => s.key === slot)?.label}</span>
                <span className="flex-1 truncate">→ {item?.text ?? "(đã xoá)"}</span>
                <button type="button" onClick={() => {
                  setData((p) => {
                    const schedule = { ...p.schedule };
                    const next = { ...schedule[date] };
                    delete next[slot as TimeSlot];
                    if (Object.keys(next).length === 0) delete schedule[date];
                    else schedule[date] = next;
                    return { ...p, schedule };
                  });
                }} className="grid place-items-center w-6 h-6 rounded-full text-text-muted hover:text-danger"><Trash2 className="w-3 h-3" /></button>
              </div>
            );
          })
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
