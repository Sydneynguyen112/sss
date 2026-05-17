"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Play } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { downscaleImage } from "@/lib/utils/image-downscale";
import type { SessionMedia } from "@/types";
import { cn } from "@/lib/utils";

const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB — phải khớp /api/upload

export function InlineMediaUpload({
  photos,
  onAdd,
  onRemove,
  acceptVideo = true,
  label = "Gửi hình ảnh",
  compact = false,
  uploadPrefix = "media",
}: {
  photos: SessionMedia[];
  onAdd: (media: Omit<SessionMedia, "id" | "createdAt">) => void;
  onRemove?: (id: string) => void;
  acceptVideo?: boolean;
  label?: string;
  compact?: boolean;
  uploadPrefix?: string; // "tennis" | "meal-breakfast" | ... — folder trên Blob
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<SessionMedia | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        if (f.type.startsWith("image/")) {
          const data = await downscaleImage(f);
          onAdd({ type: "image", data });
        } else if (acceptVideo && f.type.startsWith("video/")) {
          if (f.size > MAX_VIDEO_BYTES) {
            setError(`Video quá lớn (>${MAX_VIDEO_BYTES / 1024 / 1024}MB).`);
            continue;
          }
          const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const pathname = `${uploadPrefix}/${Date.now()}-${safeName}`;
          const blob = await upload(pathname, f, {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: f.type,
          });
          onAdd({ type: "video", data: blob.url });
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi khi tải lên");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-tertiary/30 text-xs font-medium text-text-secondary transition py-2",
          compact && "py-1.5 text-[11px]",
          busy && "opacity-60 animate-pulse",
        )}
      >
        <UploadCloud className="w-3.5 h-3.5" strokeWidth={1.75} />
        {busy ? "Đang xử lý..." : label}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
        hidden
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {error && <p className="text-[10px] text-danger">{error}</p>}

      {photos.length > 0 && (
        <div className={cn("grid gap-1.5", compact ? "grid-cols-3" : "grid-cols-4")}>
          {photos.map((m) => (
            <div
              key={m.id}
              className="relative aspect-square rounded-md overflow-hidden bg-tertiary/30 group cursor-pointer"
              onClick={() => setPreview(m)}
            >
              {m.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.data} alt="" className="w-full h-full object-cover" />
              ) : (
                <>
                  <video src={m.data} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 grid place-items-center bg-black/30">
                    <Play className="w-3.5 h-3.5 text-white" fill="currentColor" />
                  </div>
                </>
              )}
              {onRemove && (
                <button
                  type="button"
                  aria-label="Xoá"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(m.id);
                  }}
                  className="absolute top-0.5 right-0.5 grid place-items-center w-5 h-5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">Xem trước</DialogTitle>
          {preview?.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.data} alt="" className="w-full h-auto max-h-[85vh] object-contain rounded-md" />
          ) : preview?.type === "video" ? (
            <video src={preview.data} controls autoPlay className="w-full max-h-[85vh] rounded-md" />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
