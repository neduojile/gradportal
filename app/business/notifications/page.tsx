import { prisma } from "@/lib/prisma";
import { requireBusiness } from "@/lib/business";
import { NotificationPanel } from "@/components/dashboard/notification-panel";

export default async function BusinessNotificationsPage() {
  const session = await requireBusiness();

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Company verification, job approvals, and important Employa updates.
        </p>
      </div>
      <NotificationPanel notifications={notifications} />
    </main>
  );
}
