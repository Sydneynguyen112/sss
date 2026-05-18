"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { MealsDayRow } from "./meals-day-row";
import { DAY_INDICES, PROGRAM_LENGTH, getDefaultMenu, rotationIdxForDate } from "@/data/meal-program";
import type { CustomMealsOverride, MealEntry, MealSlotKey } from "@/types/customizations";

export function MealsEditor({ initial }: { initial: CustomMealsOverride }) {
  const [program, setProgram] = useState<Record<string, Partial<Record<MealSlotKey, MealEntry>>>>(
    initial.program ?? {},
  );
  const today = rotationIdxForDate(new Date());
  const [expandedIdx, setExpandedIdx] = useState<number | null>(today);
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  const updateSlot = (idx: number, slot: MealSlotKey, entry: MealEntry) => {
    setProgram((prev) => ({
      ...prev,
      [String(idx)]: { ...(prev[String(idx)] ?? {}), [slot]: entry },
    }));
  };

  const resetDay = (idx: number, slot?: MealSlotKey) => {
    setProgram((prev) => {
      const next = { ...prev };
      const key = String(idx);
      if (!slot) {
        delete next[key];
      } else {
        const day = { ...(next[key] ?? {}) };
        delete day[slot];
        if (Object.keys(day).length === 0) delete next[key];
        else next[key] = day;
      }
      return next;
    });
  };

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/meals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ program }),
      });
      const json = await res.json().catch(() => ({} as { error?: string }));
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      window.alert("✓ Đã lưu thực đơn!");
    } catch (e) {
      window.alert("✗ LƯU THẤT BẠI: " + (e instanceof Error ? e.message : "Lỗi"));
    } finally {
      setStatus("idle");
    }
  };

  const overrideCount = Object.keys(program).length;

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm">
          <span className="text-text-muted">Thực đơn xoay vòng </span>
          <strong>{PROGRAM_LENGTH} ngày</strong>
          <span className="text-text-muted"> · Đã tuỳ chỉnh: </span>
          <strong className="text-primary">{overrideCount}</strong>
        </p>
        <p className="text-xs text-text-muted">Click ngày để mở rộng + chỉnh từng bữa</p>
      </div>

      <ul className="space-y-1.5">
        {DAY_INDICES.map((idx) => (
          <MealsDayRow
            key={idx}
            dowLabel={`Ngày ${idx + 1} / ${PROGRAM_LENGTH}`}
            isToday={idx === today}
            defaultMenu={getDefaultMenu(idx)}
            override={program[String(idx)] ?? {}}
            onChange={(slot, entry) => updateSlot(idx, slot, entry)}
            onReset={(slot) => resetDay(idx, slot)}
            isOverridden={!!program[String(idx)]}
            expanded={expandedIdx === idx}
            onToggle={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          />
        ))}
      </ul>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <div className="glass rounded-full px-4 py-2 shadow-soft flex items-center gap-3">
          <span className="text-xs text-text-muted">{overrideCount} ngày đã tuỳ chỉnh</span>
          <Button onClick={save} disabled={status === "saving"} size="sm">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
