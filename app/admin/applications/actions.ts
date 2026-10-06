"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const allowedTransitions = {
  PENDING: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
} as const;

const statusLabels = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
} as const;

export async function updateApplicationStatus(
  applicationId: string,
  nextStatus:
    | "PENDING"
    | "UNDER_REVIEW"
    | "SHORTLISTED"
    | "ACCEPTED"
    | "REJECTED",
) {
  await requireAdmin();

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      status: true,
      applicantId: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });

  if (!application) {
    return {
      success: false,
      error: "Application not found.",
    };
  }

  if (application.status === nextStatus) {
    return {
      success: false,
      error: "The application is already at this status.",
    };
  }

  const transitions =
    allowedTransitions[
      application.status as keyof typeof allowedTransitions
    ];

  if (!transitions.includes(nextStatus as never)) {
    return {
      success: false,
      error: `You cannot move an application from ${statusLabels[application.status]} to ${statusLabels[nextStatus]}.`,
    };
  }

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: {
        status: nextStatus,
      },
    }),

    prisma.notification.create({
      data: {
        userId: application.applicantId,
        title: `Application ${statusLabels[nextStatus]}`,
        message: `Your application for ${application.job.title} at ${application.job.company} is now ${statusLabels[nextStatus].toLowerCase()}.`,
      },
    }),
  ]);

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/applications");
  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/notifications");

  return {
    success: true,
    message: `Application moved to ${statusLabels[nextStatus]}.`,
  };
}

