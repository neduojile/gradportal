import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 15,
    select: {
      id: true,
      title: true,
      message: true,
      isRead: true,
      link: true,
      type: true,
      createdAt: true,
    },
  });

  const unread = notifications.filter((item) => !item.isRead).length;

  return NextResponse.json(
    { notifications, unread },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
