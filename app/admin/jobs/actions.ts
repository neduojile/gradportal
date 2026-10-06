"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function toggleFeaturedJob(jobId: string) {
  await requireAdmin();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { featured: true },
  });

  if (!job) {
    throw new Error("Job not found.");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { featured: !job.featured },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
}

export async function toggleJobStatus(jobId: string) {
  await requireAdmin();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { status: true },
  });

  if (!job) {
    throw new Error("Job not found.");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: job.status === "OPEN" ? "CLOSED" : "OPEN",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
}

export async function duplicateJob(jobId: string) {
  await requireAdmin();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error("Job not found.");
  }

  await prisma.job.create({
    data: {
      title: `${job.title} (Copy)`,
      company: job.company,
      category: job.category,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
      location: job.location,
      salary: job.salary,
      employmentType: job.employmentType,
      deadline: job.deadline,
      featured: false,
      status: "OPEN",
      createdById: job.createdById,
    },
  });

  revalidatePath("/admin/jobs");
}

export async function deleteJob(jobId: string) {
  await requireAdmin();

  await prisma.job.delete({
    where: { id: jobId },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
}
