"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const businessProfileSchema = z.object({
  companyName: z.string().trim().min(2, "Enter your company name.").max(120),
  registrationNumber: z.string().trim().max(100).optional(),
  industry: z.string().trim().max(100).optional(),
  description: z.string().trim().max(3000).optional(),
  website: z.string().trim().max(255).optional(),
  businessEmail: z.string().trim().email("Enter a valid business email.").max(255),
  businessPhone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(255).optional(),
});

function optionalValue(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
}

export async function saveBusinessProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Please sign in to continue." };
  }

  if (session.user.role !== "BUSINESS_OWNER") {
    return { success: false, message: "Only business owners can update this profile." };
  }

  const parsed = businessProfileSchema.safeParse({
    companyName: formData.get("companyName"),
    registrationNumber: optionalValue(formData.get("registrationNumber")),
    industry: optionalValue(formData.get("industry")),
    description: optionalValue(formData.get("description")),
    website: optionalValue(formData.get("website")),
    businessEmail: formData.get("businessEmail"),
    businessPhone: optionalValue(formData.get("businessPhone")),
    address: optionalValue(formData.get("address")),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please check the information entered.",
    };
  }

  const values = parsed.data;

  if (values.website) {
    try {
      const url = new URL(
        /^https?:\/\//i.test(values.website)
          ? values.website
          : `https://${values.website}`,
      );

      if (!url.hostname.includes(".")) {
        throw new Error("Invalid website");
      }

      values.website = url.toString();
    } catch {
      return {
        success: false,
        message: "Enter a valid company website, such as https://example.com.",
      };
    }
  }

  try {
    const existing = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        companyName: true,
        registrationNumber: true,
        verificationStatus: true,
      },
    });

    const identityDetailsChanged =
      !!existing &&
      (existing.companyName.trim() !== values.companyName.trim() ||
        (existing.registrationNumber ?? "").trim() !==
          (values.registrationNumber ?? "").trim());

    const shouldResetVerification =
      existing?.verificationStatus === "VERIFIED" && identityDetailsChanged;

    await prisma.businessProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName: values.companyName,
        registrationNumber: values.registrationNumber,
        industry: values.industry,
        description: values.description,
        website: values.website,
        businessEmail: values.businessEmail,
        businessPhone: values.businessPhone,
        address: values.address,
        verificationStatus: "PENDING",
      },
      update: {
        companyName: values.companyName,
        registrationNumber: values.registrationNumber,
        industry: values.industry,
        description: values.description,
        website: values.website,
        businessEmail: values.businessEmail,
        businessPhone: values.businessPhone,
        address: values.address,
        ...(shouldResetVerification
          ? { verificationStatus: "PENDING" as const, verifiedAt: null }
          : {}),
      },
    });

    revalidatePath("/business");
    revalidatePath("/business/profile");

    return {
      success: true,
      message: shouldResetVerification
        ? "Profile saved. Your company identity changes require verification again."
        : "Company profile saved successfully.",
    };
  } catch (error) {
    console.error("Saving business profile failed:", error);

    return {
      success: false,
      message: "Unable to save your profile right now. Please try again.",
    };
  }
}
