import { readAllCustomizations } from "@/lib/server/customizations";
import { KeywordEditor } from "@/components/admin/keyword-editor";

export const dynamic = "force-dynamic";

export default async function KeywordAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Từ khoá hôm nay</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Khi <strong>bật override</strong>, bạn trai sẽ thấy từ khoá em đặt thay vì 30 từ mặc định.
          Tắt → quay lại rotation auto.
        </p>
      </header>

      <KeywordEditor initial={data.keyword} />
    </div>
  );
}
