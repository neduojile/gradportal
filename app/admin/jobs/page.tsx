import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

import JobsHeader from "@/components/admin/jobs/JobsHeader";
import JobsStats from "@/components/admin/jobs/JobsStats";
import JobsFilters from "@/components/admin/jobs/JobsFilters";
import JobsTable from "@/components/admin/jobs/JobsTable";

export default async function AdminJobsPage() {
  await requireAdmin();

  const [
    jobs,
    totalJobs,
    openJobs,
    closedJobs,
    featuredJobs,
  ] = await Promise.all([
    prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.job.count(),

    prisma.job.count({
      where: {
        status: "OPEN",
      },
    }),

    prisma.job.count({
      where: {
        status: "CLOSED",
      },
    }),

    prisma.job.count({
      where: {
        featured: true,
      },
    }),
  ]);

  return (
    <main className="space-y-8">
      <JobsHeader />

      <JobsStats
        totalJobs={totalJobs}
        openJobs={openJobs}
        closedJobs={closedJobs}
        featuredJobs={featuredJobs}
      />

      <JobsFilters />

      <JobsTable jobs={jobs} />
    </main>
  );
}