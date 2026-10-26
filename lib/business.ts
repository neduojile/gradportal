import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireBusiness() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "BUSINESS_OWNER") {
    redirect("/dashboard");
  }

  return session;
}
