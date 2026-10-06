import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export default async function AdminReportsPage() {
  await requireAdmin();

  const [
    totalGraduates,
    totalJobs,
    openJobs,
    totalApplications,
    accepted,
    rejected,
    shortlisted,
    underReview,
    pending,
    recentApplications,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "GRADUATE" } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
    prisma.application.count({ where: { status: "SHORTLISTED" } }),
    prisma.application.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.findMany({
      orderBy: { appliedAt: "desc" },
      take: 8,
      select: {
        id: true,
        status: true,
        appliedAt: true,
        applicant: { select: { name: true } },
        job: { select: { title: true, company: true } },
      },
    }),
  ]);

  const fill = (value: number) =>
    totalApplications > 0
      ? `${Math.round((value / totalApplications) * 100)}%`
      : "0%";

  const metrics = [
    {
      label: "Graduates",
      value: totalGraduates,
      icon: GraduationCap,
    },
    {
      label: "Total jobs",
      value: totalJobs,
      icon: BriefcaseBusiness,
    },
    {
      label: "Open jobs",
      value: openJobs,
      icon: TrendingUp,
    },
    {
      label: "Applications",
      value: totalApplications,
      icon: FileText,
    },
  ];

  const statuses = [
    ["Pending", pending, "bg-amber-500"],
    ["Under review", underReview, "bg-blue-500"],
    ["Shortlisted", shortlisted, "bg-emerald-500"],
    ["Accepted", accepted, "bg-violet-500"],
    ["Rejected", rejected, "bg-red-500"],
  ] as const;

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-white/20 bg-white/60 p-7 shadow-xl backdrop-blur-xl dark:bg-zinc-900/50 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Platform intelligence
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Reports & analytics
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Real-time recruitment activity from your Employa database.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-[26px] border border-border/50 bg-white p-5 shadow-lg dark:bg-zinc-900"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Icon className="size-5" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-[28px] border border-border/50 bg-white p-6 shadow-lg dark:bg-zinc-900 sm:p-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="size-5 text-orange-500" />
            <div>
              <h2 className="font-bold">Application pipeline</h2>
              <p className="text-sm text-muted-foreground">
                Current distribution across all applications.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {statuses.map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="font-bold">
                    {value} <span className="text-muted-foreground">({fill(value)})</span>
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{
                      width: totalApplications
                        ? `${Math.max((value / totalApplications) * 100, value ? 3 : 0)}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-border/50 bg-white p-6 shadow-lg dark:bg-zinc-900 sm:p-8">
          <h2 className="font-bold">Outcome snapshot</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Key recruitment outcomes.
          </p>

          <div className="mt-7 space-y-4">
            <Outcome icon={CheckCircle2} label="Accepted" value={accepted} />
            <Outcome icon={TrendingUp} label="Shortlisted" value={shortlisted} />
            <Outcome icon={XCircle} label="Rejected" value={rejected} />
            <Outcome icon={Users} label="Still active" value={pending + underReview} />
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-border/50 bg-white shadow-lg dark:bg-zinc-900">
        <div className="border-b border-border/50 p-6 sm:p-8">
          <h2 className="font-bold">Recent applications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest candidate activity.
          </p>
        </div>

        <div className="divide-y divide-border/50">
          {recentApplications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No applications yet.
            </div>
          ) : (
            recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
              >
                <div>
                  <p className="font-semibold">
                    {application.applicant.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {application.job.title} · {application.job.company}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold">
                    {application.status.replaceAll("_", " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {application.appliedAt.toLocaleDateString("en-NG")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Outcome({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/30 p-4">
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-orange-500" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-bold">{value}</span>
    </div>
  );
}
