import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Building2, MapPin } from "lucide-react";
import { auth } from "@/auth";
import CloseBusinessJobButton from "./close-business-job-button";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

const statusStyles: Record<string, string> = {
  OPEN: "bg-emerald-50 text-emerald-700",
  PENDING_APPROVAL: "bg-amber-50 text-amber-700",
  REJECTED: "bg-red-50 text-red-700",
  CLOSED: "bg-slate-100 text-slate-700",
};

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function Detail({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default async function BusinessJobDetailsPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "BUSINESS_OWNER") {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const { id } = await params;

  const business = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, companyName: true },
  });

  if (!business) {
    return (
      <main className="mx-auto max-w-4xl py-10">
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <Building2 className="mb-3 size-7 text-orange-600" />
          <h1 className="text-xl font-bold text-slate-950">Complete your company profile</h1>
          <p className="mt-2 text-sm text-slate-600">Set up your company profile before managing job listings.</p>
          <Link href="/business/profile" className="mt-4 inline-flex rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white">
            Company profile
          </Link>
        </section>
      </main>
    );
  }

  const job = await prisma.job.findFirst({
    where: { id, businessId: business.id },
    include: { _count: { select: { applications: true } } },
  });

  if (!job) notFound();

  const statusStyle = statusStyles[job.status] ?? "bg-slate-100 text-slate-700";

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-12">
      <Link href="/business/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-700">
        <ArrowLeft className="size-4" /> Back to job postings
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">{business.companyName}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{job.title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness className="size-4" />{job.category}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{job.location}</span>
            </p>
          </div>
          <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle}`}>{label(job.status)}</span>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Detail title="Employment type" value={label(job.employmentType)} />
          <Detail title="Application deadline" value={new Date(job.deadline).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} />
          <Detail title="Applications received" value={String(job._count.applications)} />
          <Detail title="Date posted" value={new Date(job.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} />
          <Detail title="Salary range" value={job.salary || "Not specified"} />
          <Detail title="Last updated" value={new Date(job.updatedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} />
        </div>
      </section>

      {job.status === "PENDING_APPROVAL" && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">Awaiting administrator approval</h2>
          <p className="mt-1 text-sm leading-6 text-amber-800">This listing will become available to graduates after it is approved.</p>
        </section>
      )}

      {job.status === "REJECTED" && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-900">Listing rejected</h2>
          <p className="mt-1 text-sm leading-6 text-red-800">{job.reviewNotes || "Please review the listing or contact support for clarification."}</p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-slate-950">Job description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.description}</p>
        <div className="my-7 border-t border-slate-100" />
        <h2 className="text-lg font-bold text-slate-950">Requirements and qualifications</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.requirements}</p>
        {job.skills && (
          <>
            <div className="my-7 border-t border-slate-100" />
            <h2 className="text-lg font-bold text-slate-950">Relevant skills</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.skills}</p>
          </>
        )}
      </section>

      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-slate-950">Manage this listing</h2>
          <p className="mt-1 text-sm text-slate-500">Review the details and application activity.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {job.status !== "CLOSED" && (
            <Link
              href={`/business/jobs/${job.id}/edit`}
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Edit listing
            </Link>
          )}

          <Link
            href={`/business/jobs/${job.id}/applicants`}
            className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100"
          >
            View applicants ({job._count.applications})
          </Link>

          {job.status === "OPEN" && (
            <CloseBusinessJobButton jobId={job.id} />
          )}

          <Link
            href="/business/jobs"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            All job postings
          </Link>
        </div>
      </section>
    </main>
  );
}


