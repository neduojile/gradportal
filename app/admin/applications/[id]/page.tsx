import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  MapPin,
  UserRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import StatusActions from "./StatusActions";

const statusConfig = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  UNDER_REVIEW: "bg-blue-50 text-blue-700 ring-blue-200",
  SHORTLISTED: "bg-violet-50 text-violet-700 ring-violet-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
} as const;

const statusLabels = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: {
            select: {
              phone: true,
              location: true,
              qualification: true,
              bio: true,
            },
          },
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          employmentType: true,
          salary: true,
          deadline: true,
        },
      },
    },
  });

  if (!application) notFound();

  return (
    <main className="min-h-full bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1300px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          href="/admin/applications"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>

        <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              Application review
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {application.applicant.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Application for {application.job.title}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
              statusConfig[application.status]
            }`}
          >
            {statusLabels[application.status]}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">
                    Candidate information
                  </h2>
                  <p className="text-xs text-slate-500">
                    Applicant profile details
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Detail label="Name" value={application.applicant.name} />
                <Detail label="Email" value={application.applicant.email} />
                <Detail
                  label="Phone"
                  value={application.applicant.profile?.phone ?? "Not provided"}
                />
                <Detail
                  label="Location"
                  value={
                    application.applicant.profile?.location ?? "Not provided"
                  }
                />
                <Detail
                  label="Qualification"
                  value={
                    application.applicant.profile?.qualification ??
                    "Not provided"
                  }
                />
              </div>

              {application.applicant.profile?.bio && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Bio
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {application.applicant.profile.bio}
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">
                    Cover letter
                  </h2>
                  <p className="text-xs text-slate-500">
                    Submitted by the candidate
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {application.coverLetter}
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Review decision
              </p>

              <h2 className="mt-2 text-lg font-bold text-slate-950">
                Update application
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Move this candidate through the recruitment pipeline. The
                candidate will receive a notification when the status changes.
              </p>

              <div className="mt-5">
                <StatusActions
                  applicationId={application.id}
                  currentStatus={application.status}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Opportunity
              </p>

              <h2 className="mt-2 font-bold text-slate-950">
                {application.job.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {application.job.company}
              </p>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                <Info icon={MapPin} value={application.job.location} />
                <Info
                  icon={BriefcaseBusiness}
                  value={application.job.employmentType.replace("_", " ")}
                />
                <Info
                  icon={CalendarDays}
                  value={`Applied ${formatDate(application.appliedAt)}`}
                />
                <Info
                  icon={CalendarDays}
                  value={`Deadline ${formatDate(application.job.deadline)}`}
                />
              </div>

              <Link
                href={`/admin/jobs/${application.job.id}`}
                className="mt-6 flex h-10 items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View job
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

function Info({
  icon: Icon,
  value,
}: {
  icon: typeof MapPin;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{value}</span>
    </div>
  );
}





