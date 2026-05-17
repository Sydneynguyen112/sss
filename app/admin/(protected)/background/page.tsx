import { readAllCustomizations } from "@/lib/server/customizations";
import { BackgroundEditor } from "@/components/admin/background-editor";

export const dynamic = "force-dynamic";

export default async function BackgroundAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Ảnh thẻ châm ngôn</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Đổi ảnh nền cho thẻ &ldquo;Quote of the day&rdquo; trên trang chủ — chỗ hiển thị câu châm ngôn hằng ngày. Paste URL ảnh từ Unsplash, Pinterest, hoặc Google Drive (link public).
        </p>
      </header>

      <BackgroundEditor initial={data.background} />
    </div>
  );
}
