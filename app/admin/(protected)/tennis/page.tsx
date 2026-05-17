import { readAllCustomizations } from "@/lib/server/customizations";
import { TennisEditor } from "@/components/admin/tennis-editor";

export const dynamic = "force-dynamic";

export default async function TennisAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Lịch trình Tennis</h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Roadmap 8 tuần từ <strong>18/05</strong> → <strong>15/07/2026</strong> (giải đấu). Mỗi ngày 30–60 phút, tập tại nhà. Em có thể tuỳ chỉnh từng buổi.
        </p>
      </header>

      <TennisEditor initial={data.tennis} />
    </div>
  );
}
