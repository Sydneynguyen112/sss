import Link from "next/link";
import { readAllCustomizations } from "@/lib/server/customizations";
import { Sparkles, Sun, MessageCircleHeart, Image as ImageIcon, UtensilsCrossed, Eye, Quote as QuoteIcon } from "lucide-react";
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
          Chỉnh nội dung bạn trai sẽ thấy: từ khoá hôm nay, lời chúc theo giờ, và popup message gửi anh.
        </p>
      </header>

      {!kvReady && (
        <div className="glass rounded-2xl p-5 border-l-4 border-l-warning">
          <p className="font-semibold text-warning">KV chưa cấu hình</p>
          <p className="text-sm text-text-secondary mt-1">
            Cần thêm <code className="bg-tertiary/40 px-1 rounded">KV_REST_API_URL</code> +{" "}
            <code className="bg-tertiary/40 px-1 rounded">KV_REST_API_TOKEN</code> vào env vars trên Vercel.
            Xem hướng dẫn trong README.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusCard
          href="/admin/keyword"
          icon={Sparkles}
          title="Từ khoá"
          status={data?.keyword.enabled ? `${data.keyword.items.length} từ · ${data.keyword.mode === "fixed" ? "cố định" : "random"}` : "Đang dùng mặc định"}
          active={!!data?.keyword.enabled}
        />
        <StatusCard
          href="/admin/greetings"
          icon={Sun}
          title="Lời chúc"
          status={data?.greetings.enabled ? `${Object.values(data.greetings.items).reduce((a, arr) => a + arr.length, 0)} câu · ${data.greetings.mode === "fixed" ? "cố định" : "random"}` : "Đang dùng mặc định"}
          active={!!data?.greetings.enabled}
        />
        <StatusCard
          href="/admin/quote"
          icon={QuoteIcon}
          title="Châm ngôn"
          status={data?.quote.enabled ? `${data.quote.items.length} câu · ${data.quote.mode === "fixed" ? "cố định" : "random"}` : "Đang dùng mặc định"}
          active={!!data?.quote.enabled}
        />
        <StatusCard
          href="/admin/background"
          icon={ImageIcon}
          title="Ảnh thẻ Quote"
          status={data?.background.enabled ? `${data.background.items.length} ảnh · ${data.background.mode === "fixed" ? "cố định" : "random"}` : "Đang dùng núi mặc định"}
          active={!!data?.background.enabled}
        />
        <StatusCard
          href="/admin/meals"
          icon={UtensilsCrossed}
          title="Bữa ăn"
          status={data?.meals.enabled ? `${Object.values(data.meals.items).reduce((a, arr) => a + arr.length, 0)} món` : "Đang dùng menu mặc định"}
          active={!!data?.meals.enabled}
        />
        <StatusCard
          href="/admin/popups"
          icon={MessageCircleHeart}
          title="Popup message"
          status={(data?.popups.length ?? 0) > 0 ? `${data?.popups.length} message đang hoạt động` : "Chưa có popup"}
          active={(data?.popups.length ?? 0) > 0}
        />
        <StatusCard
          href="/admin/preview"
          icon={Eye}
          title="Xem như user"
          status="Mở preview iframe"
          active={false}
        />
      </div>
    </div>
  );
}

function StatusCard({
  href, icon: Icon, title, status, active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  status: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="glass rounded-2xl p-5 shadow-soft hover:translate-y-[-2px] transition-transform group block"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </span>
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
            active ? "bg-success/15 text-success" : "bg-muted text-text-muted"
          }`}
        >
          {active ? "ON" : "OFF"}
        </span>
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-text-muted mt-1 line-clamp-2">{status}</p>
    </Link>
  );
}
