import { readAllCustomizations } from "@/lib/server/customizations";
import { MealsEditor } from "@/components/admin/meals-editor";

export const dynamic = "force-dynamic";

export default async function MealsAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Bữa ăn</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Tự thêm món cho bữa sáng / trưa / tối. Bật override → app dùng list em đặt, random hằng ngày hoặc cố định 1 món.
        </p>
      </header>

      <MealsEditor initial={data.meals} />
    </div>
  );
}
