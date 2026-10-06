"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  session: Session | null;
  unreadNotifications: number;
}

const navigation = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Jobs", href: "/jobs", icon: BriefcaseBusiness },
  { title: "Applications", href: "/applications", icon: FileText },
  { title: "Saved Jobs", href: "/saved", icon: Bookmark },
  { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Profile", href: "/profile", icon: User },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardSidebar({
  session,
  unreadNotifications,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const name = session?.user?.name?.trim() || "Graduate";
  const email = session?.user?.email || "";

  const initials =
    name
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GR";

  const active = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const logout = () => signOut({ callbackUrl: "/login" });

  return (
    <>
      <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[275px] shrink-0 lg:block">
        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/80 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/80">
          <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 font-black text-white shadow-lg shadow-orange-500/20">
              E
            </div>

            <div>
              <p className="text-[17px] font-bold">Employa</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Graduate platform
              </p>
            </div>
          </Link>

          <nav className="mt-8 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const selected = active(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex min-h-11 items-center gap-3 rounded-2xl px-3.5 text-sm font-medium transition ${
                    selected
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-zinc-400 dark:hover:bg-orange-500/10"
                  }`}
                >
                  <Icon className="size-[18px] shrink-0" />

                  <span className="flex-1">{item.title}</span>

                  {item.title === "Notifications" &&
                  unreadNotifications > 0 ? (
                    <span
                      className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-1 text-[10px] font-black leading-none ${
                        selected
                          ? "bg-white/20 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {unreadNotifications > 99 ? "99+" : unreadNotifications}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`size-3.5 ${
                        selected
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-50"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <Link
              href="/profile"
              className="mb-3 block rounded-2xl border border-orange-100 bg-orange-50/70 p-3 transition hover:bg-orange-50 dark:border-orange-500/10 dark:bg-orange-500/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500 text-xs font-bold text-white">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {email || "Graduate account"}
                  </p>
                </div>

                <ChevronRight className="size-4 text-orange-500" />
              </div>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold text-muted-foreground transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            >
              <LogOut className="size-[18px]" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-[70] flex size-11 items-center justify-center rounded-2xl border border-white/60 bg-white/90 shadow-[0_12px_35px_rgba(15,23,42,0.12)] backdrop-blur-xl active:scale-95 lg:hidden dark:border-white/10 dark:bg-zinc-900/90"
      >
        <Menu className="size-5" />
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px]"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,340px)] flex-col bg-white shadow-2xl dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 font-black text-white">
                  E
                </div>

                <div>
                  <p className="font-bold">Employa</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Graduate platform
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-10 items-center justify-center rounded-xl bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mx-4 mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {email || "Graduate account"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-5 flex-1 overflow-y-auto px-4 pb-4">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Workspace
              </p>

              <div className="space-y-1.5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const selected = active(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold ${
                        selected
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-zinc-300 dark:hover:bg-orange-500/10"
                      }`}
                    >
                      <Icon className="size-[18px]" />
                      <span className="flex-1">{item.title}</span>

                      {item.title === "Notifications" &&
                      unreadNotifications > 0 ? (
                        <span
                          className={`min-w-6 rounded-full px-1.5 py-1 text-center text-[10px] font-black ${
                            selected
                              ? "bg-white/20"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          {unreadNotifications > 99
                            ? "99+"
                            : unreadNotifications}
                        </span>
                      ) : (
                        <ChevronRight className="size-4 opacity-30" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-border/50 p-4">
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="mb-2 flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold hover:bg-orange-50"
              >
                <User className="size-[18px]" />
                My profile
              </Link>

              <button
                type="button"
                onClick={logout}
                className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut className="size-[18px]" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
