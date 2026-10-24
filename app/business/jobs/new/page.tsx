"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { createBusinessJob } from "@/lib/actions/business-job.actions";

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

const labelClass = "text-sm font-semibold text-slate-800";

export default function NewBusinessJobPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      description: String(formData.get("description") ?? ""),
      requirements: String(formData.get("requirements") ?? ""),
      location: String(formData.get("location") ?? ""),
      deadline: String(formData.get("deadline") ?? ""),
      employmentType: String(formData.get("employmentType") ?? ""),
      salary: String(formData.get("salary") ?? ""),
      skills: String(formData.get("skills") ?? ""),
    };

    startTransition(async () => {
      const result = await createBusinessJob(payload);
      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        event.currentTarget;
        router.push("/business");
        router.refresh();
      }
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/business"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to business dashboard
        </Link>

        <header className="mt-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-orange-600">
            Recruiter workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Create a job listing
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Share the role, responsibilities, and qualifications so graduates can understand the opportunity before applying.
          </p>
        </header>

        <div className="mt-8 flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Admin approval required</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Submitted listings are reviewed before they become visible as open jobs to applicants.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <section>
            <h2 className="text-lg font-bold text-slate-950">Role information</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start with the details applicants will see first.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Job title <span className="text-orange-600">*</span>
                <input
                  name="title"
                  required
                  minLength={5}
                  maxLength={120}
                  placeholder="e.g. Graduate Software Engineer"
                  className={fieldClass}
                />
              </label>

              <label className={labelClass}>
                Job category <span className="text-orange-600">*</span>
                <input
                  name="category"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="e.g. Software Development"
                  className={fieldClass}
                />
              </label>

              <label className={labelClass}>
                Employment type <span className="text-orange-600">*</span>
                <select
                  name="employmentType"
                  required
                  defaultValue="FULL_TIME"
                  className={fieldClass}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </label>

              <label className={labelClass}>
                Location <span className="text-orange-600">*</span>
                <input
                  name="location"
                  required
                  minLength={2}
                  maxLength={120}
                  placeholder="e.g. Lagos, Nigeria or Remote"
                  className={fieldClass}
                />
              </label>

              <label className={labelClass}>
                Salary range
                <input
                  name="salary"
                  maxLength={100}
                  placeholder="e.g. ₦150,000–₦250,000 monthly"
                  className={fieldClass}
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Optional. Include the currency and pay period.
                </span>
              </label>

              <label className={labelClass}>
                Application deadline <span className="text-orange-600">*</span>
                <input
                  name="deadline"
                  type="date"
                  required
                  min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                  className={fieldClass}
                />
              </label>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          <section>
            <h2 className="text-lg font-bold text-slate-950">Job description</h2>
            <label className={`${labelClass} mt-5 block`}>
              Responsibilities and role overview <span className="text-orange-600">*</span>
              <textarea
                name="description"
                required
                minLength={30}
                maxLength={10000}
                rows={6}
                placeholder="Explain the role, daily responsibilities, team, and what success looks like."
                className={fieldClass}
              />
            </label>

            <label className={`${labelClass} mt-5 block`}>
              Requirements and qualifications <span className="text-orange-600">*</span>
              <textarea
                name="requirements"
                required
                minLength={10}
                maxLength={10000}
                rows={5}
                placeholder="List educational requirements, experience, and other qualifications."
                className={fieldClass}
              />
            </label>

            <label className={`${labelClass} mt-5 block`}>
              Required skills
              <input
                name="skills"
                maxLength={1000}
                placeholder="e.g. TypeScript, SQL, communication"
                className={fieldClass}
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Optional. Separate skills with commas.
              </span>
            </label>
          </section>

          {message && (
            <div
              role="status"
              className={`flex gap-3 rounded-xl border p-4 text-sm ${
                success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {success && <CheckCircle2 className="h-5 w-5 shrink-0" />}
              <p>{message}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/business"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isPending ? "Submitting..." : "Submit for approval"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
