import type { ReactNode } from "react";


import { auth } from "@/auth";
import DashboardShell from "@/components/dashboard/dashboard-shell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();

  return (
    <DashboardShell
      session={session}
    >
      {children}
    </DashboardShell>
  );
}