import { ReactNode } from "react";
import type { Session } from "next-auth";

import { prisma } from "@/lib/prisma";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminShellProps {
  children: ReactNode;
  session: Session;
}

export default async function AdminShell({
  children,
  session,
}: AdminShellProps) {
  const unreadNotifications = await prisma.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

  return (
    <div className="min-h-dvh bg-[#fffaf5] dark:bg-zinc-950">
      <div className="mx-auto flex min-h-dvh max-w-[1900px] gap-3 p-2.5 sm:gap-5 sm:p-4 lg:gap-6 lg:p-6">
        <AdminSidebar
          session={session}
          unreadNotifications={unreadNotifications}
        />

        <main className="min-w-0 flex-1">
          <AdminHeader
            session={session}
            unreadNotifications={unreadNotifications}
          />

          <section className="mt-3 min-h-[calc(100dvh-1.25rem)] rounded-[26px] border border-black/[0.05] bg-white/65 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:mt-5 sm:rounded-[30px] sm:p-5 lg:mt-6 lg:rounded-[32px] lg:p-6 dark:border-white/[0.07] dark:bg-zinc-900/55">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
