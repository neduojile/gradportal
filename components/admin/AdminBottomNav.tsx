"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BriefcaseBusiness,
  FileText,
  Users,
} from "lucide-react";

const items = [
  { title: "Home", href: "/admin", icon: Home },
  { title: "Jobs", href: "/admin/jobs", icon: BriefcaseBusiness },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Users },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition ${
                active
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
