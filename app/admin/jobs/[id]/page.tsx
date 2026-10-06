import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Pencil,
  Star,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";

export default async function AdminJobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          applications: true,
          savedBy: true,
        },
      },
    },
  });

  if (!job) notFound();

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/admin/jobs"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                job.status === "OPEN"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {job.status}
            </span>

            {job.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                <Star className="h-3.5 w-3.5 fill-current" />
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            {job.title}
          </h1>

          <p className="mt-2 text-lg font-semibold text-orange-500">
            {job.company}
          </p>
        </div>

        <Button
          render={
            <Link href={`/admin/jobs/${job.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Job
            </Link>
          }
          className="rounded-2xl"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={MapPin} label="Location" value={job.location} />
        <InfoCard
          icon={BriefcaseBusiness}
          label="Employment"
          value={job.employmentType.replaceAll("_", " ")}
        />
        <InfoCard
          icon={CalendarDays}
          label="Deadline"
          value={job.deadline.toLocaleDateString()}
        />
        <InfoCard
          icon={Users}
          label="Applications"
          value={String(job._count.applications)}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Job Description</h2>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {job.description}
          </p>

          <h2 className="mt-8 text-lg font-black text-slate-950">
            Requirements
          </h2>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {job.requirements}
          </p>

          {job.skills && (
            <>
              <h2 className="mt-8 text-lg font-black text-slate-950">Skills</h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {job.skills}
              </p>
            </>
          )}
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Compensation
          </p>

          <p className="mt-2 text-2xl font-black text-slate-950">
            {job.salary || "Not specified"}
          </p>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Saved by
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {job._count.savedBy} graduates
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-orange-500" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
