"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, Coffee, UtensilsCrossed, Moon, Sunrise } from "lucide-react";
import type { WeekendMealsOverride } from "@/types/customizations";

type DayKey = "saturday" | "sunday";
type DayData = NonNullable<WeekendMealsOverride["saturday"]>;

const DAYS: { key: DayKey; label: string; subtitle: string }[] = [
  { key: "saturday", label: "Thứ 7", subtitle: "Saturday" },
  { key: "sunday", label: "Chủ Nhật", subtitle: "Sunday" },
];

const SLOTS: { key: keyof DayData; label: string; placeholder: string; icon: typeof Coffee }[] = [
  { key: "breakfast", label: "Bữa sáng", placeholder: "Vd: Phở bò viên + cà phê đen", icon: Coffee },
  { key: "lunch", label: "Bữa trưa", placeholder: "Vd: Bún bò Huế + trà đá", icon: UtensilsCrossed },
  { key: "dinner", label: "Bữa tối", placeholder: "Vd: Pizza tự làm + rượu vang", icon: Moon },
];

function emptyDay(): DayData {
  return { breakfast: "", lunch: "", dinner: "", note: "" };
}

export function WeekendMealsEditor({ initial }: { initial: WeekendMealsOverride }) {
  const [data, setData] = useState<WeekendMealsOverride>({
    enabled: initial.enabled,
    dailyBreakfast: {
      text: initial.dailyBreakfast?.text ?? "",
      note: initial.dailyBreakfast?.note ?? "",
    },
    saturday: { ...emptyDay(), ...(initial.saturday ?? {}) },
    sunday: { ...emptyDay(), ...(initial.sunday ?? {}) },
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const updateDay = (day: DayKey, patch: Partial<DayData>) => {
    setData((prev) => ({
      ...prev,
      [day]: { ...(prev[day] ?? emptyDay()), ...patch },
    }));
  };

  const save = async () => {
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/weekend-meals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Save failed");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra");
    }
  };

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
      <div className="flex items-center justify-between rounded-xl bg-tertiary/30 p-4">
        <div>
          <p className="font-semibold">Bật gợi ý bữa ăn</p>
          <p className="text-xs text-text-muted mt-0.5">
            Bữa sáng hằng ngày + bữa cuối tuần. Hiện trong modal bữa ăn trên Lịch trình của anh (không thay default macros).
          </p>
        </div>
        <Switch
          checked={data.enabled}
          onCheckedChange={(v) => setData({ ...data, enabled: v })}
        />
      </div>

      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
          <Sunrise className="w-5 h-5 text-primary" strokeWidth={1.75} />
          <div>
            <h2 className="text-lg font-semibold">Bữa sáng hằng ngày</h2>
            <p className="text-xs text-text-muted">Áp dụng MỌI ngày trong tuần (T2–CN). Hiện chỉ ở event bữa sáng 8h.</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="daily-breakfast-text">Gợi ý bữa sáng</Label>
          <Input
            id="daily-breakfast-text"
            value={data.dailyBreakfast?.text ?? ""}
            onChange={(e) =>
              setData({
                ...data,
                dailyBreakfast: { ...(data.dailyBreakfast ?? {}), text: e.target.value },
              })
            }
            placeholder="Vd: Yến mạch chuối + whey + bơ đậu phộng. Nhớ uống đủ 500ml nước nha!"
            maxLength={200}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="daily-breakfast-note">Lời nhắn riêng (tuỳ chọn)</Label>
          <textarea
            id="daily-breakfast-note"
            value={data.dailyBreakfast?.note ?? ""}
            onChange={(e) =>
              setData({
                ...data,
                dailyBreakfast: { ...(data.dailyBreakfast ?? {}), note: e.target.value },
              })
            }
            placeholder="Vd: Khởi đầu ngày bằng protein là cách yêu cơ thể nhất ♡"
            maxLength={320}
            rows={2}
            className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <p className="text-[10px] text-text-muted text-right">
            {(data.dailyBreakfast?.note ?? "").length}/320
          </p>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-5">
        {DAYS.map((day) => {
          const dd = data[day.key] ?? emptyDay();
          return (
            <section key={day.key} className="rounded-2xl border border-border/60 p-5 space-y-4">
              <header className="border-b border-border/60 pb-3">
                <h2 className="text-lg font-semibold">{day.label}</h2>
                <p className="text-xs text-text-muted uppercase tracking-wider">{day.subtitle}</p>
              </header>

              {SLOTS.map((slot) => {
                const Icon = slot.icon;
                return (
                  <div key={String(slot.key)} className="space-y-1.5">
                    <Label htmlFor={`${day.key}-${String(slot.key)}`} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
                      {slot.label}
                    </Label>
                    <Input
                      id={`${day.key}-${String(slot.key)}`}
                      value={dd[slot.key] ?? ""}
                      onChange={(e) => updateDay(day.key, { [slot.key]: e.target.value } as Partial<DayData>)}
                      placeholder={slot.placeholder}
                      maxLength={160}
                    />
                  </div>
                );
              })}

              <div className="space-y-1.5">
                <Label htmlFor={`${day.key}-note`}>Lời nhắn riêng (tuỳ chọn)</Label>
                <textarea
                  id={`${day.key}-note`}
                  value={dd.note ?? ""}
                  onChange={(e) => updateDay(day.key, { note: e.target.value })}
                  placeholder="Vd: Cuối tuần nghỉ ngơi nhé anh ♡ Ăn ngon, ngủ kỹ."
                  maxLength={320}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <p className="text-[10px] text-text-muted text-right">{(dd.note ?? "").length}/320</p>
              </div>
            </section>
          );
        })}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/60">
        {status === "saved" && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success">
            <Check className="w-4 h-4" />
            Đã lưu
          </span>
        )}
        <Button onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
}
