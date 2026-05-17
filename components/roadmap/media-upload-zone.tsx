"use client";

import { useRef, useState } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSessions } from "@/lib/hooks/use-sessions";
import { downscaleImage, readVideoAsDataURL } from "@/lib/utils/image-downscale";

export function MediaUploadZone({ goalId, date }: { goalId: string; date: Date }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addMedia } = useSessions();

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        if (f.type.startsWith("image/")) {
          const data = await downscaleImage(f);
          addMedia(goalId, date, { type: "image", data });
        } else if (f.type.startsWith("video/")) {
          const data = await readVideoAsDataURL(f);
          if (!data) {
            setError(`Video "${f.name}" quá lớn (>2MB) — cần file nhỏ hơn.`);
            continue;
          }
          addMedia(goalId, date, { type: "video", data });
        } else {
          setError(`File "${f.name}" không hỗ trợ.`);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi khi tải lên.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-2 min-h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all p-4 text-center",
        dragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/50 hover:bg-tertiary/20",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        hidden
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <UploadCloud className={cn("w-8 h-8", busy ? "text-primary animate-pulse" : "text-text-muted")} strokeWidth={1.5} />
      <div>
        <p className="text-sm font-medium">{busy ? "Đang xử lý..." : "Tải lên ảnh hoặc clip"}</p>
        <p className="text-xs text-text-muted mt-0.5">Kéo thả vào đây hoặc bấm để chọn</p>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-danger mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
