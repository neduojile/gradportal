"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import { updateBusinessJob } from "@/lib/actions/business-job.actions";

type JobFormData = {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements: string;
  location: string;
  deadline: string;
  employmentType: string;
  salary: string;
  skills: string;
};

const employmentTypes = [
  { value: "FULL_TIME", label: "Full time" },
  { value: "PART_TIME", label: "Part time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
];

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export default function EditBusinessJobForm({ job }: { job: JobFormData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const input = {
      jobId: job.id,
      title: String(form.get("title") ?? ""),
      category: String(form.get("category") ?? ""),
      description: String(form.get("description") ?? ""),
      requirements: String(form.get("requirements") ?? ""),
      location: String(form.get("location") ?? ""),
      deadline: String(form.get("deadline") ?? ""),
      employmentType: String(form.get("employmentType") ?? ""),
      salary: String(form.get("salary") ?? ""),
      skills: String(form.get("skills") ?? ""),
    };

    startTransition(async () => {
      try {
        const result = await updateBusinessJob(input);

        if (!result.success) {
          setError(result.message);
          return;
        }

        router.push(`/business/jobs/${job.id}`);
        router.refresh();
      } catch {
        setError("Something went wrong while saving. Please try again.");
      }
    });
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 pb-12">
      <Link
        href={`/business/jobs/${job.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-700"
      >
        <ArrowLeft className="size-4" /> Back to job details
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
          Business workspace
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          Edit job listing
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update your listing details. Changes to a rejected listing will require administrator approval again.
        </p>

        {error && (
          <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Job title *
              <input name="title" required minLength={5} maxLength={120} defaultValue={job.title} className={inputClass} />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Category *
              <input name="category" required minLength={2} maxLength={80} defaultValue={job.category} className={inputClass} />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Location *
              <input name="location" required minLength={2} maxLength={150} defaultValue={job.location} className={inputClass} />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Employment type *
              <select name="employmentType" required defaultValue={job.employmentType} className={inputClass}>
                {employmentTypes.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Application deadline *
              <input
                name="deadline"
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                defaultValue={job.deadline}
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Salary range
              <input name="salary" maxLength={100} defaultValue={job.salary} placeholder="e.g. ₦150,000–₦250,000 monthly" className={inputClass} />
            </label>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Job description *
            <textarea name="description" required minLength={30} maxLength={10000} rows={6} defaultValue={job.description} className={inputClass} />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Requirements and qualifications *
            <textarea name="requirements" required minLength={10} maxLength={10000} rows={5} defaultValue={job.requirements} className={inputClass} />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Relevant skills
            <textarea name="skills" maxLength={2000} rows={3} defaultValue={job.skills} placeholder="List relevant skills, separated by commas" className={inputClass} />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              href={`/business/jobs/${job.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
              {isPending ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
