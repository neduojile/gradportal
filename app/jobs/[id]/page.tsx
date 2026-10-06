import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";

const employmentLabels = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
} as const;

const statusLabels = {
  PENDING: "Application submitted",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Application closed",
  ACCEPTED: "Offer received",
} as const;

const statusStyles = {
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700",
  UNDER_REVIEW:
    "border-blue-200 bg-blue-50 text-blue-700",
  SHORTLISTED:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED:
    "border-red-200 bg-red-50 text-red-700",
  ACCEPTED:
    "border-violet-200 bg-violet-50 text-violet-700",
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

function getCompanyInitials(company: string) {
  return company
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getDaysRemaining(deadline: Date) {
  const difference = deadline.getTime() - Date.now();

  if (difference <= 0) return 0;

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function splitList(value: string | null) {
  if (!value) return [];

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireGraduate();
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      company: true,
      category: true,
      description: true,
      requirements: true,
      skills: true,
      location: true,
      salary: true,
      employmentType: true,
      deadline: true,
      featured: true,
      status: true,
      createdAt: true,
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
  const acceptingApplications =
    job.status === "OPEN" && !expired;

  const daysRemaining = getDaysRemaining(job.deadline);
  const requirements = splitList(job.requirements);
  const skills = splitList(job.skills);
  const companyInitials = getCompanyInitials(job.company);

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumb / Back */}
      <Link
        href="/jobs"
        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-orange-600"
      >
        <span className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all group-hover:-translate-x-0.5 group-hover:border-orange-200 group-hover:bg-orange-50">
          <ArrowLeft className="size-4" />
        </span>
        Back to opportunities
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-[0_20px_70px_rgba(249,115,22,0.08)]">
        <div className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-amber-200/20 blur-3xl" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-[22px] bg-white text-lg font-bold text-orange-600 shadow-lg shadow-orange-500/10 ring-1 ring-orange-100 sm:size-20 sm:text-xl">
                  {companyInitials}
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {job.featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                        <Sparkles className="size-3" />
                        Featured opportunity
                      </span>
                    )}

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        acceptingApplications
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {acceptingApplications ? "Accepting applications" : "Closed"}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-orange-600">
                    {job.category}
                  </p>

                  <h1 className="mt-1 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                    {job.title}
                  </h1>

                  <p className="mt-3 text-lg font-semibold text-slate-700">
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="hidden shrink-0 rounded-2xl border border-white bg-white/80 px-4 py-3 text-right shadow-sm sm:block">
                <p className="text-xs font-medium text-slate-400">
                  Posted
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {formatShortDate(job.createdAt)}
                </p>
              </div>
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <JobFact
                icon={MapPin}
                label="Location"
                value={job.location}
              />

              <JobFact
                icon={BriefcaseBusiness}
                label="Employment"
                value={employmentLabels[job.employmentType]}
              />

              <JobFact
                icon={WalletCards}
                label="Compensation"
                value={job.salary || "Not specified"}
              />

              <JobFact
                icon={CalendarDays}
                label="Deadline"
                value={formatShortDate(job.deadline)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
        {/* Left */}
        <div className="min-w-0 space-y-6">
          {/* About */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <SectionHeading
              eyebrow="The opportunity"
              title="About this role"
              icon={FileText}
            />

            <div className="mt-6 whitespace-pre-line text-[15px] leading-7 text-slate-600">
              {job.description}
            </div>
          </section>

          {/* Requirements */}
          {requirements.length > 0 && (
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeading
                eyebrow="What you bring"
                title="Requirements"
                icon={CheckCircle2}
              />

              <div className="mt-6 space-y-3">
                {requirements.map((requirement, index) => (
                  <div
                    key={`${requirement}-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <CheckCircle2 className="size-4" />
                    </span>

                    <p className="text-sm leading-6 text-slate-600">
                      {requirement}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeading
                eyebrow="Your toolkit"
                title="Skills & expertise"
                icon={Sparkles}
              />

              <div className="mt-6 flex flex-wrap gap-2.5">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Trust section */}
          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-orange-400">
                  <ShieldCheck className="size-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Apply with confidence
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight">
                  Your next opportunity could start here.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Submit your application through Employa and keep track of
                  its progress from your graduate dashboard.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Users className="size-5 text-orange-400" />
                <div>
                  <p className="text-sm font-bold">
                    {job._count.applications}
                  </p>
                  <p className="text-xs text-slate-400">
                    {job._count.applications === 1
                      ? "application"
                      : "applications"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="space-y-4">
            {/* Application card */}
            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                  Ready to apply?
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Take the next step.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your application will be reviewed by the employer.
                </p>
              </div>

              <div className="space-y-5 p-6">
                {application ? (
                  <>
                    <div
                      className={`rounded-2xl border p-4 ${
                        statusStyles[application.status]
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0" />

                        <div>
                          <p className="text-sm font-bold">
                            {statusLabels[application.status]}
                          </p>

                          <p className="mt-1 text-xs leading-5 opacity-80">
                            Applied on{" "}
                            {formatDate(application.appliedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/applications"
                      className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition-all hover:bg-orange-500"
                    >
                      View my application
                      <ArrowRight className="size-4" />
                    </Link>
                  </>
                ) : acceptingApplications ? (
                  <>
                    <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                      <div className="flex items-start gap-3">
                        <Clock3 className="mt-0.5 size-5 shrink-0 text-orange-500" />

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {daysRemaining === 1
                              ? "1 day left to apply"
                              : `${daysRemaining} days left to apply`}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Applications close on{" "}
                            {formatDate(job.deadline)}.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/jobs/${job.id}/apply`}
                      className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl"
                    >
                      Apply for this role
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <p className="text-center text-xs leading-5 text-slate-400">
                      It only takes a few minutes to submit your application.
                    </p>
                  </>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 size-5 shrink-0 text-slate-400" />

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Applications are closed
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          This opportunity is no longer accepting
                          applications.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Application deadline
                    </span>
                    <span className="font-semibold text-slate-700">
                      {formatShortDate(job.deadline)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Applications received
                    </span>
                    <span className="font-semibold text-slate-700">
                      {job._count.applications}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Company card */}
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                Employer
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                  {companyInitials}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-slate-950">
                    {job.company}
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Hiring on Employa
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-orange-500" />
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Work location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {job.location}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Back link */}
            <Link
              href="/jobs"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <ArrowLeft className="size-4" />
              Browse more opportunities
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function JobFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-orange-500">
        <Icon className="size-4" />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  icon: typeof FileText;
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
