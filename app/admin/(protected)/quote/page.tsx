import { readAllCustomizations } from "@/lib/server/customizations";
import { QuoteEditor } from "@/components/admin/quote-editor";

export const dynamic = "force-dynamic";

export default async function QuoteAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Châm ngôn + Ảnh</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Mỗi item = 1 cặp <strong>châm ngôn + ảnh nền</strong>. App chọn nguyên cặp, không xáo trộn. Có items → random theo ngày, hoặc em gán cho ngày cụ thể.
        </p>
      </header>

      <QuoteEditor initial={data.quote} />
    </div>
  );
}
