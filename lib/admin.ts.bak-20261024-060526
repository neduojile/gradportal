import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await auth();

  if (!session || !session.user.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const account = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true, role: true },
  });

  if (!account || !account.isActive || account.role !== "ADMIN") {
    redirect("/login?error=AccountInactive");
  }

  return session;
}
