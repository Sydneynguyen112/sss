"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { MealsDayRow } from "./meals-day-row";
import { DOW_INDICES, DOW_LABEL, getDefaultMenu, type DowIdx } from "@/data/meal-program";
import type { CustomMealsOverride, MealEntry, MealSlotKey } from "@/types/customizations";

function todayDowIdx(): DowIdx {
  const js = new Date().getDay(); // 0=Sun..6=Sat
  return ((js === 0 ? 6 : js - 1) as DowIdx); // 0=Mon..6=Sun
}

export function MealsEditor({ initial }: { initial: CustomMealsOverride }) {
  const [program, setProgram] = useState<Record<string, Partial<Record<MealSlotKey, MealEntry>>>>(
    initial.program ?? {},
  );
  const [expandedDow, setExpandedDow] = useState<DowIdx | null>(todayDowIdx());
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  const today = todayDowIdx();

  const updateSlot = (dow: DowIdx, slot: MealSlotKey, entry: MealEntry) => {
    setProgram((prev) => ({
      ...prev,
      [String(dow)]: { ...(prev[String(dow)] ?? {}), [slot]: entry },
    }));
  };

  const resetDay = (dow: DowIdx, slot?: MealSlotKey) => {
    setProgram((prev) => {
      const next = { ...prev };
      const dowKey = String(dow);
      if (!slot) {
        delete next[dowKey];
      } else {
        const day = { ...(next[dowKey] ?? {}) };
        delete day[slot];
        if (Object.keys(day).length === 0) delete next[dowKey];
        else next[dowKey] = day;
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
          <strong>7 ngày</strong>
          <span className="text-text-muted"> · Đã tuỳ chỉnh: </span>
          <strong className="text-primary">{overrideCount} thứ</strong>
        </p>
        <p className="text-xs text-text-muted">Click ngày để mở rộng + chỉnh từng bữa</p>
      </div>

      <ul className="space-y-1.5">
        {DOW_INDICES.map((dow) => (
          <MealsDayRow
            key={dow}
            dowLabel={DOW_LABEL[dow]}
            isToday={dow === today}
            defaultMenu={getDefaultMenu(dow)}
            override={program[String(dow)] ?? {}}
            onChange={(slot, entry) => updateSlot(dow, slot, entry)}
            onReset={(slot) => resetDay(dow, slot)}
            isOverridden={!!program[String(dow)]}
            expanded={expandedDow === dow}
            onToggle={() => setExpandedDow(expandedDow === dow ? null : dow)}
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
