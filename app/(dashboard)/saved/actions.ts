"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";

export async function removeSavedJob(savedJobId: string) {
  const session = await requireGraduate();

  await prisma.savedJob.deleteMany({
    where: {
      id: savedJobId,
      userId: session.user.id,
    },
  });

  revalidatePath("/saved");
  revalidatePath("/dashboard");
}

export async function saveJob(jobId: string) {
  const session = await requireGraduate();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true },
  });

  if (!job) {
    redirect("/jobs");
  }

  await prisma.savedJob.upsert({
    where: {
      userId_jobId: {
        userId: session.user.id,
        jobId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      jobId,
    },
  });

  revalidatePath("/saved");
  revalidatePath(`/jobs/${jobId}`);
}
