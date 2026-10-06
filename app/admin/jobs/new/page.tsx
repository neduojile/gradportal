import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, ShieldCheck } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import JobForm from "@/components/admin/jobs/JobForm";

export default async function NewJobPage() {
  await requireAdmin();

  return (
    <main className="min-h-full space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-8 shadow-2xl">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="mt-7 flex items-center gap-4">
            <div className="rounded-2xl bg-orange-500/15 p-4">
              <BriefcaseBusiness className="h-7 w-7 text-orange-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight text-white">
                  Create Job
                </h1>

                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>

              <p className="mt-2 text-slate-400">
                Publish a new graduate opportunity to the Employa network.
              </p>
            </div>
          </div>
        </div>
      </div>

      <JobForm />
    </main>
  );
}
