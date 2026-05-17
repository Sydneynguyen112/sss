import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/server/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <AdminSidebar email={admin.email} />
      <section className="min-w-0">{children}</section>
    </div>
  );
}
