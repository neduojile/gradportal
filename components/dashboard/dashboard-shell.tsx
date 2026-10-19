import { ReactNode } from "react";
import type { Session } from "next-auth";

import { prisma } from "@/lib/prisma";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import GraduateBottomNav from "./GraduateBottomNav";

interface DashboardShellProps {
  children: ReactNode;
  session: Session | null;
}

export default async function DashboardShell({
  children,
  session,
}: DashboardShellProps) {
  const unreadNotifications = session?.user?.id
    ? await prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      })
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-100/40 dark:from-zinc-950 dark:via-background dark:to-zinc-900">
      <div className="mx-auto flex max-w-[1800px] gap-3 px-3 pb-24 pt-3 sm:gap-6 sm:p-6 sm:pb-24 lg:pb-6">
        <DashboardSidebar
          session={session}
          unreadNotifications={unreadNotifications}
        />

        <main className="flex min-h-[calc(100vh-3rem)] flex-1 flex-col">
          <DashboardHeader
            session={session}
            unreadNotifications={unreadNotifications}
          />

          <section className="mt-6 flex-1 rounded-3xl border border-white/10 bg-white/40 p-6 shadow-xl backdrop-blur-xl dark:bg-zinc-900/40">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}

