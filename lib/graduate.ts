import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireGraduate() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "GRADUATE") {
    redirect("/admin");
  }

  return session;
}
