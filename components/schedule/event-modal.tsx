"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MapPin, Flame, Drumstick, ExternalLink, Target, Heart } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/types";
import { NUTRITION_PROFILE } from "@/data/meals";
import { useCustomizations } from "@/lib/hooks/use-customizations";

export function EventModal({
  event,
  open,
  onOpenChange,
}: {
  event: Event | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [focus, setFocus] = useState(false);
  const custom = useCustomizations();
  if (!event) return null;

  const slot = event.tags?.[0] as "breakfast" | "lunch" | "snack" | "dinner" | undefined;
  const isMeal = event.type === "meal";

  // Meal override moved to Home → admin meals list (custom.meals).
  // EventModal chỉ surface override khi đúng slot này.
  const mealOverride = (() => {
    if (!isMeal || !custom.meals.enabled) return null;
    if (slot !== "breakfast" && slot !== "lunch" && slot !== "dinner") return null;
    const list = custom.meals.items[slot] ?? [];
    if (list.length === 0) return null;
    const dk = event.date;
    const scheduledId = custom.meals.schedule[dk]?.[slot];
    let item = scheduledId ? list.find((i) => i.id === scheduledId) : undefined;
    if (!item) {
      const fixedId = custom.meals.fixedIds?.[slot];
      const start = new Date(dk);
      const dayStart = new Date(start.getFullYear(), 0, 0);
      const dayOfYear = Math.abs(Math.floor((start.getTime() - dayStart.getTime()) / 86_400_000));
      if (custom.meals.mode === "fixed" && fixedId) {
        item = list.find((i) => i.id === fixedId);
      } else {
        item = list[dayOfYear % list.length];
      }
    }
    return item ? { name: item.name, note: item.note ?? "" } : null;
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>
            {event.time} – {event.endTime}
            {event.location && (
              <span className="ml-2 inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {event.location}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {event.description && (
            <p className="text-sm text-text-secondary">{event.description}</p>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          )}

          {mealOverride && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary fill-primary" />
                <p className="font-semibold text-primary">Gợi ý từ em</p>
              </div>
              <p className="text-sm text-text-primary leading-relaxed">{mealOverride.name}</p>
              {mealOverride.note && (
                <p className="text-xs text-text-secondary italic leading-relaxed border-t border-primary/20 pt-2 mt-2">
                  &ldquo;{mealOverride.note}&rdquo;
                </p>
              )}
            </div>
          )}

          {event.mealData && (
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-start gap-2 rounded-lg bg-tertiary/40 p-3 text-xs">
                <Target className="w-4 h-4 mt-0.5 text-primary shrink-0" strokeWidth={1.75} />
                <div className="space-y-0.5">
                  <p className="font-semibold text-text-primary">Profile dinh dưỡng</p>
                  <p className="text-text-secondary">{NUTRITION_PROFILE.label}</p>
                  <p className="text-text-muted">{NUTRITION_PROFILE.dailyTarget} · sáng {NUTRITION_PROFILE.breakfastTarget}</p>
                </div>
              </div>
              <div className="flex items-center justify-around text-center">
                <div>
                  <div className="flex items-center gap-1 justify-center text-warning">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold tabular-nums">{event.mealData.kcal}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted mt-0.5">kcal</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 justify-center text-success">
                    <Drumstick className="w-4 h-4" />
                    <span className="font-bold tabular-nums">{event.mealData.protein}g</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted mt-0.5">protein</p>
                </div>
              </div>
              <div>
                <p className="label-eyebrow mb-2">Nguyên liệu</p>
                <ul className="space-y-1">
                  {event.mealData.ingredients.map((i, idx) => (
                    <li key={idx} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{i.icon ?? "•"}</span>
                        <span>{i.name}</span>
                      </span>
                      <span className="text-text-muted text-xs">{i.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {event.goalId && (
            <Link
              href={`/roadmap?goalId=${event.goalId}`}
              className="flex items-center justify-between p-3 rounded-xl bg-tertiary/40 hover:bg-tertiary text-primary text-sm font-medium transition"
            >
              Mở phiên tập trên Hành Trình
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium">Chế độ tập trung</p>
              <p className="text-xs text-text-muted">Ẩn thông báo trong lúc tham gia</p>
            </div>
            <Switch checked={focus} onCheckedChange={setFocus} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
