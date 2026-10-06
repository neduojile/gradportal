"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { jobSchema } from "@/lib/validations/job";

export async function createJob(formData: FormData) {
  const session = await requireAdmin();

  const rawData = {
    title: String(formData.get("title") ?? ""),
    company: String(formData.get("company") ?? ""),
    category: String(formData.get("category") ?? ""),
    description: String(formData.get("description") ?? ""),
    requirements: String(formData.get("requirements") ?? ""),
    skills: String(formData.get("skills") ?? ""),
    location: String(formData.get("location") ?? ""),
    salary: String(formData.get("salary") ?? ""),
    employmentType: String(formData.get("employmentType") ?? ""),
    deadline: String(formData.get("deadline") ?? ""),
    featured: formData.get("featured") === "on",
  };

  const parsed = jobSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid job information.",
    };
  }

  const deadline = new Date(parsed.data.deadline);

  if (Number.isNaN(deadline.getTime())) {
    return {
      error: "Please provide a valid deadline.",
    };
  }

  if (deadline <= new Date()) {
    return {
      error: "Deadline must be in the future.",
    };
  }

  await prisma.job.create({
    data: {
      title: parsed.data.title,
      company: parsed.data.company,
      category: parsed.data.category,
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      skills: parsed.data.skills || null,
      location: parsed.data.location,
      salary: parsed.data.salary || null,
      employmentType: parsed.data.employmentType,
      deadline,
      featured: parsed.data.featured,
      status: "OPEN",
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/dashboard");

  redirect("/admin/jobs");
}
