import {
  Bell,
  CheckCheck,
  Clock3,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "./actions";

export default async function NotificationsPage() {
  const session = await requireGraduate();

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const unread = notifications.filter((notification) => !notification.isRead).length;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/60 p-7 shadow-xl backdrop-blur-3xl dark:bg-zinc-900/60 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-300">
              <Bell className="size-3.5" />
              Activity center
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Notifications
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Stay updated on your applications and Employa activity.
            </p>
          </div>

          {unread > 0 ? (
            <form action={markAllNotificationsRead}>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm font-semibold transition hover:border-orange-300 hover:bg-orange-500/5"
              >
                <CheckCheck className="size-4" />
                Mark all as read
              </button>
            </form>
          ) : null}
        </div>

        <div className="relative mt-7 flex flex-wrap gap-3">
          <div className="rounded-2xl border border-border/50 bg-background/60 px-4 py-3">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 text-xl font-bold">{notifications.length}</p>
          </div>

          <div className="rounded-2xl border border-orange-200/50 bg-orange-500/5 px-4 py-3">
            <p className="text-xs text-muted-foreground">Unread</p>
            <p className="mt-1 text-xl font-bold text-orange-500">{unread}</p>
          </div>
        </div>
      </section>

      {notifications.length === 0 ? (
        <section className="flex min-h-[400px] flex-col items-center justify-center rounded-[32px] border border-dashed border-border/70 bg-white/50 px-6 text-center shadow-lg backdrop-blur-xl dark:bg-zinc-900/40">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
            <Sparkles className="size-9" />
          </div>

          <h2 className="mt-6 text-2xl font-bold">You are all caught up</h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            New application updates and important Employa activity will appear here.
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-[32px] border border-white/20 bg-white/60 shadow-xl backdrop-blur-xl dark:bg-zinc-900/50">
          <div className="divide-y divide-border/50">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 p-5 transition sm:p-6 ${
                  notification.isRead
                    ? "bg-transparent"
                    : "bg-orange-500/[0.045]"
                }`}
              >
                <div
                  className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    notification.isRead
                      ? "bg-muted text-muted-foreground"
                      : "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  }`}
                >
                  <Bell className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">
                          {notification.title}
                        </h2>

                        {!notification.isRead ? (
                          <span className="h-2 w-2 rounded-full bg-orange-500" />
                        ) : null}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.isRead ? (
                      <form action={markNotificationRead.bind(null, notification.id)}>
                        <button
                          type="submit"
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-500/10"
                        >
                          <CheckCheck className="size-3.5" />
                          Mark read
                        </button>
                      </form>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {notification.createdAt.toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
