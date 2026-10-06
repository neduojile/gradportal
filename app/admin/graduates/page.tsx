import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Search,
  Users,
  UserRound,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminGraduatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const graduates = await prisma.user.findMany({
    where: {
      role: "GRADUATE",
      ...(query
        ? {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      profile: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  const totalGraduates = await prisma.user.count({
    where: {
      role: "GRADUATE",
    },
  });

  const graduatesWithApplications = graduates.filter(
    (graduate) => graduate._count.applications > 0,
  ).length;

  const graduatesWithProfiles = graduates.filter(
    (graduate) => Boolean(graduate.profile),
  ).length;

  return (
    <main className="min-h-full bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="mb-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                Candidate management
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Graduates
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review registered graduates, inspect their application history,
                and manage candidate information.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Total graduates"
            value={totalGraduates}
            icon={Users}
            featured
          />

          <StatCard
            label="With profiles"
            value={graduatesWithProfiles}
            icon={UserRound}
          />

          <StatCard
            label="Applied to jobs"
            value={graduatesWithApplications}
            icon={BriefcaseBusiness}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <form
              method="GET"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search graduate name or email..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />
              </div>

              <button
                type="submit"
                className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Search
              </button>
            </form>
          </div>

          {graduates.length === 0 ? (
            <EmptyState filtered={Boolean(query)} />
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Graduate
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Profile
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Applications
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Joined
                      </th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {graduates.map((graduate) => (
                      <tr
                        key={graduate.id}
                        className="group transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar name={graduate.name} />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-950">
                                {graduate.name}
                              </p>
                              <p className="truncate text-xs text-slate-500">
                                {graduate.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          {graduate.profile ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                              <CheckCircle2 className="h-3 w-3" />
                              Available
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">
                              Not completed
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-slate-700">
                            {graduate._count.applications}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatDate(graduate.createdAt)}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/graduates/${graduate.id}`}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                          >
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 lg:hidden">
                {graduates.map((graduate) => (
                  <Link
                    key={graduate.id}
                    href={`/admin/graduates/${graduate.id}`}
                    className="block p-5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3">
                        <Avatar name={graduate.name} />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {graduate.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {graduate.email}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                              {graduate._count.applications} applications
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                graduate.profile
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {graduate.profile
                                ? "Profile available"
                                : "Profile incomplete"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
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
  icon: typeof Users;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-[0_6px_20px_rgba(15,23,42,0.03)] ${
        featured
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
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

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xs font-bold text-orange-700">
      {initials || "G"}
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Users className="h-6 w-6" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-950">
        {filtered ? "No graduates found" : "No graduates yet"}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? "Try a different name or email address."
          : "Registered graduate accounts will appear here."}
      </p>
    </div>
  );
}
