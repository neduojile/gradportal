"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Session } from "next-auth";
import {
  Bell,
  Search,
  Sparkles,
} from "lucide-react";

import DashboardUserMenu from "./dashboard-user-menu";

interface DashboardHeaderProps {
  session: Session | null;
  unreadNotifications: number;
}

export default function DashboardHeader({
  session,
  unreadNotifications,
}: DashboardHeaderProps) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  const name = session?.user?.name?.trim() || "there";

  return (
    <header className="relative mb-3 overflow-hidden rounded-[24px] border border-orange-100 bg-white/80 shadow-[0_16px_50px_rgba(249,115,22,0.07)] backdrop-blur-2xl sm:mb-5 sm:rounded-[28px] lg:mb-6 lg:rounded-[32px] dark:border-white/10 dark:bg-zinc-900/75">
      <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 size-72 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative flex min-h-[150px] flex-col justify-between gap-5 p-4 sm:min-h-[175px] sm:p-6 lg:min-h-[205px] lg:flex-row lg:items-center lg:p-8">
        <div className="min-w-0 pl-12 lg:pl-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/20 sm:size-9">
              <Sparkles className="size-4 sm:size-5" />
            </div>

            <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-600 sm:px-3 sm:text-xs">
              Employa Dashboard
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl text-[25px] font-bold leading-tight tracking-[-0.03em] text-slate-950 sm:text-3xl lg:text-4xl dark:text-white">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {name}
            </span>
          </h1>

          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            {today}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <div className="hidden items-center gap-2 rounded-2xl border border-black/5 bg-white/70 px-3 py-2.5 shadow-sm lg:flex dark:border-white/10 dark:bg-zinc-900/60">
            <Search className="size-4 text-orange-500" />
            <input
              type="search"
              placeholder="Search jobs..."
              className="w-36 bg-transparent text-sm outline-none placeholder:text-muted-foreground xl:w-48"
            />
          </div>

          <Link
            href="/notifications"
            aria-label={
              unreadNotifications > 0
                ? `${unreadNotifications} unread notifications`
                : "Notifications"
            }
            className="group relative flex size-11 items-center justify-center rounded-2xl border border-black/5 bg-white/80 shadow-sm active:scale-95 dark:border-white/10 dark:bg-zinc-900/70"
          >
            <Bell className="size-[18px]" />

            {unreadNotifications > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-[21px] items-center justify-center rounded-full bg-orange-500 px-1.5 py-1 text-[10px] font-black leading-none text-white shadow-lg shadow-orange-500/30">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            ) : null}
          </Link>

          <DashboardUserMenu session={session} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
    </header>
  );
}

