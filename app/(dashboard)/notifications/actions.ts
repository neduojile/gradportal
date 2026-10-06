"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";

export async function markNotificationRead(notificationId: string) {
  const session = await requireGraduate();

  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const session = await requireGraduate();

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}
