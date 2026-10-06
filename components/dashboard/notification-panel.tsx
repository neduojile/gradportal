import { Bell } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString();
}

interface NotificationPanelProps {
  notifications: {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }[];
}

export function NotificationPanel({
  notifications,
}: NotificationPanelProps) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>

        <CardDescription>
          Your latest updates.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <p className="font-medium">You are all caught up!</p>

            <p className="mt-2 text-sm text-muted-foreground">
              You do not have any notifications yet.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 rounded-2xl border p-4 ${
                !notification.isRead
                  ? "border-orange-200 bg-orange-50/50"
                  : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                <Bell className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">
                    {notification.title}
                  </h3>

                  {!notification.isRead && (
                    <span className="mt-1 size-2.5 shrink-0 rounded-full bg-orange-500" />
                  )}
                </div>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

