"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { GreetingOverride } from "@/types/customizations";
import { Check } from "lucide-react";

const SLOTS: { key: keyof Omit<GreetingOverride, "enabled">; label: string; range: string; defaultText: string }[] = [
  { key: "morning", label: "Buổi sáng", range: "5h – 11h", defaultText: "Chào buổi sáng, {name}!" },
  { key: "noon",    label: "Buổi trưa", range: "11h – 17h", defaultText: "Buổi trưa yên bình, {name}!" },
  { key: "evening", label: "Hoàng hôn", range: "17h – 22h", defaultText: "Hoàng hôn về, {name}!" },
  { key: "night",   label: "Đêm khuya", range: "22h – 5h", defaultText: "Đêm muộn rồi, {name}!" },
];

export function GreetingsEditor({ initial }: { initial: GreetingOverride }) {
  const [data, setData] = useState<GreetingOverride>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/greetings", {
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
          <p className="font-semibold">Bật override</p>
          <p className="text-xs text-text-muted mt-0.5">
            Có thể bỏ trống một slot → slot đó dùng mặc định.
          </p>
        </div>
        <Switch
          checked={data.enabled}
          onCheckedChange={(v) => setData({ ...data, enabled: v })}
        />
      </div>

      <div className="space-y-4">
        {SLOTS.map((slot) => (
          <div key={slot.key} className="rounded-xl border border-border/60 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`g-${slot.key}`} className="font-semibold">
                {slot.label} <span className="text-xs text-text-muted font-normal">· {slot.range}</span>
              </Label>
            </div>
            <Input
              id={`g-${slot.key}`}
              value={data[slot.key]}
              onChange={(e) => setData({ ...data, [slot.key]: e.target.value })}
              placeholder={slot.defaultText}
              maxLength={160}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted">
        Mẹo: dùng <code className="bg-tertiary/40 px-1 rounded">{"{name}"}</code> trong câu để app tự chèn tên — vd <em>&ldquo;Chào sáng, {"{name}"}! Hôm nay rạng rỡ nhé.&rdquo;</em>
      </p>

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
