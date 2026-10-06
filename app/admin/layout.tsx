import { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return <AdminShell session={session}>{children}</AdminShell>;
}
