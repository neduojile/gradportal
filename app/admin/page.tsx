import Link from "next/link";
import {
  Activity, ArrowRight, BriefcaseBusiness, Building2,
  FileText, GraduationCap, ShieldCheck, Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const [
    jobs, openJobs, applications, graduates, businesses,
    pendingJobs, pendingBusinesses, recentApplications,
  ] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.application.count(),
    prisma.user.count({ where: { role: "GRADUATE" } }),
    prisma.user.count({ where: { role: "BUSINESS_OWNER" } }),
    prisma.job.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.businessProfile.count({ where: { verificationStatus: "PENDING" } }),
    prisma.application.findMany({
      take: 6,
      orderBy: { appliedAt: "desc" },
      include: {
        applicant: { select: { name: true, email: true } },
        job: { select: { title: true, company: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total jobs", value: jobs, icon: BriefcaseBusiness },
    { label: "Applications", value: applications, icon: FileText },
    { label: "Graduates", value: graduates, icon: GraduationCap },
    { label: "Businesses", value: businesses, icon: Building2 },
  ];

  return (
    <main className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold text-orange-400">EMPLOYA · PLATFORM CONTROL</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Platform Overview</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Monitor recruitment activity, manage accounts, and review items that need attention.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/jobs" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-400">
              Manage listings <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/users" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Manage accounts <Users className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                <span className="rounded-xl bg-orange-50 p-2.5 text-orange-600"><Icon className="h-5 w-5" /></span>
              </div>
              <p className="mt-5 text-3xl font-black tracking-tight text-slate-950">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Open listings", value: openJobs, href: "/admin/jobs", icon: BriefcaseBusiness },
          { label: "Jobs awaiting approval", value: pendingJobs, href: "/admin/jobs", icon: ShieldCheck },
          { label: "Businesses awaiting verification", value: pendingBusinesses, href: "/admin/users", icon: Building2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-orange-500" />
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-500" />
              </div>
              <p className="mt-4 text-2xl font-black text-slate-950">{item.value}</p>
              <p className="mt-1 text-sm text-slate-500">{item.label}</p>
            </Link>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-950">Recent applications</h2>
            <p className="mt-1 text-xs text-slate-500">Latest activity across the recruitment platform</p>
          </div>
          <Link href="/admin/applications" className="text-sm font-semibold text-orange-700 hover:underline">View all</Link>
        </div>
        {recentApplications.length ? (
          <div className="divide-y divide-slate-100">
            {recentApplications.map((application) => (
              <Link key={application.id} href={`/admin/applications/${application.id}`} className="flex flex-col gap-2 p-5 transition hover:bg-orange-50/40 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{application.applicant.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{application.applicant.email}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm font-medium text-slate-800">{application.job.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{application.job.company} · {application.status.replaceAll("_", " ")}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <Activity className="mx-auto h-7 w-7 text-slate-400" />
            <p className="mt-3 text-sm font-semibold text-slate-800">No applications yet</p>
            <p className="mt-1 text-xs text-slate-500">New graduate applications will appear here.</p>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/admin/reports" className="font-semibold text-orange-700 hover:underline">Reports & analytics</Link>
        <Link href="/admin/notifications" className="font-semibold text-orange-700 hover:underline">Platform announcements</Link>
        <Link href="/admin/settings" className="font-semibold text-orange-700 hover:underline">Platform settings</Link>
      </div>
    </main>
  );
}

