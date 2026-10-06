import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";
import ApplyForm from "@/components/jobs/ApplyForm";

const employmentLabels = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
} as const;

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function formatShortDate(value: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getDaysRemaining(deadline: Date) {
  const difference = deadline.getTime() - Date.now();

  if (difference <= 0) return 0;

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24),
  );
}

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const session = await requireGraduate();
  const { id } = await params;
  const { submitted } = await searchParams;

  const job = await prisma.job.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      company: true,
      category: true,
      location: true,
      salary: true,
      employmentType: true,
      deadline: true,
      featured: true,
      status: true,
      description: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  const application = await prisma.application.findUnique({
    where: {
      applicantId_jobId: {
        applicantId: session.user.id,
        jobId: job.id,
      },
    },
    select: {
      id: true,
      status: true,
      appliedAt: true,
    },
  });

  const expired = job.deadline <= new Date();
  const accepting =
    job.status === "OPEN" && !expired;

  const daysRemaining = getDaysRemaining(job.deadline);
  const companyInitials = getInitials(job.company);

  if (application || submitted === "1") {
    return (
      <div className="mx-auto max-w-4xl py-4 sm:py-8">
        <div className="relative overflow-hidden rounded-[36px] border border-emerald-100 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-28 size-80 rounded-full bg-orange-100/50 blur-3xl" />

          <div className="relative p-7 text-center sm:p-12 lg:p-16">
            <div className="mx-auto flex size-20 items-center justify-center rounded-[26px] bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
              <CheckCircle2 className="size-10" />
            </div>

            <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Sparkles className="size-3.5" />
              Application submitted
            </span>

            <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your application is on its way.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Nice work, {session.user.name?.split(" ")[0] ?? "there"}.
              Your application for{" "}
              <span className="font-semibold text-slate-800">
                {job.title}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-slate-800">
                {job.company}
              </span>{" "}
              has been successfully submitted.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
              <ConfirmationItem
                icon={FileCheck2}
                label="Status"
                value="Pending review"
              />

              <ConfirmationItem
                icon={CalendarDays}
                label="Deadline"
                value={formatShortDate(job.deadline)}
              />

              <ConfirmationItem
                icon={Users}
                label="Applications"
                value={`${job._count.applications}`}
              />
            </div>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/applications"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-orange-500"
              >
                View my applications
                <ArrowLeft className="size-4 rotate-180" />
              </Link>

              <Link
                href="/jobs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
              >
                Browse more jobs
              </Link>
            </div>

            <div className="mx-auto mt-8 flex max-w-xl items-start gap-3 rounded-2xl bg-slate-50 p-4 text-left">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-orange-500" />
              <p className="text-xs leading-5 text-slate-500">
                You can track this application from your Applications
                dashboard. If the employer changes its status, Employa
                will keep your application record up to date.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!accepting) {
    return (
      <div className="mx-auto max-w-3xl py-4 sm:py-8">
        <Link
          href={`/jobs/${job.id}`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600"
        >
          <ArrowLeft className="size-4" />
          Back to job details
        </Link>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Clock3 className="size-7" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Applications are closed
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            This opportunity is no longer accepting applications.
          </p>

          <Link
            href="/jobs"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-orange-500"
          >
            Browse available jobs
            <ArrowLeft className="size-4 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[32px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-[0_20px_70px_rgba(249,115,22,0.07)]">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-orange-600"
          >
            <ArrowLeft className="size-4" />
            Back to job details
          </Link>

          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-[22px] bg-white text-lg font-bold text-orange-600 shadow-lg ring-1 ring-orange-100 sm:size-20">
              {companyInitials}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                  Application
                </span>

                {job.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    <Sparkles className="size-3" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Apply for {job.title}
              </h1>

              <p className="mt-2 font-semibold text-slate-600">
                {job.company}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <FactPill icon={MapPin} text={job.location} />
            <FactPill
              icon={BriefcaseBusiness}
              text={employmentLabels[job.employmentType]}
            />
            <FactPill
              icon={WalletCards}
              text={job.salary || "Salary not specified"}
            />
            <FactPill
              icon={CalendarDays}
              text={`Deadline ${formatShortDate(job.deadline)}`}
            />
          </div>
        </div>
      </section>

      {/* Application workspace */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          {/* Candidate */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeader
              icon={Users}
              eyebrow="Candidate"
              title="Your application details"
            />

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                {getInitials(session.user.name ?? "Graduate")}
              </div>

              <div className="min-w-0">
                <p className="font-bold text-slate-950">
                  {session.user.name ?? "Graduate"}
                </p>

                <p className="mt-0.5 truncate text-sm text-slate-500">
                  {session.user.email}
                </p>
              </div>

              <div className="ml-auto hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:block">
                Signed in
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />

              <p className="text-xs leading-5 text-blue-700">
                Your signed-in Employa account will be attached to this
                application automatically. You do not need to enter your
                contact details again.
              </p>
            </div>
          </section>

          {/* Cover letter */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeader
              icon={FileText}
              eyebrow="Your story"
              title="Write your cover letter"
            />

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Give the employer a clear reason to remember you. Highlight
              your relevant experience, strengths, and why this opportunity
              interests you.
            </p>

            <div className="mt-6">
              <ApplyForm jobId={job.id} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="space-y-4">
            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.07)]">
              <div className="bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
                  Before you submit
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Make your application count.
                </h2>
              </div>

              <div className="space-y-4 p-6">
                <ChecklistItem
                  number="01"
                  title="Keep it specific"
                  description="Connect your experience to this role."
                />

                <ChecklistItem
                  number="02"
                  title="Show your value"
                  description="Focus on what you can contribute."
                />

                <ChecklistItem
                  number="03"
                  title="Proofread"
                  description="Clear writing makes a stronger impression."
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-orange-100 bg-orange-50 p-6">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-5 shrink-0 text-orange-500" />

                <div>
                  <p className="font-bold text-slate-900">
                    {daysRemaining === 1
                      ? "1 day left"
                      : `${daysRemaining} days left`}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Applications close on {formatDate(job.deadline)}.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Opportunity
              </p>

              <div className="mt-4 space-y-4">
                <SummaryRow
                  icon={BriefcaseBusiness}
                  label="Employment"
                  value={employmentLabels[job.employmentType]}
                />

                <SummaryRow
                  icon={MapPin}
                  label="Location"
                  value={job.location}
                />

                <SummaryRow
                  icon={Users}
                  label="Applications"
                  value={`${job._count.applications}`}
                />
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: typeof FileText;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-orange-500">
        <Icon className="size-4" />
        <span className="text-xs font-bold uppercase tracking-widest">
          {eyebrow}
        </span>
      </div>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>
    </div>
  );
}

function FactPill({
  icon: Icon,
  text,
}: {
  icon: typeof MapPin;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
      <Icon className="size-3.5 text-orange-500" />
      {text}
    </span>
  );
}

function ChecklistItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[10px] font-bold text-orange-600">
        {number}
      </span>

      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function ConfirmationItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <Icon className="size-5 text-emerald-600" />

      <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}
