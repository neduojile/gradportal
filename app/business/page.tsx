import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CircleCheck,
  Clock3,
  FileCheck2,
  Plus,
  ShieldAlert,
  Users,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusStyles: Record<string, string> = {
  OPEN: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PENDING_APPROVAL: "bg-amber-50 text-amber-700 ring-amber-600/20",
  REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const verificationLabels: Record<string, string> = {
  PENDING: "Pending review",
  VERIFIED: "Verified",
  REJECTED: "Verification rejected",
  FLAGGED: "Requires attention",
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) =>
    char.toUpperCase(),
  );
}

export default async function BusinessDashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (session.user.role !== "BUSINESS_OWNER") {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const business = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      companyName: true,
      verificationStatus: true,
      jobs: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          deadline: true,
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: { select: { jobs: true } },
    },
  });

  if (!business) {
    return (
      <main className="mx-auto max-w-4xl py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Building2 className="size-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            Set up your company profile
          </h1>
          <p className="mt-2 max-w-xl leading-7 text-slate-600">
            Your business account does not have a company profile yet. Create
            your company profile before managing recruitment on Employa.
          </p>
          <Link
            href="/business/profile"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Set up company profile <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
    );
  }

  const [applicationCount, pendingJobsCount] = await Promise.all([
    prisma.application.count({
      where: { job: { businessId: business.id } },
    }),
    prisma.job.count({
      where: {
        businessId: business.id,
        status: "PENDING_APPROVAL",
      },
    }),
  ]);

  const isVerified = business.verificationStatus === "VERIFIED";

  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            Business workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-600">
            {business.companyName}. Manage your recruitment from one place.
          </p>
        </div>

        <Link
          href="/business/jobs/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
        >
          <Plus className="size-5" /> Post a job
        </Link>
      </header>

      <section
        className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
          isVerified
            ? "border-emerald-200 bg-emerald-50/70"
            : business.verificationStatus === "FLAGGED" ||
                business.verificationStatus === "REJECTED"
              ? "border-red-200 bg-red-50/70"
              : "border-amber-200 bg-amber-50/70"
        }`}
      >
        <div className="flex items-start gap-3">
          {isVerified ? (
            <CircleCheck className="mt-0.5 size-6 shrink-0 text-emerald-600" />
          ) : business.verificationStatus === "FLAGGED" ||
            business.verificationStatus === "REJECTED" ? (
            <ShieldAlert className="mt-0.5 size-6 shrink-0 text-red-600" />
          ) : (
            <Clock3 className="mt-0.5 size-6 shrink-0 text-amber-600" />
          )}
          <div>
            <p className="font-semibold text-slate-950">
              Company verification:{" "}
              {verificationLabels[business.verificationStatus] ??
                formatStatus(business.verificationStatus)}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {isVerified
                ? "Your company is verified. You can submit job listings for admin approval."
                : "Complete company verification to unlock job submission."}
            </p>
          </div>
        </div>
        <Link
          href="/business/profile"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-800 hover:text-orange-700"
        >
          View company profile <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total job postings"
          value={business._count.jobs}
          description="All jobs created by your company"
          icon={<BriefcaseBusiness className="size-5" />}
        />
        <StatCard
          label="Applications received"
          value={applicationCount}
          description="Applications across your jobs"
          icon={<Users className="size-5" />}
        />
        <StatCard
          label="Awaiting approval"
          value={pendingJobsCount}
          description="Listings under admin review"
          icon={<FileCheck2 className="size-5" />}
        />
        <StatCard
          label="Company verification"
          value={isVerified ? "Verified" : "Incomplete"}
          description={verificationLabels[business.verificationStatus] ?? ""}
          icon={<Building2 className="size-5" />}
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Recent job postings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review listing status and application activity.
            </p>
          </div>
          <Link
            href="/business/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
          >
            View all jobs <ArrowRight className="size-4" />
          </Link>
        </div>

        {business.jobs.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <BriefcaseBusiness className="size-7" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">
              Your recruitment starts here
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first job listing to start building your candidate
              pipeline. Your listing will go through admin approval.
            </p>
            <Link
              href="/business/jobs/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
            >
              <Plus className="size-4" /> Create a job listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {business.jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Created {new Date(job.createdAt).toLocaleDateString()}{" "}
                    <span className="mx-1">·</span>
                    {job._count.applications}{" "}
                    {job._count.applications === 1
                      ? "application"
                      : "applications"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                      statusStyles[job.status] ??
                      "bg-slate-100 text-slate-600 ring-slate-500/20"
                    }`}
                  >
                    {formatStatus(job.status)}
                  </span>
                  <Link
                    href={`/business/jobs/${job.id}`}
                    aria-label={`View ${job.title}`}
                    className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-orange-200 hover:text-orange-700"
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}
