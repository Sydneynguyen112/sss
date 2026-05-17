import { readAllCustomizations } from "@/lib/server/customizations";
import { QuoteEditor } from "@/components/admin/quote-editor";

export const dynamic = "force-dynamic";

export default async function QuoteAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Châm ngôn</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Tự thêm danh sách châm ngôn em yêu. Bật override → app dùng list em đặt, random hằng ngày hoặc cố định 1 câu.
        </p>
      </header>

      <QuoteEditor initial={data.quote} />
    </div>
  );
}
