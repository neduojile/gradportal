"use client";

import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

import DashboardHeader from "./dashboard-header";

export default function DashboardHeaderGate({
  session,
  unreadNotifications,
}: {
  session: Session | null;
  unreadNotifications: number;
}) {
  const pathname = usePathname();

  if (pathname !== "/dashboard") {
    return null;
  }

  return (
    <DashboardHeader
      session={session}
      unreadNotifications={unreadNotifications}
    />
  );
}
