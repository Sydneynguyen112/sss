import { PreviewFrame } from "@/components/admin/preview-frame";

export const dynamic = "force-dynamic";

export default function PreviewAdminPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Xem như user</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Preview app như bạn trai sẽ thấy. Mọi override em vừa lưu sẽ phản chiếu ở đây trong vòng 1 phút (cache).
        </p>
      </header>

      <PreviewFrame />
    </div>
  );
}
