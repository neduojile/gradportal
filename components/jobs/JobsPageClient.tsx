"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type Job = {
  id: string;
  title: string;
  company: string;
  category: string;
  description: string;
  skills: string | null;
  location: string;
  salary: string | null;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
  deadline: string;
  featured: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
};

interface JobsPageClientProps {
  userName: string;
  jobs: Job[];
}

const employmentLabels: Record<Job["employmentType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};

function formatDeadline(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(company: string) {
  return company
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function JobsPageClient({
  userName,
  jobs,
}: JobsPageClientProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | Job["employmentType"]>("ALL");

  const firstName = userName.split(" ")[0];

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesFilter =
        filter === "ALL" || job.employmentType === filter;

      if (!normalizedQuery) return matchesFilter;

      const searchable = [
        job.title,
        job.company,
        job.category,
        job.location,
        job.description,
        job.skills ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchable.includes(normalizedQuery);
    });
  }, [jobs, query, filter]);

  const featuredJobs = filteredJobs.filter((job) => job.featured);
  const regularJobs = filteredJobs.filter((job) => !job.featured);

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 px-6 py-8 shadow-[0_20px_70px_rgba(249,115,22,0.08)] sm:px-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-amber-200/25 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-orange-600 shadow-sm">
            <Sparkles className="size-3.5" />
            Career opportunities curated for you
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Find work that moves
            <span className="block text-orange-500">
              your career forward.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Welcome back, {firstName}. Discover graduate opportunities from
            companies looking for people like you.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:ring-4 focus-within:ring-orange-500/10">
              <Search className="size-5 shrink-0 text-orange-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search jobs, companies, skills..."
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as
                      | "ALL"
                      | Job["employmentType"],
                  )
                }
                className="min-h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-5 pr-11 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 sm:w-48"
              >
                <option value="ALL">All job types</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={BriefcaseBusiness}
          label="Open roles"
          value={jobs.length}
        />
        <StatCard
          icon={Sparkles}
          label="Featured"
          value={jobs.filter((job) => job.featured).length}
        />
        <StatCard
          icon={Users}
          label="Opportunities"
          value={jobs.reduce(
            (total, job) => total + job._count.applications,
            0,
          )}
        />
        <StatCard
          icon={Clock3}
          label="Hiring now"
          value={jobs.length}
        />
      </section>

      {/* Results */}
      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500">
              Opportunities
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              {query || filter !== "ALL"
                ? "Matching opportunities"
                : "Recommended opportunities"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1 ? "opening" : "openings"} available
              right now.
            </p>
          </div>

          {(query || filter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("ALL");
              }}
              className="self-start text-sm font-semibold text-orange-600 sm:self-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        {featuredJobs.length > 0 && !query && filter === "ALL" && (
          <div className="grid gap-5 lg:grid-cols-2">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} featured />
            ))}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(query || filter !== "ALL"
            ? filteredJobs
            : regularJobs
          ).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <Search className="size-6" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              No opportunities found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try another keyword or remove the filters to see more graduate
              opportunities.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BriefcaseBusiness;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <Icon className="size-4.5" />
        </div>

        <div className="min-w-0">
          <p className="text-lg font-bold text-slate-950">{value}</p>
          <p className="truncate text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function JobCard({
  job,
  featured = false,
}: {
  job: Job;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative flex min-h-[300px] flex-col overflow-hidden rounded-[28px] border bg-white p-6 shadow-sm ${
        featured
          ? "border-orange-200 ring-1 ring-orange-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-50 text-sm font-bold text-orange-600">
          {getInitials(job.company)}
        </div>

        {featured && (
          <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-600">
            Featured
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          {job.category}
        </p>

        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950 group-hover:text-orange-600">
          {job.title}
        </h3>

        <p className="mt-1 font-semibold text-slate-700">{job.company}</p>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
        {job.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <MetaPill icon={MapPin} text={job.location} />
        <MetaPill
          icon={BriefcaseBusiness}
          text={employmentLabels[job.employmentType]}
        />
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Deadline {formatDeadline(job.deadline)}
          </span>

          <span>
            {job._count.applications}{" "}
            {job._count.applications === 1 ? "applicant" : "applicants"}
          </span>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white"
        >
          View opportunity
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function MetaPill({
  icon: Icon,
  text,
}: {
  icon: typeof MapPin;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
      <Icon className="size-3.5 text-slate-400" />
      {text}
    </span>
  );
}

