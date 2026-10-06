"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function updateJob(jobId: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const requirements = String(formData.get("requirements") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const salary = String(formData.get("salary") ?? "").trim();
  const employmentType = String(formData.get("employmentType") ?? "").trim();
  const deadline = String(formData.get("deadline") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const featured = formData.get("featured") === "on";

  if (
    !title ||
    !company ||
    !category ||
    !description ||
    !requirements ||
    !location ||
    !deadline
  ) {
    redirect(`/admin/jobs/${jobId}/edit?error=missing`);
  }

  if (
    !["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"].includes(
      employmentType,
    )
  ) {
    redirect(`/admin/jobs/${jobId}/edit?error=employment`);
  }

  if (!["OPEN", "CLOSED"].includes(status)) {
    redirect(`/admin/jobs/${jobId}/edit?error=status`);
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    redirect(`/admin/jobs/${jobId}/edit?error=deadline`);
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      title,
      company,
      category,
      description,
      requirements,
      skills: skills || null,
      location,
      salary: salary || null,
      employmentType: employmentType as
        | "FULL_TIME"
        | "PART_TIME"
        | "CONTRACT"
        | "INTERNSHIP"
        | "REMOTE",
      deadline: deadlineDate,
      status: status as "OPEN" | "CLOSED",
      featured,
    },
  });

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");

  redirect(`/admin/jobs/${jobId}`);
}
