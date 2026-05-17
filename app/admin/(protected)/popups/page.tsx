import { readAllCustomizations } from "@/lib/server/customizations";
import { PopupsEditor } from "@/components/admin/popups-editor";

export const dynamic = "force-dynamic";

export default async function PopupsAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Popup gửi anh</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Tạo lời nhắn, thông điệp hoặc bất ngờ — sẽ pop-up khi bạn trai mở app. Có thể đặt &ldquo;chỉ hiện 1 lần&rdquo; hoặc khoảng ngày active.
        </p>
      </header>

      <PopupsEditor initial={data.popups} />
    </div>
  );
}
