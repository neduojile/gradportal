import { ReactNode } from "react";
import { requireGraduate } from "@/lib/graduate";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default async function JobsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireGraduate();

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
