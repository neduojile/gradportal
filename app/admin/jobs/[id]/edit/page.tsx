import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { updateJob } from "../edit-actions";

const input =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10";

export default async function EditJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const query = await searchParams;

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
        Job not found.
      </div>
    );
  }

  const errorMessage =
    query.error === "missing"
      ? "Please complete all required fields."
      : query.error === "employment"
        ? "Invalid employment type."
        : query.error === "status"
          ? "Invalid job status."
          : query.error === "deadline"
            ? "Invalid deadline."
            : "";

  const deadlineValue = new Date(job.deadline);
  const localDeadline = new Date(
    deadlineValue.getTime() - deadlineValue.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href={`/admin/jobs/${job.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-orange-600"
      >
        <ArrowLeft className="size-4" />
        Back to job
      </Link>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Job management
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Edit opportunity
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update the role information and publishing state.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form
        action={updateJob.bind(null, job.id)}
        className="space-y-6 rounded-[30px] border border-border/50 bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold">Job title *</span>
            <input name="title" defaultValue={job.title} className={input} />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Company *</span>
            <input name="company" defaultValue={job.company} className={input} />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Category *</span>
            <input name="category" defaultValue={job.category} className={input} />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Location *</span>
            <input name="location" defaultValue={job.location} className={input} />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Employment type *</span>
            <select
              name="employmentType"
              defaultValue={job.employmentType}
              className={input}
            >
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Status *</span>
            <select name="status" defaultValue={job.status} className={input}>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Salary</span>
            <input name="salary" defaultValue={job.salary ?? ""} className={input} />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Deadline *</span>
            <input
              type="datetime-local"
              name="deadline"
              defaultValue={localDeadline}
              className={input}
            />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold">Description *</span>
          <textarea
            name="description"
            defaultValue={job.description}
            rows={8}
            className={`${input} resize-y`}
          />
        </label>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold">Requirements *</span>
          <textarea
            name="requirements"
            defaultValue={job.requirements}
            rows={7}
            className={`${input} resize-y`}
          />
          <span className="text-xs text-muted-foreground">
            Separate requirements with commas or new lines.
          </span>
        </label>

        <label className="space-y-2 block">
          <span className="text-sm font-semibold">Skills</span>
          <textarea
            name="skills"
            defaultValue={job.skills ?? ""}
            rows={4}
            className={`${input} resize-y`}
          />
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={job.featured}
            className="size-4 accent-orange-500"
          />
          <div>
            <p className="text-sm font-semibold">Featured opportunity</p>
            <p className="text-xs text-muted-foreground">
              Highlight this job at the top of graduate opportunities.
            </p>
          </div>
        </label>

        <div className="flex justify-end border-t border-border/50 pt-6">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Save className="size-4" />
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
