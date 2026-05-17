"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSessions } from "@/lib/hooks/use-sessions";
import type { SessionMedia } from "@/types";

export function MediaThumbnailGrid({
  goalId,
  date,
  items,
}: {
  goalId: string;
  date: Date;
  items: SessionMedia[];
}) {
  const [previewing, setPreviewing] = useState<SessionMedia | null>(null);
  const { removeMedia } = useSessions();

  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {items.map((m) => (
          <div
            key={m.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-tertiary/40 group cursor-pointer"
            onClick={() => setPreviewing(m)}
          >
            {m.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.data} alt="" className="w-full h-full object-cover" />
            ) : (
              <>
                <video src={m.data} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 grid place-items-center bg-black/30">
                  <Play className="w-6 h-6 text-white drop-shadow" fill="currentColor" />
                </div>
              </>
            )}
            <button
              type="button"
              aria-label="Xoá"
              onClick={(e) => {
                e.stopPropagation();
                removeMedia(goalId, date, m.id);
              }}
              className="absolute top-1 right-1 grid place-items-center w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={!!previewing} onOpenChange={(v) => !v && setPreviewing(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">Xem trước</DialogTitle>
          {previewing?.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewing.data} alt="" className="w-full h-auto max-h-[85vh] object-contain rounded-md" />
          ) : previewing?.type === "video" ? (
            <video src={previewing.data} controls autoPlay className="w-full max-h-[85vh] rounded-md" />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
