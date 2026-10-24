import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

const statuses = [
  { value: "ALL", label: "All jobs" },
  { value: "OPEN", label: "Open" },
  { value: "PENDING_APPROVAL", label: "Pending approval" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CLOSED", label: "Closed" },
] as const;

const statusStyles: Record<string, string> = {
  OPEN: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PENDING_APPROVAL: "bg-amber-50 text-amber-700 ring-amber-600/20",
  REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) =>
    char.toUpperCase(),
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number;
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
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </article>
  );
}

export default async function BusinessJobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (session.user.role !== "BUSINESS_OWNER") {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 100);
  const selectedStatus = statuses.some((item) => item.value === params.status)
    ? params.status!
    : "ALL";

  const business = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, companyName: true, verificationStatus: true },
  });

  if (!business) {
    return (
      <main className="mx-auto max-w-4xl space-y-5 py-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            Recruitment
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Job postings</h1>
        </div>
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-bold text-slate-950">Complete your company profile</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Set up your company profile before managing recruitment listings.
          </p>
          <Link href="/business/profile" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-700">
            Set up profile <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
    );
  }

  const [total, open, pending, rejected, closed] = await Promise.all([
    prisma.job.count({ where: { businessId: business.id } }),
    prisma.job.count({ where: { businessId: business.id, status: "OPEN" } }),
    prisma.job.count({ where: { businessId: business.id, status: "PENDING_APPROVAL" } }),
    prisma.job.count({ where: { businessId: business.id, status: "REJECTED" } }),
    prisma.job.count({ where: { businessId: business.id, status: "CLOSED" } }),
  ]);

  const jobs = await prisma.job.findMany({
    where: {
      businessId: business.id,
      ...(selectedStatus !== "ALL"
        ? { status: selectedStatus as "OPEN" | "PENDING_APPROVAL" | "REJECTED" | "CLOSED" }
        : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
              { location: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      title: true,
      category: true,
      location: true,
      employmentType: true,
      status: true,
      createdAt: true,
      deadline: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const verificationRequired = business.verificationStatus !== "VERIFIED";

  return (
    <main className="mx-auto max-w-7xl space-y-7 pb-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            {business.companyName}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Job postings
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage your listings, monitor applications, and track approval status.
          </p>
        </div>
        <Link
          href="/business/jobs/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
        >
          <Plus className="size-5" /> Create a job
        </Link>
      </header>

      {verificationRequired && (
        <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Clock3 className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <div>
              <p className="font-semibold text-slate-900">
                Company verification is {formatStatus(business.verificationStatus).toLowerCase()}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Your company must be verified before it can submit new job listings.
              </p>
            </div>
          </div>
          <Link href="/business/profile" className="text-sm font-semibold text-orange-700 hover:text-orange-800">
            Review company profile <ArrowRight className="ml-1 inline size-4" />
          </Link>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total listings" value={total} description="All company job postings" icon={<BriefcaseBusiness className="size-5" />} />
        <StatCard label="Open jobs" value={open} description="Currently accepting applications" icon={<CheckCircle2 className="size-5" />} />
        <StatCard label="Awaiting approval" value={pending} description="Under administrator review" icon={<Clock3 className="size-5" />} />
        <StatCard label="Rejected or closed" value={rejected + closed} description={`${rejected} rejected · ${closed} closed`} icon={<XCircle className="size-5" />} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">All listings</h2>
              <p className="mt-1 text-sm text-slate-500">
                {jobs.length} {jobs.length === 1 ? "listing" : "listings"} match your filters
              </p>
            </div>
            <form action="/business/jobs" method="GET" className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block min-w-0 flex-1 sm:min-w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search title, category, location"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                />
              </label>
              <select
                name="status"
                defaultValue={selectedStatus}
                aria-label="Filter jobs by status"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
              <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
                Filter
              </button>
              {(query || selectedStatus !== "ALL") && (
                <Link href="/business/jobs" className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  <ArrowDownRight className="size-4" /> Reset
                </Link>
              )}
            </form>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <BriefcaseBusiness className="size-7" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">
              {total === 0 ? "No job listings yet" : "No matching listings"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {total === 0
                ? "Create your first job listing to start building your candidate pipeline."
                : "Try a different search term or status filter."}
            </p>
            {total === 0 && (
              <Link href="/business/jobs/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700">
                <Plus className="size-4" /> Create a job
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <article key={job.id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/70 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">{job.title}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[job.status] ?? "bg-slate-100 text-slate-600 ring-slate-500/20"}`}>
                      {formatStatus(job.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {job.category} <span className="mx-1">·</span> {job.location} <span className="mx-1">·</span> {formatStatus(job.employmentType)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-4" /> {job._count.applications} applications
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="size-4" /> Deadline {new Date(job.deadline).toLocaleDateString()}
                    </span>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link
                  href={`/business/jobs/${job.id}`}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-700 xl:self-center"
                >
                  View details <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
