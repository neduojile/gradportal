import Link from "next/link";
import {
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  MapPin,
  Trash2,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";
import { removeSavedJob } from "./actions";

export default async function SavedJobsPage() {
  const session = await requireGraduate();

  const savedJobs = await prisma.savedJob.findMany({
    where: {
      userId: session.user.id,
      job: {
        status: "OPEN",
      },
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          category: true,
          location: true,
          salary: true,
          employmentType: true,
          deadline: true,
          description: true,
          featured: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/60 p-7 shadow-xl backdrop-blur-3xl dark:bg-zinc-900/60 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-300">
              <Bookmark className="size-3.5" />
              Your shortlist
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Saved Jobs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Keep the opportunities you want to revisit in one place.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-bold text-white shadow-lg shadow-orange-500/25">
            {savedJobs.length}
          </div>
        </div>
      </section>

      {savedJobs.length === 0 ? (
        <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[32px] border border-dashed border-border/70 bg-white/50 px-6 text-center shadow-lg backdrop-blur-xl dark:bg-zinc-900/40">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
            <Bookmark className="size-9" />
          </div>

          <h2 className="mt-6 text-2xl font-bold">No saved jobs yet</h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            When you find an opportunity worth coming back to, save it here.
          </p>

          <Link
            href="/jobs"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20"
          >
            Browse opportunities
            <ChevronRight className="size-4" />
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {savedJobs.map(({ id, job }) => {
            const expired = job.deadline <= now;

            return (
              <article
                key={id}
                className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/65 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/60"
              >
                {job.featured ? (
                  <span className="absolute right-5 top-5 rounded-full bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-600">
                    Featured
                  </span>
                ) : null}

                <div className="pr-20">
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                    {job.category}
                  </p>

                  <h2 className="mt-2 text-xl font-bold tracking-tight">
                    {job.title}
                  </h2>

                  <p className="mt-1 font-medium text-muted-foreground">
                    {job.company}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-2 text-xs font-medium">
                    <MapPin className="size-3.5" />
                    {job.location}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-2 text-xs font-medium">
                    <BriefcaseBusiness className="size-3.5" />
                    {job.employmentType.replaceAll("_", " ")}
                  </span>
                </div>

                <p className="mt-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {job.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-5">
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                      <CalendarDays className="size-4 text-orange-500" />
                      {job.deadline.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={removeSavedJob.bind(null, id)}>
                      <button
                        type="submit"
                        aria-label="Remove saved job"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-muted-foreground"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </form>

                    <Link
                      href={`/jobs/${job.id}`}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
                        expired
                          ? "bg-zinc-500"
                          : "bg-orange-500 shadow-orange-500/20"
                      }`}
                    >
                      {expired ? "View" : "View job"}
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

