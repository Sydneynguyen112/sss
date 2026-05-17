"use client";

import { useState } from "react";
import { ExternalLink, Monitor, Smartphone, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const ROUTES = [
  { path: "/", label: "Trang chủ" },
  { path: "/schedule", label: "Lịch trình" },
  { path: "/goals", label: "Mục tiêu" },
  { path: "/roadmap", label: "Hành trình" },
];

type Device = "desktop" | "mobile";

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "100%",
  mobile: "390px",
};

export function PreviewFrame() {
  const [path, setPath] = useState("/");
  const [device, setDevice] = useState<Device>("desktop");
  const [key, setKey] = useState(0);

  const src = `${path}?previewBy=admin`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="glass rounded-2xl p-3 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-full bg-tertiary/30 p-1">
          {ROUTES.map((r) => (
            <button
              key={r.path}
              type="button"
              onClick={() => setPath(r.path)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition",
                path === r.path
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-full bg-tertiary/30 p-1 ml-auto">
          {(["desktop", "mobile"] as Device[]).map((d) => {
            const Icon = d === "desktop" ? Monitor : Smartphone;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                aria-label={d}
                className={cn(
                  "grid place-items-center w-8 h-7 rounded-full transition",
                  device === d
                    ? "bg-primary text-primary-foreground"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          aria-label="Refresh"
          className="grid place-items-center w-8 h-8 rounded-full bg-tertiary/30 text-text-secondary hover:text-primary transition"
        >
          <RotateCw className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>

        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary/30 text-text-secondary text-xs font-medium hover:text-primary transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Mở tab mới
        </a>
      </div>

      {/* Frame */}
      <div className="rounded-2xl border border-border overflow-hidden bg-tertiary/20 p-2 sm:p-4 grid place-items-center min-h-[60vh]">
        <div
          className="rounded-xl overflow-hidden shadow-soft bg-background mx-auto transition-all"
          style={{
            width: DEVICE_WIDTHS[device],
            maxWidth: "100%",
            height: device === "mobile" ? "780px" : "70vh",
          }}
        >
          <iframe
            key={`${path}-${device}-${key}`}
            src={src}
            title="Preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      </div>

      <p className="text-xs text-text-muted text-center">
        Đăng nhập admin của em không ảnh hưởng tới phần xem app. Frame này hiển thị y như bạn trai sẽ thấy.
      </p>
    </div>
  );
}
