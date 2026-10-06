import { requireGraduate } from "@/lib/graduate";
import { prisma } from "@/lib/prisma";
import JobsPageClient from "@/components/jobs/JobsPageClient";

export default async function JobsPage() {
  const session = await requireGraduate();

  const jobs = await prisma.job.findMany({
    where: {
      status: "OPEN",
      deadline: {
        gt: new Date(),
      },
    },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      company: true,
      category: true,
      description: true,
      skills: true,
      location: true,
      salary: true,
      employmentType: true,
      deadline: true,
      featured: true,
      createdAt: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return (
    <JobsPageClient
      userName={session.user.name ?? "Graduate"}
      jobs={jobs.map((job) => ({
        ...job,
        deadline: job.deadline.toISOString(),
        createdAt: job.createdAt.toISOString(),
      }))}
    />
  );
}
