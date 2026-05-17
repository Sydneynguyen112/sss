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
          Tự thêm danh sách từ khoá (VN + EN + IPA + tagline). App random theo ngày. Em có thể gán cho ngày cụ thể.
        </p>
      </header>

      <KeywordEditor initial={data.keyword} />
    </div>
  );
}
