import { prisma } from "@/lib/prisma";
import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";

export default async function AdminPage() {
  const [jobs, applications, graduates, openJobs] = await Promise.all([
    prisma.job.count(),
    prisma.application.count(),
    prisma.user.count({ where: { role: "GRADUATE" } }),
    prisma.job.count({ where: { status: "OPEN" } }),
  ]);

  const stats = [
    {
      label: "Total Jobs",
      value: jobs,
      icon: BriefcaseBusiness,
    },
    {
      label: "Open Jobs",
      value: openJobs,
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      value: applications,
      icon: FileText,
    },
    {
      label: "Graduates",
      value: graduates,
      icon: GraduationCap,
    },
  ];

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-orange-500">
          Platform Overview
        </p>

        <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
          Admin Dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Monitor the recruitment platform from one place.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <Icon className="h-5 w-5" />
                </div>

                <Users className="h-4 w-4 text-slate-300" />
              </div>

              <p className="mt-6 text-3xl font-black text-slate-950">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-8">
        <p className="text-sm font-semibold text-slate-900">
          Admin workspace ready
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Use the navigation to manage jobs, applications and graduates.
        </p>
      </div>
    </div>
  );
}
