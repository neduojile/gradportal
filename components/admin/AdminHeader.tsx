"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import {
  Bell,
  Search,
  ShieldCheck,
} from "lucide-react";

interface AdminHeaderProps {
  session: Session;
  unreadNotifications: number;
}

export default function AdminHeader({
  session,
  unreadNotifications,
}: AdminHeaderProps) {
  const name = session.user.name?.trim() || "System Admin";

  const initials =
    name
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SA";

  return (
    <header className="relative overflow-hidden rounded-[24px] border border-orange-100 bg-white/80 shadow-[0_16px_50px_rgba(249,115,22,0.07)] backdrop-blur-2xl sm:rounded-[28px] lg:rounded-[32px] dark:border-white/10 dark:bg-zinc-900/75">
      <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 size-72 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative flex min-h-[145px] flex-col justify-between gap-5 p-4 pl-16 sm:min-h-[165px] sm:p-6 sm:pl-20 lg:min-h-[180px] lg:flex-row lg:items-center lg:p-7">
        {/* Heading */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
              <ShieldCheck className="size-4" />
            </div>

            <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-600 sm:px-3 sm:text-xs">
              Employa Admin
            </span>
          </div>

          <h1 className="mt-4 text-[26px] font-bold leading-tight tracking-[-0.03em] text-slate-950 sm:text-3xl lg:text-4xl dark:text-white">
            Good afternoon,{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {name}
            </span>
          </h1>

          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Manage jobs, graduates, applications and platform activity.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <div className="hidden items-center gap-2 rounded-2xl border border-black/5 bg-white/70 px-3 py-2.5 shadow-sm lg:flex dark:border-white/10 dark:bg-zinc-900/60">
            <Search className="size-4 text-orange-500" />

            <input
              type="search"
              placeholder="Search platform..."
              className="w-36 bg-transparent text-sm outline-none placeholder:text-muted-foreground xl:w-48"
            />
          </div>

          <Link
            href="/admin/notifications"
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
                {unreadNotifications > 99
                  ? "99+"
                  : unreadNotifications}
              </span>
            ) : null}
          </Link>

          <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white/70 px-2 py-2 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
            <div className="flex size-8 items-center justify-center rounded-xl bg-slate-950 text-[10px] font-bold text-white dark:bg-white dark:text-slate-950">
              {initials}
            </div>

            <div className="hidden pr-2 sm:block">
              <p className="max-w-28 truncate text-xs font-bold">
                {name}
              </p>

              <p className="text-[10px] font-medium text-orange-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
    </header>
  );
}

