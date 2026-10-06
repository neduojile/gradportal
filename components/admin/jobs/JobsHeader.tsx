import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Plus,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function JobsHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Admin Workspace
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <BriefcaseBusiness className="h-8 w-8 text-orange-400" />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-white">
                Job Management
              </h1>

              <p className="mt-2 max-w-xl text-slate-300">
                Create, publish, update and manage every opportunity available
                on Employa from one premium workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            render={<Link href="/admin/jobs/new" />}
            size="lg"
            className="h-12 rounded-xl bg-orange-500 px-6 hover:bg-orange-600"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Job
          </Button>

          <Button
            render={<Link href="/admin/dashboard" />}
            variant="secondary"
            size="lg"
            className="h-12 rounded-xl"
          >
            Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
