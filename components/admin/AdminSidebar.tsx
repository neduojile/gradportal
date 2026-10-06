"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  session: Session;
  unreadNotifications: number;
}

const navigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Jobs",
    href: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    title: "Graduates",
    href: "/admin/graduates",
    icon: GraduationCap,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  session,
  unreadNotifications,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const name = session.user.name?.trim() || "System Admin";
  const email = session.user.email || "admin@employa.com";

  const initials =
    name
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SA";

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const logout = async () => {
    await signOut({ redirect: false });
    window.location.assign("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[275px] shrink-0 lg:block">
        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/85 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/85">
          {/* Brand */}
          <Link
            href="/admin"
            className="flex items-center gap-3 px-2 py-2"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-lg font-black text-white shadow-[0_10px_30px_rgba(249,115,22,0.25)]">
              E
            </div>

            <div className="min-w-0">
              <p className="text-[17px] font-bold tracking-tight">
                Employa
              </p>

              <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-orange-500">
                Admin Console
              </p>
            </div>
          </Link>

          {/* Admin badge */}
          <div className="mt-7 flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50/70 px-3 py-2.5 dark:border-orange-500/10 dark:bg-orange-500/5">
            <ShieldCheck className="size-4 text-orange-500" />

            <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
              Platform Administration
            </span>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex min-h-11 items-center gap-3 rounded-2xl px-3.5 text-sm font-medium ${
                    active
                      ? "bg-orange-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.22)]"
                      : "text-slate-600 dark:text-zinc-400 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                  }`}
                >
                  <Icon className="size-[18px] shrink-0" />

                  <span className="flex-1">{item.title}</span>

                  {item.title === "Notifications" &&
                  unreadNotifications > 0 ? (
                    <span
                      className={`min-w-5 rounded-full px-1.5 py-1 text-center text-[10px] font-black leading-none ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {unreadNotifications > 99
                        ? "99+"
                        : unreadNotifications}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`size-3.5 ${
                        active
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Admin account */}
          <div className="mb-3 rounded-2xl border border-orange-100 bg-orange-50/60 p-3 dark:border-orange-500/10 dark:bg-orange-500/5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {name}
                </p>

                <p className="truncate text-[11px] text-muted-foreground">
                  {email}
                </p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold text-muted-foreground dark:hover:bg-red-500/10"
          >
            <LogOut className="size-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        aria-label="Open admin navigation"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-[70] flex size-11 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-slate-900 shadow-[0_12px_35px_rgba(15,23,42,0.14)] backdrop-blur-xl active:scale-95 lg:hidden dark:border-white/10 dark:bg-zinc-900/90 dark:text-white"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close admin navigation"
            onClick={closeMobile}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[4px]"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,350px)] flex-col overflow-hidden border-r border-white/20 bg-white shadow-[20px_0_80px_rgba(15,23,42,0.2)] dark:bg-zinc-950">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-5">
              <Link
                href="/admin"
                onClick={closeMobile}
                className="flex items-center gap-3"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 font-black text-white shadow-lg shadow-orange-500/20">
                  E
                </div>

                <div>
                  <p className="font-bold">Employa</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500">
                    Admin Console
                  </p>
                </div>
              </Link>

              <button
                type="button"
                aria-label="Close admin navigation"
                onClick={closeMobile}
                className="flex size-10 items-center justify-center rounded-xl bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Admin identity */}
            <div className="mx-4 mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {email}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-orange-500">
                    Administrator
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 overflow-y-auto px-4 pb-4">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Workspace
              </p>

              <div className="space-y-1.5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className={`flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold ${
                        active
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          : "text-slate-600 dark:text-zinc-300 dark:hover:bg-orange-500/10"
                      }`}
                    >
                      <Icon className="size-[18px]" />

                      <span className="flex-1">{item.title}</span>

                      {item.title === "Notifications" &&
                      unreadNotifications > 0 ? (
                        <span
                          className={`min-w-6 rounded-full px-1.5 py-1 text-center text-[10px] font-black ${
                            active
                              ? "bg-white/20 text-white"
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

            {/* Bottom actions */}
            <div className="border-t border-border/50 p-4">
              <button
                type="button"
                onClick={logout}
                className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold text-red-500 dark:hover:bg-red-500/10"
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


