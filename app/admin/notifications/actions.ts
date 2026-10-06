"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function sendGraduateAnnouncement(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (title.length < 3) {
    redirect("/admin/notifications?error=title");
  }

  if (message.length < 5) {
    redirect("/admin/notifications?error=message");
  }

  const graduates = await prisma.user.findMany({
    where: {
      role: "GRADUATE",
    },
    select: {
      id: true,
    },
  });

  if (graduates.length === 0) {
    redirect("/admin/notifications?error=no-graduates");
  }

  await prisma.notification.createMany({
    data: graduates.map((graduate) => ({
      userId: graduate.id,
      title,
      message,
      isRead: false,
    })),
  });

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  revalidatePath("/admin/notifications");

  redirect(
    `/admin/notifications?sent=${graduates.length}`,
  );
}
