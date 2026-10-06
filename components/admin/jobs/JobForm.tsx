"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { createJob } from "@/app/admin/jobs/new/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JobForm() {
  const [isPending, startTransition] = useTransition();
  const [featured, setFeatured] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createJob(formData);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div className="space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
              Opportunity
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Job Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Give graduates the information they need to understand the role.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Job Title" required>
              <Input
                name="title"
                placeholder="e.g. Frontend Developer"
                className="h-12 rounded-xl"
                required
              />
            </Field>

            <Field label="Company" required>
              <Input
                name="company"
                placeholder="e.g. TechNova Ltd"
                className="h-12 rounded-xl"
                required
              />
            </Field>

            <Field label="Category" required>
              <Input
                name="category"
                placeholder="e.g. Software Engineering"
                className="h-12 rounded-xl"
                required
              />
            </Field>

            <Field label="Location" required>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="location"
                  placeholder="Lagos, Nigeria"
                  className="h-12 rounded-xl pl-10"
                  required
                />
              </div>
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
              Details
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Role Details
            </h2>
          </div>

          <div className="space-y-6">
            <Field label="Description" required>
              <textarea
                name="description"
                placeholder="Describe the role, team, responsibilities and opportunity..."
                className="min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                required
              />
            </Field>

            <Field label="Requirements" required>
              <textarea
                name="requirements"
                placeholder="List qualifications, experience and requirements..."
                className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                required
              />
            </Field>

            <Field label="Skills">
              <Input
                name="skills"
                placeholder="React, TypeScript, Next.js, Git"
                className="h-12 rounded-xl"
              />

              <p className="mt-2 text-xs text-slate-400">
                Separate skills with commas.
              </p>
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
              Compensation
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Employment Details
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Employment Type" required>
              <select
                name="employmentType"
                defaultValue="FULL_TIME"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                required
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
            </Field>

            <Field label="Salary">
              <div className="relative">
                <CircleDollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="salary"
                  placeholder="?450,000/month"
                  className="h-12 rounded-xl pl-10"
                />
              </div>
            </Field>

            <Field label="Application Deadline" required>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="deadline"
                  type="date"
                  className="h-12 rounded-xl pl-10"
                  required
                />
              </div>
            </Field>
          </div>
        </section>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-7 text-white">
            <Sparkles className="h-6 w-6" />

            <h2 className="mt-5 text-2xl font-black">Publish Opportunity</h2>

            <p className="mt-2 text-sm leading-6 text-orange-50">
              Your job will become visible to qualified graduates immediately
              after publishing.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-orange-300 hover:bg-orange-50/50">
              <input
                type="checkbox"
                name="featured"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="mt-1 h-4 w-4 accent-orange-500"
              />

              <span>
                <span className="block font-bold text-slate-900">
                  Feature this job
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Give this opportunity additional visibility across Employa.
                </span>
              </span>
            </label>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />

                <span className="text-sm font-semibold text-slate-700">
                  Status: Open
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                The position will accept applications immediately.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-13 w-full rounded-2xl bg-slate-950 text-white shadow-lg hover:bg-slate-800"
            >
              {isPending ? (
                "Publishing..."
              ) : (
                <>
                  Publish Job
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              render={<Link href="/admin/jobs" />}
              className="h-12 w-full rounded-2xl"
            >
              Cancel
            </Button>
          </div>
        </section>
      </aside>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-orange-500">*</span>}
      </label>

      {children}
    </div>
  );
}
