"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";

export async function toggleSavedJob(jobId: string) {
  const session = await requireGraduate();

  const existing = await prisma.savedJob.findUnique({
    where: {
      userId_jobId: {
        userId: session.user.id,
        jobId,
      },
    },
  });

  if (existing) {
    await prisma.savedJob.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        jobId,
      },
    });
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");
  revalidatePath("/saved");
  revalidatePath("/dashboard");
}
