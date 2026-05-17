import { readAllCustomizations } from "@/lib/server/customizations";
import { WeekendMealsEditor } from "@/components/admin/weekend-meals-editor";

export const dynamic = "force-dynamic";

export default async function WeekendMealsAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Bữa ăn cuối tuần</h1>
        <p className="text-text-secondary mt-2 max-w-xl">
          Gợi ý thực đơn riêng cho Thứ 7 và Chủ Nhật. Khi bật, các bữa ăn cuối tuần trên Lịch trình của anh sẽ hiện thêm gợi ý từ em.
        </p>
      </header>

      <WeekendMealsEditor initial={data.weekendMeals} />
    </div>
  );
}
