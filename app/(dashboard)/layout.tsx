import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import DashboardShell from "@/components/dashboard/dashboard-shell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  if (session.user.role === "BUSINESS_OWNER") {
    redirect("/business");
  }

  return (
    <DashboardShell session={session}>
      {children}
    </DashboardShell>
  );
}
