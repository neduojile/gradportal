"use client";

import {
  Building2,
  Calendar,
  MapPin,
  MoreHorizontal,
  Star,
} from "lucide-react";

import JobActionsMenu from "./JobActionsMenu";

import type { Job } from "@prisma/client";

import { Button } from "@/components/ui/button";

type JobsTableProps = {
  jobs: Job[];
};

export default function JobsTable({ jobs }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
        <div className="text-center">
          <Building2 className="mx-auto h-14 w-14 text-slate-300" />

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            No Jobs Yet
          </h2>

          <p className="mt-2 text-slate-500">
            Create your first job posting to start recruiting graduates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-8 py-5 font-semibold">Job</th>
              <th className="px-6 py-5 font-semibold">Company</th>
              <th className="px-6 py-5 font-semibold">Location</th>
              <th className="px-6 py-5 font-semibold">Salary</th>
              <th className="px-6 py-5 font-semibold">Status</th>
              <th className="px-6 py-5 font-semibold">Deadline</th>
              <th className="px-6 py-5 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b transition hover:bg-orange-50/40"
              >
                {/* Job */}

                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                      <Building2 className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.category}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Company */}

                <td className="px-6 py-6">
                  <span className="font-medium text-slate-700">
                    {job.company}
                  </span>
                </td>

                {/* Location */}

                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-orange-500" />

                    {job.location}
                  </div>
                </td>

                {/* Salary */}

                <td className="px-6 py-6">
                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    {job.salary ?? "Negotiable"}
                  </span>
                </td>

                {/* Status */}

                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${
                        job.status === "OPEN"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.status}
                    </span>

                    {job.featured && (
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                </td>

                {/* Deadline */}

                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-blue-500" />

                    {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </td>

                {/* Actions */}

                <td className="px-6 py-6 text-right">
  <JobActionsMenu job={job} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}