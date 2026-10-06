"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";

const qualifications = [
  "SSCE",
  "OND",
  "HND",
  "BSC",
  "BENG",
  "BA",
  "MSC",
  "PHD",
] as const;

export async function updateGraduateProfile(formData: FormData) {
  const session = await requireGraduate();

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const qualification = String(formData.get("qualification") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (name.length < 2) {
    throw new Error("Please enter your full name.");
  }

  if (
    qualification &&
    !qualifications.includes(
      qualification as (typeof qualifications)[number],
    )
  ) {
    throw new Error("Invalid qualification selected.");
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name,
    },
  });

  await prisma.profile.upsert({
    where: {
      userId: session.user.id,
    },
    update: {
      phone: phone || null,
      location: location || null,
      qualification: qualification
        ? (qualification as (typeof qualifications)[number])
        : null,
      bio: bio || null,
    },
    create: {
      userId: session.user.id,
      phone: phone || null,
      location: location || null,
      qualification: qualification
        ? (qualification as (typeof qualifications)[number])
        : null,
      bio: bio || null,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/settings");
}
