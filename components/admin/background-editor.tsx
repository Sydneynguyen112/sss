"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, Image as ImageIcon } from "lucide-react";
import type { BackgroundOverride } from "@/types/customizations";

const PRESETS = [
  { label: "Núi sương sớm", url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=80" },
  { label: "Bãi biển Đà Nẵng", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80" },
  { label: "Đêm thành phố", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80" },
  { label: "Rừng thu", url: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=1920&q=80" },
];

export function BackgroundEditor({ initial }: { initial: BackgroundOverride }) {
  const [data, setData] = useState<BackgroundOverride>({
    enabled: initial.enabled,
    imageUrl: initial.imageUrl ?? "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/background", {
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
          <p className="font-semibold">Bật override background</p>
          <p className="text-xs text-text-muted mt-0.5">
            BẬT → ảnh phủ toàn app. TẮT → gradient mặc định (warm midnight / sky light).
          </p>
        </div>
        <Switch
          checked={data.enabled}
          onCheckedChange={(v) => setData({ ...data, enabled: v })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bg-url">URL ảnh (https)</Label>
        <Input
          id="bg-url"
          type="url"
          value={data.imageUrl ?? ""}
          onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
          placeholder="https://images.unsplash.com/..."
        />
        <p className="text-xs text-text-muted">
          Mẹo: tìm ảnh trên Unsplash.com → bấm Download → copy URL từ thanh address. Ảnh càng ngang (1920×1080+) càng đẹp.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Hoặc chọn preset</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((p) => {
            const active = data.imageUrl === p.url;
            return (
              <button
                key={p.url}
                type="button"
                onClick={() => setData({ ...data, imageUrl: p.url, enabled: true })}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all group ${
                  active ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[10px] font-medium text-white drop-shadow">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {data.imageUrl && (
        <div className="space-y-2">
          <p className="label-eyebrow">Preview</p>
          <div className="relative aspect-[16/8] rounded-xl overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
            <div className="absolute inset-0 grid place-items-center text-white">
              <ImageIcon className="w-10 h-10 opacity-60" strokeWidth={1.25} />
            </div>
          </div>
        </div>
      )}

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
