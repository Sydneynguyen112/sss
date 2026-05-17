import Link from "next/link";
import { readAllCustomizations } from "@/lib/server/customizations";
import { Sparkles, Sun, MessageCircleHeart, UtensilsCrossed, Eye, Quote as QuoteIcon } from "lucide-react";
import { isKvConfigured } from "@/lib/server/kv";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const kvReady = isKvConfigured();
  const data = kvReady ? await readAllCustomizations() : null;

  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Tổng quan</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Admin Dashboard</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Mỗi mục: em tự thêm items vào list, app sẽ random theo ngày. Có thể gán item cụ thể cho ngày cụ thể nếu muốn.
        </p>
      </header>

      {!kvReady && (
        <div className="glass rounded-2xl p-5 border-l-4 border-l-warning">
          <p className="font-semibold text-warning">KV chưa cấu hình</p>
          <p className="text-sm text-text-secondary mt-1">
            Cần thêm <code className="bg-tertiary/40 px-1 rounded">KV_REST_API_URL</code> +{" "}
            <code className="bg-tertiary/40 px-1 rounded">KV_REST_API_TOKEN</code> vào env vars trên Vercel.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusCard
          href="/admin/keyword"
          icon={Sparkles}
          title="Từ khoá"
          count={data?.keyword.items.length ?? 0}
          scheduled={Object.keys(data?.keyword.schedule ?? {}).length}
        />
        <StatusCard
          href="/admin/greetings"
          icon={Sun}
          title="Lời chúc"
          count={Object.values(data?.greetings.items ?? {}).reduce((a, arr) => a + arr.length, 0)}
          scheduled={Object.keys(data?.greetings.schedule ?? {}).length}
        />
        <StatusCard
          href="/admin/quote"
          icon={QuoteIcon}
          title="Châm ngôn + Ảnh"
          count={data?.quote.items.length ?? 0}
          scheduled={Object.keys(data?.quote.schedule ?? {}).length}
        />
        <StatusCard
          href="/admin/meals"
          icon={UtensilsCrossed}
          title="Bữa ăn"
          count={Object.values(data?.meals.items ?? {}).reduce((a, arr) => a + arr.length, 0)}
          scheduled={Object.keys(data?.meals.schedule ?? {}).length}
        />
        <StatusCard
          href="/admin/popups"
          icon={MessageCircleHeart}
          title="Popup gửi anh"
          count={data?.popups.length ?? 0}
          scheduled={0}
        />
        <StatusCard
          href="/admin/preview"
          icon={Eye}
          title="Xem như user"
          count={-1}
          scheduled={0}
          caption="Preview live"
        />
      </div>
    </div>
  );
}

function StatusCard({
  href, icon: Icon, title, count, scheduled, caption,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  count: number;
  scheduled: number;
  caption?: string;
}) {
  const status =
    caption ?? (count === 0
      ? "Chưa có items"
      : `${count} items${scheduled > 0 ? ` · ${scheduled} ngày được gán` : ""}`);
  const active = count > 0;
  return (
    <Link
      href={href}
      className="glass rounded-2xl p-5 shadow-soft hover:translate-y-[-2px] transition-transform group block"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </span>
        {count !== -1 && (
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
              active ? "bg-success/15 text-success" : "bg-muted text-text-muted"
            }`}
          >
            {active ? "ACTIVE" : "EMPTY"}
          </span>
        )}
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-text-muted mt-1 line-clamp-2">{status}</p>
    </Link>
  );
}
