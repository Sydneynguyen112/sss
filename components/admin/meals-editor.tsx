"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Plus, Trash2, Calendar, Save, Coffee, UtensilsCrossed, Moon } from "lucide-react";
import { Toggle } from "./keyword-editor";
import type { CustomMealsOverride, CustomMealItem, MealSlotKey } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

const SLOTS: { key: MealSlotKey; label: string; icon: typeof Coffee }[] = [
  { key: "breakfast", label: "Bữa sáng", icon: Coffee },
  { key: "lunch", label: "Bữa trưa", icon: UtensilsCrossed },
  { key: "dinner", label: "Bữa tối", icon: Moon },
];

function emptyDraft(slot: MealSlotKey): CustomMealItem {
  return { id: randomId(), slot, name: "", note: "" };
}

export function MealsEditor({ initial }: { initial: CustomMealsOverride }) {
  const [data, setData] = useState<CustomMealsOverride>(initial);
  const [drafts, setDrafts] = useState<Record<MealSlotKey, CustomMealItem>>({
    breakfast: emptyDraft("breakfast"),
    lunch: emptyDraft("lunch"),
    dinner: emptyDraft("dinner"),
  });
  const [scheduleDate, setScheduleDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [scheduleSlot, setScheduleSlot] = useState<MealSlotKey>("breakfast");
  const [scheduleItemId, setScheduleItemId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const addItem = (slot: MealSlotKey) => {
    const d = drafts[slot];
    if (!d.name.trim()) return;
    setData((p) => ({ ...p, items: { ...p.items, [slot]: [...p.items[slot], d] } }));
    setDrafts((s) => ({ ...s, [slot]: emptyDraft(slot) }));
  };

  const remove = (slot: MealSlotKey, id: string) => {
    setData((p) => {
      const fixedIds = { ...(p.fixedIds ?? {}) };
      if (fixedIds[slot] === id) delete fixedIds[slot];
      const schedule = { ...p.schedule };
      for (const date of Object.keys(schedule)) {
        if (schedule[date]?.[slot] === id) {
          const { [slot]: _, ...rest } = schedule[date]!;
          if (Object.keys(rest).length === 0) delete schedule[date];
          else schedule[date] = rest;
        }
      }
      return { ...p, items: { ...p.items, [slot]: p.items[slot].filter((i) => i.id !== id) }, fixedIds, schedule };
    });
  };

  const save = async () => {
    setStatus("saving"); setError(null);
    try {
      const res = await fetch("/api/admin/meals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Save failed");
      setStatus("saved"); setTimeout(() => setStatus("idle"), 2000);
    } catch (e) { setStatus("error"); setError(e instanceof Error ? e.message : "Lỗi"); }
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-4">
        <Toggle title="Bật override bữa ăn" desc="BẬT → menu em đặt thay thực đơn mặc định. TẮT → menu mặc định."
          checked={data.enabled} onChange={(v) => setData({ ...data, enabled: v })} />
        <div className="space-y-2">
          <Label>Chế độ chọn mặc định</Label>
          <div className="flex gap-2 flex-wrap">
            <ModePill active={data.mode === "random"} onClick={() => setData({ ...data, mode: "random" })}>🎲 Random</ModePill>
            <ModePill active={data.mode === "fixed"} onClick={() => setData({ ...data, mode: "fixed" })}>📌 Cố định</ModePill>
          </div>
        </div>
      </section>

      <Tabs defaultValue="breakfast" className="w-full">
        <TabsList className="grid grid-cols-3">
          {SLOTS.map((s) => <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>)}
        </TabsList>

        {SLOTS.map((s) => {
          const Icon = s.icon;
          const draft = drafts[s.key];
          return (
            <TabsContent key={s.key} value={s.key} className="space-y-4 mt-4">
              <div className="glass rounded-3xl p-5 space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-sm"><Icon className="w-4 h-4 text-primary" />Thêm món cho {s.label.toLowerCase()}</h3>
                <Input value={draft.name} onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: { ...d[s.key], name: e.target.value } }))}
                  placeholder="Vd: Phở bò viên + cà phê đen" maxLength={160} />
                <textarea value={draft.note ?? ""} onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: { ...d[s.key], note: e.target.value } }))}
                  placeholder="Lời nhắn riêng (tuỳ chọn) — vd: Em chuẩn bị sẵn nguyên liệu rồi ♡"
                  maxLength={320} rows={2}
                  className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                <Button onClick={() => addItem(s.key)} disabled={!draft.name.trim()} className="w-full"><Plus className="w-3.5 h-3.5 mr-1" />Thêm vào list</Button>

                {data.mode === "fixed" && data.items[s.key].length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <Label className="text-xs">Cố định cho {s.label.toLowerCase()}</Label>
                    <select value={data.fixedIds?.[s.key] ?? ""}
                      onChange={(e) => setData((p) => ({ ...p, fixedIds: { ...p.fixedIds, [s.key]: e.target.value || undefined } }))}
                      className="rounded-md border border-border bg-background px-3 text-sm h-8 w-full">
                      <option value="">— Không cố định —</option>
                      {data.items[s.key].map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <ul className="space-y-2">
                {data.items[s.key].map((it) => (
                  <li key={it.id} className="glass rounded-xl p-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{it.name}</p>
                      {it.note && <p className="text-xs text-text-muted italic mt-0.5">&ldquo;{it.note}&rdquo;</p>}
                    </div>
                    <button type="button" onClick={() => remove(s.key, it.id)} className="grid place-items-center w-7 h-7 rounded-full text-text-muted hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                  </li>
                ))}
                {data.items[s.key].length === 0 && <p className="text-xs text-text-muted text-center py-4">Chưa có món nào cho {s.label.toLowerCase()}.</p>}
              </ul>
            </TabsContent>
          );
        })}
      </Tabs>

      <section className="glass rounded-3xl p-6 sm:p-7 shadow-soft space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />Gán theo ngày + bữa</h2>
        <div className="flex flex-wrap gap-2">
          <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-auto" />
          <select value={scheduleSlot} onChange={(e) => setScheduleSlot(e.target.value as MealSlotKey)} className="rounded-md border border-border bg-background px-3 text-sm h-8">
            {SLOTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select value={scheduleItemId} onChange={(e) => setScheduleItemId(e.target.value)}
            className="rounded-md border border-border bg-background px-3 text-sm h-8 flex-1 min-w-[180px]">
            <option value="">— Chọn món —</option>
            {data.items[scheduleSlot].map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <Button size="sm" disabled={!scheduleItemId} onClick={() => {
            setData((p) => ({
              ...p,
              schedule: { ...p.schedule, [scheduleDate]: { ...(p.schedule[scheduleDate] ?? {}), [scheduleSlot]: scheduleItemId } },
            }));
            setScheduleItemId("");
          }}><Plus className="w-3.5 h-3.5 mr-1" />Gán</Button>
        </div>
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

function ModePill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${active ? "bg-primary text-primary-foreground border-primary" : "bg-surface/40 text-text-secondary border-border hover:text-text-primary"}`}>
      {children}
    </button>
  );
}
