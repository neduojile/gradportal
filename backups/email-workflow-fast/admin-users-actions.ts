"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

async function recordAudit(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  details: string,
) {
  await prisma.auditLog.create({
    data: { actorId, action, targetType, targetId, details },
  });
}

export async function reviewBusinessVerification(
  businessId: string,
  decision: "VERIFIED" | "REJECTED",
  reason?: string,
) {
  const admin = await requireAdmin();
  const notes = (reason ?? "").trim();

  if (decision === "REJECTED" && !notes) {
    throw new Error("Provide a reason for rejecting this business.");
  }

  if (notes.length > 2000) {
    throw new Error("The review reason must be 2,000 characters or fewer.");
  }

  const business = await prisma.businessProfile.findUnique({
    where: { id: businessId },
    select: { id: true, userId: true, companyName: true, verificationStatus: true },
  });

  if (!business) throw new Error("Business profile not found.");

  await prisma.$transaction(async (tx) => {
    await tx.businessProfile.update({
      where: { id: businessId },
      data: {
        verificationStatus: decision,
        verifiedAt: decision === "VERIFIED" ? new Date() : null,
      },
    });

    await tx.notification.create({
      data: {
        userId: business.userId,
        title: decision === "VERIFIED"
          ? "Business verified"
          : "Business verification rejected",
        message: decision === "VERIFIED"
          ? `${business.companyName} has been verified. You can now submit job listings.`
          : `Verification for ${business.companyName} was rejected. Reason: ${notes}`,
        link: "/business/profile",
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: admin.user.id,
        action: decision === "VERIFIED" ? "BUSINESS_VERIFIED" : "BUSINESS_VERIFICATION_REJECTED",
        targetType: "BUSINESS",
        targetId: business.id,
        details: decision === "VERIFIED"
          ? `Verified business: ${business.companyName}`
          : `Rejected business: ${business.companyName}. Reason: ${notes}`,
      },
    });
  });

  for (const path of ["/admin", "/admin/users", "/admin/jobs", "/business", "/business/profile"]) {
    revalidatePath(path);
  }

  return { success: true };
}

export async function toggleAccountActive(userId: string) {
  const admin = await requireAdmin();

  if (admin.user.id === userId) {
    throw new Error("You cannot deactivate your own admin account.");
  }

  const account = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  if (!account) throw new Error("Account not found.");
  if (account.role === "ADMIN") {
    throw new Error("Admin accounts cannot be changed from this page.");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !account.isActive },
    select: { isActive: true },
  });

  await recordAudit(
    admin.user.id,
    updated.isActive ? "ACCOUNT_ACTIVATED" : "ACCOUNT_DEACTIVATED",
    "USER",
    userId,
    `${updated.isActive ? "Activated" : "Deactivated"} account: ${account.email}`,
  );

  await prisma.notification.create({
    data: {
      userId,
      title: updated.isActive ? "Account activated" : "Account deactivated",
      message: updated.isActive
        ? "Your Employa account has been activated."
        : "Your Employa account has been deactivated by an administrator. Contact support if you believe this is an error.",
      link: "/dashboard",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");

  return { success: true, isActive: updated.isActive };
}
