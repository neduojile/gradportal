import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  UNDER_REVIEW: {
    label: "Under review",
    icon: Search,
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    icon: CheckCircle2,
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
} as const;

const statuses = [
  { value: "ALL", label: "All applications" },
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await requireGraduate();
  const params = await searchParams;

  const query = params.q?.trim() ?? "";
  const selectedStatus = params.status ?? "ALL";

  const applications = await prisma.application.findMany({
    where: {
      applicantId: session.user.id,
      ...(selectedStatus !== "ALL"
        ? { status: selectedStatus as never }
        : {}),
      ...(query
        ? {
            job: {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  company: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            },
          }
        : {}),
    },
    orderBy: {
      appliedAt: "desc",
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          employmentType: true,
          deadline: true,
        },
      },
    },
  });

  const allApplications = await prisma.application.findMany({
    where: {
      applicantId: session.user.id,
    },
    select: {
      status: true,
    },
  });

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter((item) => item.status === "PENDING").length,
    review: allApplications.filter(
      (item) => item.status === "UNDER_REVIEW",
    ).length,
    shortlisted: allApplications.filter(
      (item) => item.status === "SHORTLISTED",
    ).length,
    accepted: allApplications.filter(
      (item) => item.status === "ACCEPTED",
    ).length,
  };

  return (
    <main className="min-h-full bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="mb-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                Application centre
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Your applications
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Track every opportunity you have applied for and stay on top of
                your recruitment progress.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Find more jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard
            label="Total"
            value={stats.total}
            icon={FileText}
            featured
          />
          <StatCard label="Pending" value={stats.pending} icon={Clock3} />
          <StatCard
            label="Under review"
            value={stats.review}
            icon={Search}
          />
          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
            icon={CheckCircle2}
          />
          <StatCard
            label="Accepted"
            value={stats.accepted}
            icon={CheckCircle2}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <form
              method="GET"
              className="flex flex-col gap-3 lg:flex-row lg:items-center"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search by job title or company..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />
              </div>

              <select
                name="status"
                defaultValue={selectedStatus}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Filter
              </button>
            </form>
          </div>

          {applications.length === 0 ? (
            <EmptyState filtered={Boolean(query || selectedStatus !== "ALL")} />
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((application) => {
                const config = statusConfig[application.status];
                const Icon = config.icon;

                return (
                  <Link
                    key={application.id}
                    href={`/applications/${application.id}`}
                    className="group block p-5 transition hover:bg-slate-50/80 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 sm:flex">
                          <BriefcaseBusiness className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-base font-semibold text-slate-950 group-hover:text-orange-600">
                              {application.job.title}
                            </h2>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${config.className}`}
                            >
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {application.job.company}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                            <span>{application.job.location}</span>
                            <span>{application.job.employmentType.replace("_", " ")}</span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              Applied {formatDate(application.appliedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:border-0 lg:pt-0">
                        <span className="text-xs text-slate-400">
                          View application
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-600">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  featured = false,
}: {
  label: string;
  value: number;
  icon: typeof FileText;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-[0_6px_20px_rgba(15,23,42,0.03)] ${
        featured
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-medium ${
            featured ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {label}
        </span>
        <Icon
          className={`h-4 w-4 ${
            featured ? "text-orange-400" : "text-slate-400"
          }`}
        />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
        <FileText className="h-6 w-6" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-950">
        {filtered ? "No applications found" : "You have no applications yet"}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? "Try changing your search or status filter to find what you are looking for."
          : "Explore available graduate opportunities and submit your first application."}
      </p>

      {!filtered && (
        <Link
          href="/jobs"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Browse jobs
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
