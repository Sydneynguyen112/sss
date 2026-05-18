"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2, Smile } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

// emoji-picker-react là client-only + nặng (~300KB) — lazy load để admin route đỡ phình
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export function OnboardingMessageRow({
  idx,
  total,
  text,
  onChange,
  onMove,
  onRemove,
}: {
  idx: number;
  total: number;
  text: string;
  onChange: (text: string) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { settings } = useTheme();
  const isDark =
    settings.autoTheme === false
      ? settings.manualTheme === "dark"
      : typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (!pickerOpen) return;
    const close = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [pickerOpen]);

  const insertEmoji = (emoji: string) => {
    const ta = taRef.current;
    if (!ta) {
      onChange(text + emoji);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = text.slice(0, start) + emoji + text.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + emoji.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  return (
    <li className="glass rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-text-muted">
          Slide {idx + 1}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled={idx === 0} onClick={() => onMove(-1)}>
            <ArrowUp className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" disabled={idx === total - 1} onClick={() => onMove(1)}>
            <ArrowDown className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="w-3.5 h-3.5 text-danger" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Vd: Chào anh, em rất vui khi anh ghé thăm trang này. Mỗi ngày em sẽ gửi anh vài điều nhỏ ♡"
          rows={4}
          maxLength={800}
          className="w-full rounded-md border border-border bg-background p-3 pr-10 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="absolute top-2 right-2 grid place-items-center w-7 h-7 rounded-md text-text-muted hover:text-primary hover:bg-tertiary/40 transition"
          aria-label="Chèn emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        {pickerOpen && (
          <div
            ref={pickerRef}
            className="absolute top-10 right-0 z-20 shadow-xl rounded-lg overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={(d) => insertEmoji(d.emoji)}
              theme={(isDark ? "dark" : "light") as never}
              width={320}
              height={380}
              searchPlaceholder="Tìm emoji..."
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>

      <p className="text-[10px] text-text-muted text-right tabular-nums">
        {text.length}/800
      </p>
    </li>
  );
}
