import { readAllCustomizations } from "@/lib/server/customizations";
import { GreetingsEditor } from "@/components/admin/greetings-editor";

export const dynamic = "force-dynamic";

export default async function GreetingsAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Lời chúc theo giờ</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Mỗi khung giờ, bạn trai sẽ thấy một lời chúc. Em có thể đặt riêng — dùng <code className="text-xs bg-tertiary/40 px-1 rounded">{"{name}"}</code> để chèn tên của ảnh.
        </p>
      </header>

      <GreetingsEditor initial={data.greetings} />
    </div>
  );
}
