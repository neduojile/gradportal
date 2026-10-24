"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/lib/email";

export async function registerUser(formData: unknown) {
  const validatedFields = registerSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const { name, email, password, role, companyName } = validatedFields.data;
  const normalizedEmail = email.toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role,
        },
      });

      if (role === "BUSINESS_OWNER") {
        await tx.businessProfile.create({
          data: {
            userId: user.id,
            companyName: companyName!,
            businessEmail: normalizedEmail,
            verificationStatus: "PENDING",
          },
        });
      }
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "Welcome to Employa",
      text: `Hi ${name},\n\nYour Employa account has been created successfully. You can sign in at ${process.env.APP_URL ?? "http://localhost:3000"}.`,
    });

    return {
      success: true,
      message:
        role === "BUSINESS_OWNER"
          ? "Business account created. Complete your business verification after signing in."
          : "Account created successfully. You can now sign in.",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "An account with these details already exists.",
      };
    }

    console.error("Registration failed:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
