import { readAllCustomizations } from "@/lib/server/customizations";
import { OnboardingEditor } from "@/components/admin/onboarding-editor";

export const dynamic = "force-dynamic";

export default async function OnboardingAdminPage() {
  const data = await readAllCustomizations();
  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Customization</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Onboarding</h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Lời chào hiển thị lần đầu trước khi anh đăng nhập. Mỗi message là 1 slide. Anh bấm &ldquo;Tiếp&rdquo; để qua slide kế. Hết slide → popup đăng nhập.
        </p>
      </header>

      <OnboardingEditor initial={data.onboarding} />
    </div>
  );
}
