import Link from "next/link";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  FileText,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const sections = [
  {
    title: "Account and access",
    description:
      "Admin routes require an authenticated account with the ADMIN role.",
    icon: LockKeyhole,
    status: "Protected",
  },
  {
    title: "Job review policy",
    description:
      "New listings are reviewed before publication. Review decisions and reasons are retained with the job record.",
    icon: BriefcaseBusiness,
    status: "Manual review",
  },
  {
    title: "Business verification",
    description:
      "Business accounts can be reviewed from Users & Businesses. Verification decisions are managed there.",
    icon: ShieldCheck,
    status: "Admin controlled",
  },
  {
    title: "Application management",
    description:
      "Review applications and update candidate statuses from the applications workspace.",
    icon: FileText,
    status: "Available",
  },
];

const shortcuts = [
  {
    title: "Manage accounts",
    description: "Review graduate and business accounts.",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Review job listings",
    description: "Approve, reject, publish, and manage listings.",
    href: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Applications",
    description: "Review candidate applications and their status.",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    title: "Announcements",
    description: "Send platform announcements to users.",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Reports and analytics",
    description: "View recruitment data and export applications.",
    href: "/admin/reports",
    icon: Activity,
  },
];

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <main className="space-y-6">
      <header>
        <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
          <Settings2 className="h-4 w-4" />
          Administration
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Platform settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Review the current platform controls and navigate to the relevant
          management workspace. No account or recruitment records are changed
          from this page.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {sections.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-xl bg-orange-50 p-3 text-orange-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {item.status}
                </span>
              </div>
              <h2 className="mt-4 font-bold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-950">Management shortcuts</h2>
          <p className="mt-1 text-sm text-slate-500">
            Open the workspace for the task you need to complete.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {shortcuts.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 p-4 transition hover:bg-orange-50/60 sm:p-5"
              >
                <span className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {item.description}
                  </span>
                </span>
                <span className="text-lg text-slate-400" aria-hidden="true">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Configuration note: editable global settings such as maintenance mode,
        email delivery, and registration controls should only be enabled after
        persistent storage and their enforcement across the application have
        been implemented. This page does not pretend those controls are active.
      </p>
    </main>
  );
}
