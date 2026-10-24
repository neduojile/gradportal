"use server";

import { ApplicationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  PENDING: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

const labels: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export async function updateBusinessApplicationStatus(
  applicationId: string,
  nextStatus: ApplicationStatus,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Please sign in again." };
    }

    if (session.user.role !== "BUSINESS_OWNER") {
      return {
        success: false,
        error: "You are not authorised to manage applicants.",
      };
    }

    if (!Object.values(ApplicationStatus).includes(nextStatus)) {
      return { success: false, error: "Invalid application status." };
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isActive: true, role: true },
    });

    if (!currentUser || !currentUser.isActive) {
      return {
        success: false,
        error: "Your account is inactive. Please sign in again.",
      };
    }

    if (currentUser.role !== "BUSINESS_OWNER") {
      return {
        success: false,
        error: "You are not authorised to manage applicants.",
      };
    }

    const business = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!business) {
      return {
        success: false,
        error: "Complete your business profile first.",
      };
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        job: { businessId: business.id },
      },
      select: {
        id: true,
        status: true,
        applicantId: true,
        jobId: true,
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
    });

    if (!application) {
      return {
        success: false,
        error: "Application not found for your company.",
      };
    }

    if (application.status === nextStatus) {
      return {
        success: false,
        error: "The application already has this status.",
      };
    }

    if (!allowedTransitions[application.status].includes(nextStatus)) {
      return {
        success: false,
        error: `You cannot move an application from ${labels[application.status]} to ${labels[nextStatus]}.`,
      };
    }

    await prisma.$transaction([
      prisma.application.update({
        where: { id: application.id },
        data: { status: nextStatus },
      }),
      prisma.notification.create({
        data: {
          userId: application.applicantId,
          title: `Application ${labels[nextStatus]}`,
          message: `Your application for ${application.job.title} at ${application.job.company} is now ${labels[nextStatus].toLowerCase()}.`,
          type: "APPLICATION_STATUS",
          link: "/applications",
        },
      }),
    ]);

    revalidatePath(`/business/jobs/${application.jobId}`);
    revalidatePath(`/business/jobs/${application.jobId}/applicants`);
    revalidatePath("/business/jobs");
    revalidatePath("/applications");
    revalidatePath("/notifications");

    return {
      success: true,
      message: `Application moved to ${labels[nextStatus]}.`,
    };
  } catch (error) {
    console.error("Failed to update business application status:", error);

    return {
      success: false,
      error: "Unable to update the application right now. Please try again.",
    };
  }
}
