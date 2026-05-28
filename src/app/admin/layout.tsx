import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { HighwayBackground } from "@/components/highway/highway-background";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return (
      <div className="admin-bg min-h-screen relative isolate overflow-x-hidden">
        <HighwayBackground variant="admin" />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className="admin-bg flex min-h-screen relative isolate overflow-x-hidden">
      <HighwayBackground variant="admin" />
      <AdminSidebar role={session.role} />
      <div className="flex-1 flex flex-col min-h-screen pb-16 lg:pb-0 relative z-10">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <AdminMobileNav />
    </div>
  );
}
