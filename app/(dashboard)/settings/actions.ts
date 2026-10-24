"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Please sign in again.");
  }

  return session.user.id;
}

export async function getNotificationPreferences() {
  await requireUserId();

  return {
    applicationUpdates: true,
    platformUpdates: true,
    messageUpdates: true,
    interviewUpdates: true,
  };
}

export async function saveNotificationPreference(
  key: string,
  value: boolean,
) {
  await requireUserId();

  const allowedKeys = [
    "applicationUpdates",
    "platformUpdates",
    "messageUpdates",
    "interviewUpdates",
  ] as const;

  if (
    typeof value !== "boolean" ||
    !allowedKeys.includes(key as (typeof allowedKeys)[number])
  ) {
    return { success: false, message: "Invalid preference." };
  }

  return { success: true };
}
export async function changeAccountPassword(formData: FormData) {
  const userId = await requireUserId();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Complete all password fields." };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "Your new password must contain at least 8 characters.",
    };
  }

  if (newPassword.length > 128) {
    return { success: false, message: "The new password is too long." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "The new passwords do not match." };
  }

  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "Choose a password different from your current one.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user?.password) {
    return {
      success: false,
      message: "This account has no password. Use your account's sign-in method.",
    };
  }

  const matches = await bcrypt.compare(currentPassword, user.password);

  if (!matches) {
    return { success: false, message: "Your current password is incorrect." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  revalidatePath("/dashboard/settings");

  return { success: true, message: "Password changed successfully." };
}

