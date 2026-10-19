"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BriefcaseBusiness, GraduationCap, FileText } from "lucide-react";

const items = [
  { title: "Home", href: "/admin", icon: Home },
  { title: "Jobs", href: "/admin/jobs", icon: BriefcaseBusiness },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Graduates", href: "/admin/graduates", icon: GraduationCap },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-[90] grid grid-cols-4 rounded-[25px] border border-slate-700/70 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-2xl lg:hidden">
      {items.map(({ title, href, icon: Icon }) => {
        const active = href === "/admin"
          ? pathname === "/admin"
          : pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[19px] px-1 py-2.5 text-[10px] font-semibold transition-colors sm:text-xs ${
              active
                ? "bg-orange-500/20 text-orange-300"
                : "text-slate-400 active:bg-white/5"
            }`}
          >
            <Icon className="size-5" />
            <span className="truncate">{title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
