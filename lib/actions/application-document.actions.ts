"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireRole(role: "BUSINESS_OWNER" | "GRADUATE" | "ADMIN") {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== role) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requestApplicationDocument(
  applicationId: string,
  applicantId: string,
  title: string,
  instructions: string,
  required: boolean = true,
) {
  const user = await requireRole("BUSINESS_OWNER");
  const cleanTitle = title.trim();
  if (!applicationId || !applicantId || cleanTitle.length < 3 || cleanTitle.length > 120) {
    throw new Error("Enter a valid document title.");
  }
  if (instructions.length > 2000) throw new Error("Instructions are too long.");

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { id: true, applicantId: true, job: { select: { createdById: true } } },
  });

  if (!application || application.applicantId !== applicantId || application.job.createdById !== user.id) {
    throw new Error("Application not found or access denied.");
  }

  const request = await prisma.applicationDocumentRequest.create({
    data: {
      applicationId,
      applicantId,
      requestedById: user.id,
      title: cleanTitle,
      instructions: instructions.trim() || null,
      required,
    },
  });

  await prisma.notification.create({
    data: {
      userId: applicantId,
      title: "Document requested",
      message: `The employer requested: ${cleanTitle}. Please submit it for your application.`,
      link: "/documents",
    },
  });

  revalidatePath("/business");
  revalidatePath("/documents");
  revalidatePath("/notifications");
  return { success: true, id: request.id };
}

export async function submitApplicationDocument(
  requestId: string,
  fileUrl: string,
  fileKey: string,
  originalFilename: string,
) {
  const user = await requireRole("GRADUATE");
  if (!fileUrl.startsWith("https://") || !fileKey || !originalFilename.trim()) {
    throw new Error("Upload a valid document first.");
  }

  const request = await prisma.applicationDocumentRequest.findUnique({
    where: { id: requestId },
    select: { id: true, applicantId: true, requestedById: true, title: true, status: true },
  });

  if (!request || request.applicantId !== user.id) throw new Error("Document request not found.");
  if (request.status === "APPROVED") throw new Error("This document has already been approved.");

  await prisma.applicationDocumentRequest.update({
    where: { id: requestId },
    data: {
      fileUrl,
      fileKey,
      originalFilename: originalFilename.slice(0, 255),
      submittedAt: new Date(),
      reviewedAt: null,
      reviewNotes: null,
      status: "SUBMITTED",
    },
  });

  await prisma.notification.create({
    data: {
      userId: request.requestedById,
      title: "Requested document submitted",
      message: `A candidate submitted "${request.title}" for your review.`,
      link: "/business/documents",
    },
  });

  revalidatePath("/documents");
  revalidatePath("/business/documents");
  return { success: true };
}

export async function reviewApplicationDocument(
  requestId: string,
  decision: "APPROVED" | "REJECTED",
  notes: string = "",
) {
  const user = await requireRole("BUSINESS_OWNER");
  const cleanNotes = notes.trim();

  if (decision === "REJECTED" && !cleanNotes) {
    throw new Error("Provide a reason for rejection.");
  }
  if (cleanNotes.length > 2000) throw new Error("Review notes are too long.");

  const request = await prisma.applicationDocumentRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true, requestedById: true, applicantId: true, title: true,
      application: { select: { job: { select: { createdById: true } } } },
    },
  });

  if (!request || request.requestedById !== user.id || request.application.job.createdById !== user.id) {
    throw new Error("Document request not found or access denied.");
  }

  await prisma.applicationDocumentRequest.update({
    where: { id: requestId },
    data: {
      status: decision,
      reviewedAt: new Date(),
      reviewNotes: cleanNotes || null,
    },
  });

  await prisma.notification.create({
    data: {
      userId: request.applicantId,
      title: decision === "APPROVED" ? "Document approved" : "Document needs changes",
      message: decision === "APPROVED"
        ? `Your document "${request.title}" has been approved.`
        : `Your document "${request.title}" was rejected. Reason: ${cleanNotes}`,
      link: "/documents",
    },
  });

  revalidatePath("/business/documents");
  revalidatePath("/documents");
  revalidatePath("/notifications");
  return { success: true };
}
