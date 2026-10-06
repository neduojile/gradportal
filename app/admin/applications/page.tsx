import Link from "next/link";
import { ArrowRight, Clock3, FileText, Search, Users } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700",
  UNDER_REVIEW: "bg-blue-50 text-blue-700",
  SHORTLISTED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  ACCEPTED: "bg-purple-50 text-purple-700",
};

const statusLabels = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

export default async function AdminApplicationsPage() {
  await requireAdmin();

  const [
    applications,
    total,
    pending,
    underReview,
    shortlisted,
    rejected,
    accepted,
  ] = await Promise.all([
    prisma.application.findMany({
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.application.count({ where: { status: "SHORTLISTED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
  ]);

  const stats = [
    { label: "Total", value: total, icon: FileText },
    { label: "Pending", value: pending, icon: Clock3 },
    { label: "Under Review", value: underReview, icon: Search },
    { label: "Shortlisted", value: shortlisted, icon: Users },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-500">
            Recruitment Management
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Applications
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review and manage graduate applications across every job.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-red-50 px-3 py-2 text-red-600">
            {rejected} Rejected
          </span>
          <span className="rounded-full bg-purple-50 px-3 py-2 text-purple-600">
            {accepted} Accepted
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-5 text-3xl font-black text-slate-950">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-black text-slate-950">Recent Applications</h2>
              <p className="mt-1 text-xs text-slate-500">
                {applications.length} application
                {applications.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="flex gap-3">
              <input
                placeholder="Search candidates..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 lg:w-64"
              />

              <select className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-orange-400">
                <option>All Status</option>
                <option>Pending</option>
                <option>Under Review</option>
                <option>Shortlisted</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FileText className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              No applications yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Applications submitted by graduates will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-bold">Candidate</th>
                  <th className="px-6 py-4 font-bold">Job</th>
                  <th className="px-6 py-4 font-bold">Applied</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => {
                  const status = application.status;
                  const candidate =
                    application.applicant.name || "Unnamed Candidate";

                  const initials =
                    candidate
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "GC";

                  return (
                    <tr
                      key={application.id}
                      className="border-b border-slate-100 transition hover:bg-orange-50/30"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                            {initials}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {candidate}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {application.applicant.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-800">
                          {application.job.title}
                        </p>
                        <p className="mt-1 text-xs text-orange-500">
                          {application.job.company}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {application.appliedAt.toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            statusStyles[status]
                          }`}
                        >
                          {statusLabels[status]}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/applications/${application.id}`}
                          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
                        >
                          Review
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
