import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireGraduate() {
  const session = await auth();

  if (!session || !session.user.id) {
    redirect("/login");
  }

  if (session.user.role !== "GRADUATE") {
    redirect("/admin");
  }

  const account = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true, role: true },
  });

  if (!account || !account.isActive) {
    redirect("/login?error=AccountInactive");
  }

  if (account.role !== "GRADUATE") {
    redirect("/login");
  }

  return session;
}
