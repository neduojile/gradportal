"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    const redirectTo =
      user?.role === "ADMIN"
        ? "/admin"
        : user?.role === "BUSINESS_OWNER"
          ? "/business"
          : "/dashboard";

    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password." };
      }

      return { error: "Something went wrong. Please try again." };
    }

    throw error;
  }
}
