"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, ChevronRight, Save, RotateCcw, Trash2 } from "lucide-react";
import type { TennisOverride, TennisDayOverride, TennisDrillOverride } from "@/types/customizations";
import { generateProgram, type TennisDay, type TennisDrill } from "@/data/tennis-program";

function mergeDrills(defaults: TennisDrill[], override?: TennisDrillOverride[]): TennisDrill[] {
  if (!override || override.length === 0) return defaults;
  return override.map((o, i) => ({
    name: o.name ?? defaults[i]?.name ?? "Drill " + (i + 1),
    minutes: o.minutes ?? defaults[i]?.minutes ?? 10,
    description: o.description ?? defaults[i]?.description ?? "",
  }));
}

export function TennisEditor({ initial }: { initial: TennisOverride }) {
  const program = useMemo(() => generateProgram(), []);
  const [days, setDays] = useState<Record<string, TennisDayOverride>>(initial.days ?? {});
  const [expandedDate, setExpandedDate] = useState<string | null>(() => {
    const todayKey = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();
    return program.find((d) => d.date === todayKey)?.date ?? program[0]?.date ?? null;
  });
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  const todayKey = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  const effectiveDay = (day: TennisDay): { drills: TennisDrill[]; note: string } => {
    const ov = days[day.date];
    return {
      drills: mergeDrills(day.drills, ov?.drills),
      note: ov?.note ?? day.note ?? "",
    };
  };

  const updateDrill = (date: string, idx: number, patch: Partial<TennisDrill>, defaults: TennisDrill[]) => {
    setDays((prev) => {
      const cur = prev[date] ?? {};
      const drills = mergeDrills(defaults, cur.drills);
      drills[idx] = { ...drills[idx]!, ...patch };
      return { ...prev, [date]: { ...cur, drills } };
    });
  };

  const resetDay = (date: string) => {
    setDays((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  };

  const setNote = (date: string, note: string) => {
    setDays((prev) => ({ ...prev, [date]: { ...(prev[date] ?? {}), note } }));
  };

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/tennis", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ days }),
      });
      const json = await res.json().catch(() => ({} as { error?: string }));
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      window.alert("✓ Đã lưu lịch tennis!");
    } catch (e) {
      window.alert("✗ LƯU THẤT BẠI: " + (e instanceof Error ? e.message : "Lỗi"));
    } finally {
      setStatus("idle");
    }
  };

  const overrideCount = Object.keys(days).length;

  // Group by week
  const weeks: TennisDay[][] = [];
  for (const day of program) {
    if (!weeks[day.weekIndex]) weeks[day.weekIndex] = [];
    weeks[day.weekIndex]!.push(day);
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm">
          <span className="text-text-muted">Tổng: </span>
          <strong>{program.length} ngày</strong>
          <span className="text-text-muted"> · Đã tuỳ chỉnh: </span>
          <strong className="text-primary">{overrideCount}</strong>
        </p>
        <p className="text-xs text-text-muted">Click vào ngày để mở rộng + chỉnh</p>
      </div>

      {weeks.map((weekDays, wIdx) => (
        <section key={wIdx} className="space-y-2">
          <h2 className="font-semibold text-sm px-1 text-primary">{weekDays[0]!.weekFocus}</h2>
          <ul className="space-y-1.5">
            {weekDays.map((day) => {
              const effective = effectiveDay(day);
              const isExpanded = expandedDate === day.date;
              const isToday = day.date === todayKey;
              const isOverridden = !!days[day.date];
              const totalMins = effective.drills.reduce((a, d) => a + d.minutes, 0);
              return (
                <li key={day.date} className={`glass rounded-xl overflow-hidden ${isToday ? "border-2 border-primary" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setExpandedDate(isExpanded ? null : day.date)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-tertiary/20"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                    <span className="font-mono text-xs text-text-muted tabular-nums shrink-0 w-20">{day.date}</span>
                    <span className="text-sm flex-1 truncate">{effective.drills[1]?.name ?? "—"}</span>
                    <span className="text-[10px] text-text-muted tabular-nums">{totalMins}p</span>
                    {isToday && <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Hôm nay</span>}
                    {isOverridden && !isToday && <span className="text-[10px] text-primary">✎</span>}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border/40 p-4 space-y-3 bg-surface/30">
                      <ul className="space-y-3">
                        {effective.drills.map((drill, idx) => (
                          <li key={idx} className="rounded-lg border border-border/60 p-3 space-y-2">
                            <div className="flex gap-2">
                              <Input value={drill.name} onChange={(e) => updateDrill(day.date, idx, { name: e.target.value }, day.drills)} placeholder="Tên drill" className="flex-1" />
                              <Input type="number" min={1} max={120} value={drill.minutes} onChange={(e) => updateDrill(day.date, idx, { minutes: Number(e.target.value) || 0 }, day.drills)} placeholder="phút" className="w-20 tabular-nums" />
                            </div>
                            <textarea value={drill.description} onChange={(e) => updateDrill(day.date, idx, { description: e.target.value }, day.drills)}
                              placeholder="Mô tả chi tiết" rows={2} maxLength={500}
                              className="w-full rounded-md border border-border bg-background p-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                          </li>
                        ))}
                      </ul>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Lời nhắn riêng cho ngày này (tuỳ chọn)</Label>
                        <Input value={effective.note} onChange={(e) => setNote(day.date, e.target.value)} placeholder="Vd: Cố lên, em tin anh!" maxLength={320} />
                      </div>
                      {isOverridden && (
                        <Button variant="outline" size="sm" onClick={() => resetDay(day.date)}>
                          <RotateCcw className="w-3 h-3 mr-1.5" />Reset về mặc định
                        </Button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="sticky bottom-4 z-10 flex justify-end">
        <div className="glass rounded-full px-4 py-2 shadow-soft flex items-center gap-3">
          <span className="text-xs text-text-muted">{overrideCount} ngày đã tuỳ chỉnh</span>
          <Button onClick={save} disabled={status === "saving"} size="sm">
            <Save className="w-3.5 h-3.5 mr-1.5" />{status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
