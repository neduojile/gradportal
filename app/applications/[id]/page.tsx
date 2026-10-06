import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
  XCircle,
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";

const statusConfig = {
  PENDING: {
    label: "Pending",
    description: "Your application has been submitted and is awaiting review.",
    icon: Clock3,
  },
  UNDER_REVIEW: {
    label: "Under review",
    description: "The employer is currently reviewing your application.",
    icon: Search,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    description: "Your application has progressed to the shortlist.",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Not selected",
    description: "This application was not progressed further.",
    icon: XCircle,
  },
  ACCEPTED: {
    label: "Accepted",
    description: "Congratulations. Your application has been accepted.",
    icon: CheckCircle2,
  },
} as const;

const timeline = [
  "PENDING",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "ACCEPTED",
] as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatEmploymentType(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireGraduate();
  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: {
      id,
      applicantId: session.user.id,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
          requirements: true,
          skills: true,
          location: true,
          salary: true,
          employmentType: true,
          deadline: true,
          status: true,
        },
      },
    },
  });

  if (!application) notFound();

  const config = statusConfig[application.status];
  const StatusIcon = config.icon;

  const currentIndex = timeline.indexOf(
    application.status as (typeof timeline)[number],
  );

  const isRejected = application.status === "REJECTED";

  return (
    <main className="min-h-full bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          href="/applications"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">
                      Application
                    </p>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                      {application.job.title}
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {application.job.company}
                    </p>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <StatusIcon className="h-3.5 w-3.5" />
                  {config.label}
                </span>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={application.job.location}
                />
                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Employment"
                  value={formatEmploymentType(application.job.employmentType)}
                />
                <InfoItem
                  icon={CalendarDays}
                  label="Applied"
                  value={formatDate(application.appliedAt)}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Clock3 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">
                    Application status
                  </h2>
                  <p className="text-xs text-slate-500">
                    Current recruitment progress
                  </p>
                </div>
              </div>

              <div className="mt-7">
                {isRejected ? (
                  <StatusMessage
                    icon={StatusIcon}
                    title={config.label}
                    description={config.description}
                    rejected
                  />
                ) : (
                  <div className="space-y-0">
                    {timeline.map((status, index) => {
                      const item = statusConfig[status];
                      const Icon = item.icon;
                      const active = index <= currentIndex;

                      return (
                        <div key={status} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                active
                                  ? "bg-slate-950 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>

                            {index < timeline.length - 1 && (
                              <div
                                className={`h-12 w-px ${
                                  index < currentIndex
                                    ? "bg-slate-950"
                                    : "bg-slate-200"
                                }`}
                              />
                            )}
                          </div>

                          <div className="pb-8">
                            <p
                              className={`text-sm font-semibold ${
                                active
                                  ? "text-slate-950"
                                  : "text-slate-400"
                              }`}
                            >
                              {item.label}
                            </p>
                            {active && (
                              <p className="mt-1 max-w-lg text-xs leading-5 text-slate-500">
                                {status === application.status
                                  ? config.description
                                  : `Completed ${item.label.toLowerCase()} stage.`}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">
                    Your cover letter
                  </h2>
                  <p className="text-xs text-slate-500">
                    Submitted with this application
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {application.coverLetter}
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Opportunity
              </p>

              <h2 className="mt-2 text-lg font-bold text-slate-950">
                {application.job.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {application.job.company}
              </p>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                <SummaryRow label="Location" value={application.job.location} />
                <SummaryRow
                  label="Type"
                  value={formatEmploymentType(application.job.employmentType)}
                />
                {application.job.salary && (
                  <SummaryRow
                    label="Salary"
                    value={application.job.salary}
                  />
                )}
                <SummaryRow
                  label="Deadline"
                  value={formatDate(application.job.deadline)}
                />
              </div>

              <Link
                href={`/jobs/${application.job.id}`}
                className="mt-6 flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                View job
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </section>

            <section className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5">
              <p className="text-sm font-semibold text-orange-950">
                Keep your profile ready
              </p>
              <p className="mt-1 text-xs leading-5 text-orange-800/70">
                Employers may review your profile alongside your application.
              </p>
              <Link
                href="/profile"
                className="mt-4 inline-flex text-xs font-bold text-orange-700 hover:text-orange-900"
              >
                Update profile ?
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-2 truncate text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-right text-xs font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}

function StatusMessage({
  icon: Icon,
  title,
  description,
  rejected = false,
}: {
  icon: typeof XCircle;
  title: string;
  description: string;
  rejected?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        rejected
          ? "border-red-100 bg-red-50"
          : "border-emerald-100 bg-emerald-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          rejected
            ? "bg-red-100 text-red-600"
            : "bg-emerald-100 text-emerald-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
