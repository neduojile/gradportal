"use server";

import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Enter a valid email address." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true },
  });

  // Use the same response whether or not the account exists.
  const message = "If an account with that email exists, a reset link will be sent.";

  if (!user?.password) {
    return { success: true, message };
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const sent = await sendEmail({
    to: user.email,
    subject: "Reset your Employa password",
    text: `Hi ${user.name},\n\nWe received a request to reset your Employa password. This link expires in 30 minutes:\n\n${appUrl}/reset-password?token=${rawToken}\n\nIf you did not request this, you can ignore this email.`,
  });

  if (!sent) {
    await prisma.passwordResetToken.deleteMany({ where: { tokenHash } });
    return {
      success: false,
      message: "We couldn't send the reset email. Please try again later.",
    };
  }

  return { success: true, message };
}

export async function resetPassword(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!/^[a-f0-9]{64}$/.test(token)) {
    return { success: false, message: "This reset link is invalid or expired." };
  }

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match." };
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true },
  });

  if (!record || record.expiresAt <= new Date()) {
    if (record) {
      await prisma.passwordResetToken.delete({ where: { id: record.id } });
    }
    return { success: false, message: "This reset link is invalid or expired. Request a new one." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Consume the token and update the password in one transaction.
  const result = await prisma.$transaction(async (tx) => {
    const consumed = await tx.passwordResetToken.deleteMany({
      where: {
        id: record.id,
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (consumed.count !== 1) return false;

    await tx.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    });

    await tx.passwordResetToken.deleteMany({
      where: { userId: record.userId },
    });

    return true;
  });

  if (!result) {
    return { success: false, message: "This reset link is invalid or expired. Request a new one." };
  }

  return {
    success: true,
    message: "Your password has been reset. You can now sign in.",
  };
}
