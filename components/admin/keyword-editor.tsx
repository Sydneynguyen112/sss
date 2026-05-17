"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { KeywordOverride } from "@/types/customizations";
import { Check } from "lucide-react";

export function KeywordEditor({ initial }: { initial: KeywordOverride }) {
  const [data, setData] = useState<KeywordOverride>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/keyword", {
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
            Khi BẬT → bạn trai sẽ thấy từ khoá em đặt. TẮT → 30 từ mặc định tự rotate.
          </p>
        </div>
        <Switch
          checked={data.enabled}
          onCheckedChange={(v) => setData({ ...data, enabled: v })}
        />
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="kw-word">Từ khoá tiếng Việt</Label>
            <Input
              id="kw-word"
              value={data.word}
              onChange={(e) => setData({ ...data, word: e.target.value })}
              placeholder="Ví dụ: Kiến tạo"
              maxLength={60}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kw-en">Tương đương tiếng Anh</Label>
            <Input
              id="kw-en"
              value={data.wordEn}
              onChange={(e) => setData({ ...data, wordEn: e.target.value })}
              placeholder="Ví dụ: Create"
              maxLength={60}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="kw-tagline">Tagline ngắn</Label>
          <textarea
            id="kw-tagline"
            value={data.tagline}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
            placeholder="Một câu ngắn, gợi mở cho ngày hôm nay."
            maxLength={280}
            rows={3}
            className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <p className="text-xs text-text-muted text-right">{data.tagline.length}/280</p>
        </div>
      </div>

      {data.enabled && data.word && (
        <PreviewCard word={data.word} wordEn={data.wordEn} tagline={data.tagline} />
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

function PreviewCard({ word, wordEn, tagline }: { word: string; wordEn: string; tagline: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-primary/30 p-5">
      <p className="label-eyebrow mb-3">Preview (bạn trai sẽ thấy thế này)</p>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-semibold gradient-text leading-none">{word}</span>
        {wordEn && (
          <span className="text-sm text-text-muted font-light tracking-[0.04em] uppercase">
            / {wordEn}
          </span>
        )}
      </div>
      {tagline && (
        <p className="mt-3 text-sm text-text-secondary font-light leading-relaxed max-w-md">
          {tagline}
        </p>
      )}
    </div>
  );
}
