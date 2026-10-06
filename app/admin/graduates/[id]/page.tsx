import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  UserRound,
  XCircle,
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const statusConfig = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  UNDER_REVIEW: {
    label: "Under review",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AdminGraduateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const graduate = await prisma.user.findFirst({
    where: {
      id,
      role: "GRADUATE",
    },
    include: {
      profile: true,
      applications: {
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
            },
          },
        },
      },
    },
  });

  if (!graduate) notFound();

  const applicationCount = graduate.applications.length;
  const acceptedCount = graduate.applications.filter(
    (application) => application.status === "ACCEPTED",
  ).length;
  const activeCount = graduate.applications.filter(
    (application) =>
      application.status === "PENDING" ||
      application.status === "UNDER_REVIEW" ||
      application.status === "SHORTLISTED",
  ).length;

  return (
    <main className="min-h-full bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1300px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          href="/admin/graduates"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to graduates
        </Link>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-lg font-bold text-orange-700">
                {graduate.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                  Graduate profile
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                  {graduate.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {graduate.email}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined {formatDate(graduate.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {graduate.profile ? (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Profile available
              </span>
            ) : (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Profile incomplete
              </span>
            )}
          </div>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric
            label="Applications"
            value={applicationCount}
            icon={FileText}
          />
          <Metric
            label="Active"
            value={activeCount}
            icon={Clock3}
          />
          <Metric
            label="Accepted"
            value={acceptedCount}
            icon={CheckCircle2}
          />
          <Metric
            label="Profile"
            value={graduate.profile ? "Ready" : "Incomplete"}
            icon={UserRound}
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="border-b border-slate-200 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-950">
                    Application history
                  </h2>
                  <p className="text-xs text-slate-500">
                    Every opportunity this graduate has applied for
                  </p>
                </div>
              </div>
            </div>

            {graduate.applications.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <FileText className="h-8 w-8 text-slate-300" />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No applications yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  This graduate has not applied for any opportunity.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {graduate.applications.map((application) => {
                  const config = statusConfig[application.status];

                  return (
                    <div
                      key={application.id}
                      className="p-5 transition hover:bg-slate-50/70 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-950">
                            {application.job.title}
                          </h3>

                          <p className="mt-1 text-xs font-medium text-slate-500">
                            {application.job.company}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                            <span>{application.job.location}</span>
                            <span>
                              {application.job.employmentType.replace("_", " ")}
                            </span>
                            <span>
                              Applied {formatDate(application.appliedAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${config.className}`}
                          >
                            {config.label}
                          </span>

                          <Link
                            href={`/admin/applications/${application.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                            aria-label="View application"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Account
              </p>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={graduate.email}
                />

                <InfoRow
                  icon={CalendarDays}
                  label="Joined"
                  value={formatDate(graduate.createdAt)}
                />

                <InfoRow
                  icon={UserRound}
                  label="Profile"
                  value={graduate.profile ? "Available" : "Incomplete"}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5">
              <p className="text-sm font-semibold text-orange-950">
                Candidate overview
              </p>

              <p className="mt-2 text-xs leading-5 text-orange-900/70">
                Use the application history to review this graduate&apos;s
                recruitment progress and inspect individual submissions.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: typeof FileText;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>

      <p className="mt-3 text-xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}
