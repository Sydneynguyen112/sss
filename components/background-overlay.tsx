"use client";

import { useCustomizations } from "@/lib/hooks/use-customizations";
import { usePathname } from "next/navigation";

export function BackgroundOverlay() {
  const custom = useCustomizations();
  const pathname = usePathname();

  // Không apply ở /admin (admin cần thấy giao diện gốc để chỉnh)
  if (pathname.startsWith("/admin")) return null;
  if (!custom.background.enabled || !custom.background.imageUrl) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url("${custom.background.imageUrl}")` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </div>
  );
}
