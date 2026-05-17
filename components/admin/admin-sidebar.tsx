"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, MessageCircleHeart, Sun, UtensilsCrossed, Eye, LogOut, LayoutDashboard, Quote as QuoteIcon, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/keyword", label: "Từ khoá", icon: Sparkles },
  { href: "/admin/greetings", label: "Lời chúc", icon: Sun },
  { href: "/admin/quote", label: "Châm ngôn + Ảnh", icon: QuoteIcon },
  { href: "/admin/meals", label: "Bữa ăn", icon: UtensilsCrossed },
  { href: "/admin/tennis", label: "Lịch trình Tennis", icon: Trophy },
  { href: "/admin/popups", label: "Popup gửi anh", icon: MessageCircleHeart },
  { href: "/admin/preview", label: "Xem như user", icon: Eye },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="glass rounded-3xl p-4 shadow-soft sticky top-24 h-fit">
      <div className="px-3 pb-4 border-b border-border/60 mb-3">
        <p className="label-eyebrow">Admin</p>
        <p className="text-sm font-semibold truncate mt-1">{email}</p>
      </div>

      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-text-secondary hover:text-text-primary hover:bg-tertiary/40",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-4 w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/10 transition"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.75} />
        Đăng xuất
      </button>
    </aside>
  );
}
