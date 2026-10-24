"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";
import { sendEmail } from "@/lib/email";

export async function submitApplication(
  jobId: string,
  formData: FormData,
) {
  const session = await requireGraduate();

  const coverLetter = String(
    formData.get("coverLetter") ?? "",
  ).trim();

  if (coverLetter.length < 20) {
    return {
      error:
        "Your cover letter needs at least 20 characters. Tell the employer why you are a strong fit.",
    };
  }

  if (coverLetter.length > 5000) {
    return {
      error:
        "Your cover letter is too long. Please keep it under 5,000 characters.",
    };
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      status: true,
      deadline: true,
      company: true,
      business: {
        select: {
          businessEmail: true,
          user: {
            select: { email: true, name: true, isActive: true },
          },
        },
      },
    },
  });

  if (!job) {
    return {
      error: "This opportunity could not be found.",
    };
  }

  if (job.status !== "OPEN") {
    return {
      error:
        "This opportunity is no longer accepting applications.",
    };
  }

  if (job.deadline <= new Date()) {
    return {
      error: "The application deadline has passed.",
    };
  }

  const existing = await prisma.application.findUnique({
    where: {
      applicantId_jobId: {
        applicantId: session.user.id,
        jobId,
      },
    },
  });

  if (existing) {
    redirect(`/jobs/${jobId}/apply?submitted=1`);
  }

  try {
    await prisma.application.create({
      data: {
        applicantId: session.user.id,
        jobId,
        coverLetter,
        status: "PENDING",
      },
    });
  } catch {
    const alreadyCreated =
      await prisma.application.findUnique({
        where: {
          applicantId_jobId: {
            applicantId: session.user.id,
            jobId,
          },
        },
      });

    if (alreadyCreated) {
      redirect(`/jobs/${jobId}/apply?submitted=1`);
    }

    return {
      error:
        "We could not submit your application right now. Please try again.",
    };
  }

  const applicant = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  const ownerEmail =
    job.business?.businessEmail || job.business?.user.email;

  if (ownerEmail && job.business?.user.isActive !== false) {
    await sendEmail({
      to: ownerEmail,
      subject: `New application for ${job.title}`,
      text: `A graduate has applied for your job on Employa.\n\nJob: ${job.title}\nApplicant: ${applicant?.name ?? session.user.name ?? "Graduate"}\nApplicant email: ${applicant?.email ?? session.user.email ?? "Not available"}\n\nSign in to Employa to review the application.`,
    });
  }

  const admins = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
    select: {
      id: true,
    },
  });

  if (admins.length > 0) {
    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        title: "New application received",
        message: `${session.user.name ?? "A graduate"} applied for ${job.title} at ${job.company}.`,
        isRead: false,
      })),
    });
  }

  redirect(`/jobs/${jobId}/apply?submitted=1`);
}
