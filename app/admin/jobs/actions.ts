"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendEmail } from "@/lib/email";

async function notifyJobOwner(
  job: { id: string; title: string; createdById: string; business: { userId: string } | null },
  title: string,
  message: string,
) {
  const userIds = [...new Set([job.createdById, job.business?.userId].filter(Boolean))] as string[];

  await prisma.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      title,
      message,
      link: "/business",
    })),
  });
}

async function recordReview(
  actorId: string,
  action: string,
  jobId: string,
  details: string,
) {
  await prisma.auditLog.create({
    data: {
      actorId,
      action,
      targetType: "JOB",
      targetId: jobId,
      details,
    },
  });
}

function refreshJobPages() {
  for (const path of [
    "/admin",
    "/admin/jobs",
    "/admin/applications",
    "/admin/reports",
    "/business",
    "/jobs",
    "/dashboard",
  ]) {
    revalidatePath(path);
  }
}

export async function approveJob(jobId: string) {
  const admin = await requireAdmin();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { business: { select: { userId: true } } },
  });

  if (!job) throw new Error("Job not found.");
  if (job.status !== "PENDING_APPROVAL") {
    throw new Error("Only pending jobs can be approved.");
  }
  if (job.deadline <= new Date()) {
    throw new Error("This job's deadline has passed. Edit the deadline before approving it.");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "OPEN",
      reviewedAt: new Date(),
      reviewedById: admin.user.id,
      reviewNotes: null,
    },
  });

  await notifyJobOwner(
    job,
    "Job listing approved",
    `Your job listing "${job.title}" has been approved and is now eligible to appear publicly.`,
  );

  const graduates = await prisma.user.findMany({
    where: { role: "GRADUATE", isActive: true },
    select: { email: true },
  });

  const jobsUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/jobs`;
  await Promise.all(
    graduates.map((graduate) =>
      sendEmail({
        to: graduate.email,
        subject: `New opportunity on Employa: ${job.title}`,
        text: `A new job opportunity is now public on Employa.\n\nJob: ${job.title}\nCompany: ${job.company}\nDeadline: ${job.deadline.toLocaleDateString()}\n\nBrowse jobs: ${jobsUrl}`,
      })
    )
  );

  await recordReview(admin.user.id, "JOB_APPROVED", jobId, `Approved: ${job.title}`);
  refreshJobPages();

  return { success: true, message: "Job approved successfully." };
}

export async function rejectJob(jobId: string, reason: string) {
  const admin = await requireAdmin();
  const reviewNotes = reason.trim();

  if (!reviewNotes) throw new Error("Provide a reason for rejecting this job.");
  if (reviewNotes.length > 2000) throw new Error("The rejection reason must be 2,000 characters or fewer.");

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { business: { select: { userId: true } } },
  });

  if (!job) throw new Error("Job not found.");
  if (job.status !== "PENDING_APPROVAL") {
    throw new Error("Only pending jobs can be rejected.");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedById: admin.user.id,
      reviewNotes,
    },
  });

  await notifyJobOwner(
    job,
    "Job listing rejected",
    `Your job listing "${job.title}" was rejected. Reason: ${reviewNotes}`,
  );

  
  const ownerIds = [...new Set([job.createdById, job.business?.userId].filter(Boolean))] as string[];
  const owners = await prisma.user.findMany({
    where: { id: { in: ownerIds }, isActive: true },
    select: { email: true, name: true },
  });

  await Promise.all(owners.map((owner) => sendEmail({
    to: owner.email,
    subject: `Employa job listing update: ${job.title}`,
    text: `Hi ${owner.name || "there"},` + "\n\n" +
      `Your job listing "${job.title}" was not approved.` + "\n\n" +
      `Reason: ${reviewNotes}` + "\n\n" +
      "Please review the listing and make the necessary changes before resubmitting.\n\nThe Employa Team",
  })));
await recordReview(
    admin.user.id,
    "JOB_REJECTED",
    jobId,
    `Rejected: ${job.title}. Reason: ${reviewNotes}`,
  );

  refreshJobPages();

  return { success: true, message: "Job rejected and the business has been notified." };
}

export async function toggleFeaturedJob(jobId: string) {
  await requireAdmin();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { featured: true, status: true },
  });

  if (!job) throw new Error("Job not found.");
  if (job.status !== "OPEN" && !job.featured) {
    throw new Error("Only approved, open jobs can be featured.");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { featured: !job.featured },
  });

  refreshJobPages();
}

export async function toggleJobStatus(jobId: string) {
  await requireAdmin();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { status: true, deadline: true },
  });

  if (!job) throw new Error("Job not found.");

  if (job.status === "PENDING_APPROVAL" || job.status === "REJECTED") {
    throw new Error("Review this job using the explicit approve/reject actions.");
  }

  if (job.status === "CLOSED" && job.deadline <= new Date()) {
    throw new Error("This job's deadline has passed. Edit the deadline before reopening it.");
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: job.status === "OPEN" ? "CLOSED" : "OPEN" },
  });

  refreshJobPages();
}

export async function duplicateJob(jobId: string) {
  await requireAdmin();

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job not found.");

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
      status: "PENDING_APPROVAL",
      createdById: job.createdById,
      businessId: job.businessId,
    },
  });

  refreshJobPages();
}

export async function deleteJob(jobId: string) {
  await requireAdmin();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, _count: { select: { applications: true } } },
  });

  if (!job) throw new Error("Job not found.");
  if (job._count.applications > 0) {
    throw new Error("This job has applications. Close it instead to preserve application records.");
  }

  await prisma.job.delete({ where: { id: jobId } });
  refreshJobPages();
}

