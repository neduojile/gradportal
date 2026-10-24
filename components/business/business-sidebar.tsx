"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Bell,
  LayoutDashboard,
  Building2,
  BriefcaseBusiness,
  Users,
  MessageCircle,
  CalendarDays,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Overview", href: "/business", icon: LayoutDashboard },
  { label: "Company profile", href: "/business/profile", icon: Building2 },
  { label: "Job postings", href: "/business/jobs", icon: BriefcaseBusiness },
  { label: "Applicants", href: "/business/jobs", icon: Users },
  { label: "Messages", href: "/business/messages", icon: MessageCircle },
  { label: "Notifications", href: "/business/notifications", icon: Bell },
  { label: "Interviews", href: "/business/interviews", icon: CalendarDays },
  { label: "Reviews", href: "/business/reviews", icon: Star },
  { label: "Settings", href: "/business/settings", icon: Settings },
];

type BusinessSidebarProps = {
  name: string;
  email: string;
};

export default function BusinessSidebar({ name, email }: BusinessSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "BU";

  function isActive(href: string) {
    if (href === "/business") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function sidebarContent(mobile = false) {
    return (
      <div className="flex h-full flex-col">
        <Link
          href="/business"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-4"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-black text-white shadow-lg shadow-orange-500/20">
            E
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight text-slate-950">
              Employa
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Business workspace
            </span>
          </span>
        </Link>

        <div className="mx-2 mt-5 rounded-2xl border border-orange-100 bg-orange-50/80 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-700">
            Recruiter account
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {name}
          </p>
          <p className="truncate text-xs text-slate-500">{email}</p>
        </div>

        <nav className="mt-6 flex-1 space-y-1.5 overflow-y-auto px-2 pb-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                  active
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  className={`size-4 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-2">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-[18px]" />
            Sign out
          </button>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="hidden"
            aria-hidden="true"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-[270px] shrink-0 rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:block">
        {sidebarContent()}
      </aside>

      <button
        type="button"
        aria-label="Open business navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-40 flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/40"
          />
          <aside className="absolute inset-y-0 left-0 w-[min(86vw,320px)] bg-white p-3 shadow-2xl">
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="Close business navigation"
                onClick={() => setMobileOpen(false)}
                className="flex size-10 items-center justify-center rounded-xl hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}



