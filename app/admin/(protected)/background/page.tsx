import { readAllCustomizations } from "@/lib/server/customizations";
import { BackgroundEditor } from "@/components/admin/background-editor";

export const dynamic = "force-dynamic";

export default async function BackgroundAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Background ảnh</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Paste URL ảnh từ Unsplash, Pinterest, hoặc ảnh em up Google Drive (set link public). Bật override → ảnh sẽ phủ toàn trang thay cho gradient mặc định.
        </p>
      </header>

      <BackgroundEditor initial={data.background} />
    </div>
  );
}
