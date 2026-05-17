"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Plus, Trash2, Calendar, Save, Coffee, UtensilsCrossed, Moon, Flame, Drumstick, Pencil } from "lucide-react";
import type { CustomMealsOverride, CustomMealItem, MealSlotKey } from "@/types/customizations";
import { randomId } from "@/lib/utils/pick-for-today";

const SLOTS: { key: MealSlotKey; label: string; icon: typeof Coffee }[] = [
  { key: "breakfast", label: "Bữa sáng", icon: Coffee },
  { key: "lunch", label: "Bữa trưa", icon: UtensilsCrossed },
  { key: "dinner", label: "Bữa tối", icon: Moon },
];

function emptyDraft(slot: MealSlotKey): CustomMealItem {
  return { id: randomId(), slot, name: "", note: "", kcal: undefined, protein: undefined, ingredients: [] };
}

export function MealsEditor({ initial }: { initial: CustomMealsOverride }) {
  const [data, setData] = useState<CustomMealsOverride>(initial);
  const [drafts, setDrafts] = useState<Record<MealSlotKey, CustomMealItem>>({
    breakfast: emptyDraft("breakfast"),
    lunch: emptyDraft("lunch"),
    dinner: emptyDraft("dinner"),
  });
  const [editingId, setEditingId] = useState<{ slot: MealSlotKey; id: string } | null>(null);
  const [ingredientDrafts, setIngredientDrafts] = useState<Record<MealSlotKey, { name: string; amount: string }>>({
    breakfast: { name: "", amount: "" },
    lunch: { name: "", amount: "" },
    dinner: { name: "", amount: "" },
  });
  const [scheduleDate, setScheduleDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [scheduleSlot, setScheduleSlot] = useState<MealSlotKey>("breakfast");
  const [scheduleItemId, setScheduleItemId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const upsertItem = (slot: MealSlotKey) => {
    const d = drafts[slot];
    if (!d.name.trim()) return;
    setData((p) => {
      const exists = p.items[slot].some((i) => i.id === d.id);
      return {
        ...p,
        items: { ...p.items, [slot]: exists ? p.items[slot].map((i) => i.id === d.id ? d : i) : [...p.items[slot], d] },
      };
    });
    setDrafts((s) => ({ ...s, [slot]: emptyDraft(slot) }));
    setEditingId(null);
  };

  const editItem = (slot: MealSlotKey, item: CustomMealItem) => {
    setDrafts((s) => ({ ...s, [slot]: { ...item, ingredients: item.ingredients ?? [] } }));
    setEditingId({ slot, id: item.id });
  };

  const remove = (slot: MealSlotKey, id: string) => {
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
    if (editingId?.id === id) {
      setDrafts((s) => ({ ...s, [slot]: emptyDraft(slot) }));
      setEditingId(null);
    }
  };

  const addIngredient = (slot: MealSlotKey) => {
    const ing = ingredientDrafts[slot];
    if (!ing.name.trim()) return;
    setDrafts((s) => ({
      ...s,
      [slot]: { ...s[slot], ingredients: [...(s[slot].ingredients ?? []), { name: ing.name.trim(), amount: ing.amount.trim() }] },
    }));
    setIngredientDrafts((s) => ({ ...s, [slot]: { name: "", amount: "" } }));
  };

  const removeIngredient = (slot: MealSlotKey, idx: number) => {
    setDrafts((s) => ({
      ...s,
      [slot]: { ...s[slot], ingredients: (s[slot].ingredients ?? []).filter((_, i) => i !== idx) },
    }));
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
      <p className="text-sm text-text-muted px-1">
        Tự thêm món cho từng bữa với <strong className="text-text-primary">kcal + protein + nguyên liệu</strong>. Có items → app random theo ngày.
      </p>

      <Tabs defaultValue="breakfast" className="w-full">
        <TabsList className="grid grid-cols-3">
          {SLOTS.map((s) => <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>)}
        </TabsList>

        {SLOTS.map((s) => {
          const Icon = s.icon;
          const draft = drafts[s.key];
          const ingDraft = ingredientDrafts[s.key];
          const isEditing = editingId?.slot === s.key;
          return (
            <TabsContent key={s.key} value={s.key} className="space-y-4 mt-4">
              <div className="glass rounded-3xl p-5 space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Icon className="w-4 h-4 text-primary" />
                  {isEditing ? `Sửa món ${s.label.toLowerCase()}` : `Thêm món cho ${s.label.toLowerCase()}`}
                </h3>

                <div className="space-y-1.5">
                  <Label htmlFor={`m-name-${s.key}`}>Tên món *</Label>
                  <Input id={`m-name-${s.key}`} value={draft.name}
                    onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: { ...d[s.key], name: e.target.value } }))}
                    placeholder="Vd: Phở bò viên + cà phê đen" maxLength={160} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`m-kcal-${s.key}`} className="flex items-center gap-1"><Flame className="w-3 h-3 text-warning" />Calories (kcal)</Label>
                    <Input id={`m-kcal-${s.key}`} type="number" min={0} max={3000} value={draft.kcal ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: { ...d[s.key], kcal: e.target.value ? Number(e.target.value) : undefined } }))}
                      placeholder="650" className="tabular-nums" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`m-prot-${s.key}`} className="flex items-center gap-1"><Drumstick className="w-3 h-3 text-success" />Protein (g)</Label>
                    <Input id={`m-prot-${s.key}`} type="number" min={0} max={300} value={draft.protein ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: { ...d[s.key], protein: e.target.value ? Number(e.target.value) : undefined } }))}
                      placeholder="40" className="tabular-nums" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Nguyên liệu</Label>
                  <div className="flex gap-2">
                    <Input value={ingDraft.name}
                      onChange={(e) => setIngredientDrafts((s2) => ({ ...s2, [s.key]: { ...s2[s.key], name: e.target.value } }))}
                      placeholder="Tên (vd: Ức gà)" className="flex-1" />
                    <Input value={ingDraft.amount}
                      onChange={(e) => setIngredientDrafts((s2) => ({ ...s2, [s.key]: { ...s2[s.key], amount: e.target.value } }))}
                      placeholder="Lượng (vd: 150g)" className="w-28" />
                    <Button size="sm" onClick={() => addIngredient(s.key)} disabled={!ingDraft.name.trim()}><Plus className="w-3.5 h-3.5" /></Button>
                  </div>
                  {(draft.ingredients ?? []).length > 0 && (
                    <ul className="space-y-1 pt-1">
                      {(draft.ingredients ?? []).map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs bg-tertiary/30 rounded-lg px-2 py-1">
                          <span className="flex-1">· {ing.name}</span>
                          <span className="text-text-muted">{ing.amount}</span>
                          <button type="button" onClick={() => removeIngredient(s.key, idx)} className="text-text-muted hover:text-danger"><Trash2 className="w-3 h-3" /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`m-note-${s.key}`}>Lời nhắn (tuỳ chọn)</Label>
                  <textarea id={`m-note-${s.key}`} value={draft.note ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: { ...d[s.key], note: e.target.value } }))}
                    placeholder="Vd: Em chuẩn bị sẵn nguyên liệu rồi ♡" maxLength={320} rows={2}
                    className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>

                <div className="flex justify-end gap-2">
                  {isEditing && (
                    <Button variant="outline" onClick={() => {
                      setDrafts((s2) => ({ ...s2, [s.key]: emptyDraft(s.key) }));
                      setEditingId(null);
                    }}>Huỷ</Button>
                  )}
                  <Button onClick={() => upsertItem(s.key)} disabled={!draft.name.trim()}>
                    {isEditing ? "Cập nhật" : "Thêm vào list"}
                  </Button>
                </div>
              </div>

              <ul className="space-y-2">
                {data.items[s.key].length === 0
                  ? <p className="text-xs text-text-muted text-center py-4">Chưa có món nào cho {s.label.toLowerCase()}.</p>
                  : data.items[s.key].map((it) => (
                      <li key={it.id} className="glass rounded-2xl p-4 flex items-start gap-3">
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <p className="font-semibold text-sm">{it.name}</p>
                          {(it.kcal || it.protein) && (
                            <div className="flex items-center gap-3 text-xs text-text-muted">
                              {it.kcal !== undefined && (
                                <span className="inline-flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-warning" />
                                  <span className="tabular-nums">{it.kcal} kcal</span>
                                </span>
                              )}
                              {it.protein !== undefined && (
                                <span className="inline-flex items-center gap-1">
                                  <Drumstick className="w-3 h-3 text-success" />
                                  <span className="tabular-nums">{it.protein}g protein</span>
                                </span>
                              )}
                            </div>
                          )}
                          {(it.ingredients ?? []).length > 0 && (
                            <ul className="space-y-0.5">
                              {(it.ingredients ?? []).slice(0, 4).map((ing, idx) => (
                                <li key={idx} className="text-[11px] text-text-secondary flex items-center gap-1.5">
                                  <span className="text-text-muted">·</span>
                                  <span className="flex-1 truncate">{ing.name}</span>
                                  <span className="text-text-muted shrink-0">{ing.amount}</span>
                                </li>
                              ))}
                              {(it.ingredients ?? []).length > 4 && (
                                <li className="text-[10px] text-text-muted">+ {(it.ingredients ?? []).length - 4} nguyên liệu khác</li>
                              )}
                            </ul>
                          )}
                          {it.note && <p className="text-xs text-text-muted italic">&ldquo;{it.note}&rdquo;</p>}
                        </div>
                        <button type="button" onClick={() => editItem(s.key, it)} className="grid place-items-center w-7 h-7 rounded-full text-text-muted hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => remove(s.key, it.id)} className="grid place-items-center w-7 h-7 rounded-full text-text-muted hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                      </li>
                    ))
                }
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
