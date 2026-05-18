"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Coffee, UtensilsCrossed, Apple, Moon, Plus, Trash2, RotateCcw } from "lucide-react";
import type { MealEntry, MealSlotKey } from "@/types/customizations";

const SLOT_META: Record<MealSlotKey, { label: string; icon: typeof Coffee }> = {
  breakfast: { label: "Bữa sáng", icon: Coffee },
  snack: { label: "Bữa phụ", icon: Apple },
  lunch: { label: "Bữa trưa", icon: UtensilsCrossed },
  dinner: { label: "Bữa tối", icon: Moon },
};

const SLOT_ORDER: MealSlotKey[] = ["breakfast", "snack", "lunch", "dinner"];

export function MealsDayRow({
  dowLabel,
  isToday,
  defaultMenu,
  override,
  onChange,
  onReset,
  isOverridden,
  expanded,
  onToggle,
}: {
  dowLabel: string;
  isToday: boolean;
  defaultMenu: Record<MealSlotKey, MealEntry>;
  override: Partial<Record<MealSlotKey, MealEntry>>;
  onChange: (slot: MealSlotKey, entry: MealEntry) => void;
  onReset: (slot?: MealSlotKey) => void;
  isOverridden: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const summary = (override.breakfast?.name ?? defaultMenu.breakfast.name) + " · ...";

  return (
    <li className={`glass rounded-xl overflow-hidden ${isToday ? "border-2 border-primary" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-tertiary/20"
      >
        {expanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
        <span className="font-semibold text-sm shrink-0 w-24">{dowLabel}</span>
        <span className="text-xs text-text-muted flex-1 truncate">{summary}</span>
        {isToday && <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Hôm nay</span>}
        {isOverridden && !isToday && <span className="text-[10px] text-primary">✎</span>}
      </button>

      {expanded && (
        <div className="border-t border-border/40 p-4 space-y-4 bg-surface/30">
          {SLOT_ORDER.map((slot) => {
            const meta = SLOT_META[slot];
            const Icon = meta.icon;
            const entry = override[slot] ?? defaultMenu[slot];
            const isSlotOverridden = !!override[slot];
            return (
              <SlotEditor
                key={slot}
                slot={slot}
                label={meta.label}
                Icon={Icon}
                entry={entry}
                isOverridden={isSlotOverridden}
                onChange={(e) => onChange(slot, e)}
                onReset={() => onReset(slot)}
              />
            );
          })}
          {isOverridden && (
            <Button variant="outline" size="sm" onClick={() => onReset()}>
              <RotateCcw className="w-3 h-3 mr-1.5" />
              Reset toàn bộ {dowLabel.toLowerCase()} về mặc định
            </Button>
          )}
        </div>
      )}
    </li>
  );
}

function SlotEditor({
  slot, label, Icon, entry, isOverridden, onChange, onReset,
}: {
  slot: MealSlotKey;
  label: string;
  Icon: typeof Coffee;
  entry: MealEntry;
  isOverridden: boolean;
  onChange: (entry: MealEntry) => void;
  onReset: () => void;
}) {
  const [ingDraft, setIngDraft] = useState<{ name: string; amount: string }>({ name: "", amount: "" });

  const update = (patch: Partial<MealEntry>) => onChange({ ...entry, ...patch });

  const addIng = () => {
    if (!ingDraft.name.trim()) return;
    update({
      ingredients: [...(entry.ingredients ?? []), { name: ingDraft.name.trim(), amount: ingDraft.amount.trim() }],
    });
    setIngDraft({ name: "", amount: "" });
  };

  const removeIng = (idx: number) => {
    update({ ingredients: (entry.ingredients ?? []).filter((_, i) => i !== idx) });
  };

  return (
    <div className="rounded-lg border border-border/60 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold inline-flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-primary" />
          {label}
        </h4>
        {isOverridden && (
          <button type="button" onClick={onReset} className="text-[10px] text-text-muted hover:text-primary inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Reset {label.toLowerCase()}
          </button>
        )}
      </div>

      <Input
        value={entry.name}
        onChange={(e) => update({ name: e.target.value })}
        placeholder="Tên món"
        maxLength={160}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number" min={0} max={3000}
          value={entry.kcal ?? ""}
          onChange={(e) => update({ kcal: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="kcal"
          className="tabular-nums"
        />
        <Input
          type="number" min={0} max={300}
          value={entry.protein ?? ""}
          onChange={(e) => update({ protein: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="protein (g)"
          className="tabular-nums"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px]">Nguyên liệu</Label>
        <div className="flex gap-1.5">
          <Input value={ingDraft.name} onChange={(e) => setIngDraft((s) => ({ ...s, name: e.target.value }))} placeholder="Tên (vd: Ức gà)" className="flex-1 text-xs" />
          <Input value={ingDraft.amount} onChange={(e) => setIngDraft((s) => ({ ...s, amount: e.target.value }))} placeholder="150g" className="w-20 text-xs" />
          <Button type="button" size="sm" onClick={addIng} disabled={!ingDraft.name.trim()}><Plus className="w-3 h-3" /></Button>
        </div>
        {(entry.ingredients ?? []).length > 0 && (
          <ul className="space-y-0.5">
            {(entry.ingredients ?? []).map((ing, idx) => (
              <li key={idx} className="flex items-center gap-2 text-[11px] bg-tertiary/30 rounded px-2 py-1">
                <span className="flex-1 truncate">· {ing.name}</span>
                <span className="text-text-muted">{ing.amount}</span>
                <button type="button" onClick={() => removeIng(idx)} className="text-text-muted hover:text-danger">
                  <Trash2 className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Input
        value={entry.note ?? ""}
        onChange={(e) => update({ note: e.target.value || undefined })}
        placeholder="Lời nhắn (tuỳ chọn)"
        maxLength={320}
      />
    </div>
  );
}
