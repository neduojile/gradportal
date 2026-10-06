import {
  Bell,
  CheckCircle2,
  Megaphone,
  Send,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendGraduateAnnouncement } from "./actions";

interface AdminNotificationsPageProps {
  searchParams: Promise<{
    sent?: string;
    error?: string;
  }>;
}

export default async function AdminNotificationsPage({
  searchParams,
}: AdminNotificationsPageProps) {
  await requireAdmin();

  const params = await searchParams;

  const [graduateCount, notificationCount, unreadCount, recent] =
    await Promise.all([
      prisma.user.count({
        where: {
          role: "GRADUATE",
        },
      }),

      prisma.notification.count(),

      prisma.notification.count({
        where: {
          isRead: false,
        },
      }),

      prisma.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 30,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

  const sentCount = params.sent
    ? Number.parseInt(params.sent, 10)
    : 0;

  const errorMessage =
    params.error === "title"
      ? "Please provide a notification title."
      : params.error === "message"
        ? "Please provide a notification message."
        : params.error === "no-graduates"
          ? "There are no graduates to notify."
          : null;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 p-7 text-white shadow-xl shadow-orange-500/10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2 text-orange-100">
            <Bell className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Platform communication
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Notifications
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-orange-50 md:text-base">
            Send important announcements directly to graduates and monitor
            notification activity across Employa.
          </p>
        </div>
      </section>

      {sentCount > 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-700 dark:border-emerald-900 dark:text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          Announcement sent successfully to {sentCount} graduate
          {sentCount === 1 ? "" : "s"}.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-500/10 px-5 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Graduates
              </p>
              <p className="mt-2 text-3xl font-bold">
                {graduateCount}
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Users className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Notifications
              </p>
              <p className="mt-2 text-3xl font-bold">
                {notificationCount}
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Bell className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Unread
              </p>
              <p className="mt-2 text-3xl font-bold">
                {unreadCount}
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Megaphone className="size-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[24px] border bg-background p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <Megaphone className="size-5" />
              </div>

              <div>
                <h2 className="font-bold">Send announcement</h2>
                <p className="text-xs text-muted-foreground">
                  Reaches all registered graduates
                </p>
              </div>
            </div>
          </div>

          <form action={sendGraduateAnnouncement} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                required
                minLength={3}
                maxLength={120}
                placeholder="Important Employa update"
                className="h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                required
                minLength={5}
                maxLength={1000}
                rows={6}
                placeholder="Write your announcement..."
                className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm leading-6 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10"
              />
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
              This notification will be delivered to all{" "}
              <span className="font-semibold text-foreground">
                {graduateCount}
              </span>{" "}
              registered graduates.
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              <Send className="size-4" />
              Send to all graduates
            </button>
          </form>
        </div>

        <div className="rounded-[24px] border bg-background p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-bold">Recent activity</h2>
            <p className="text-sm text-muted-foreground">
              Latest notifications delivered across the platform.
            </p>
          </div>

          <div className="space-y-3">
            {recent.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-10 text-center">
                <Bell className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">
                  No notifications yet
                </p>
              </div>
            ) : (
              recent.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border p-4"
                >
                  <div className="flex gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                      <Bell className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <p className="font-semibold">
                          {notification.title}
                        </p>

                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(notification.createdAt)}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        To:{" "}
                        <span className="font-medium text-foreground">
                          {notification.user.name ||
                            notification.user.email}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
