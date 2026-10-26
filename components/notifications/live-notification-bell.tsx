"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, X, ArrowUpRight } from "lucide-react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link: string | null;
  type: string;
};

export default function LiveNotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });
      if (!response.ok) return;

      const data = await response.json();
      setItems(data.notifications ?? []);
      setUnread(data.unreadCount ?? 0);
    } catch {
      // Keep the last successful notification state during temporary errors.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 10000);
    const onFocus = () => void refresh();

    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  async function markRead(id: string) {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setItems((current) =>
        current.map((item) => item.id === id ? { ...item, isRead: true } : item),
      );
      setUnread((count) => Math.max(0, count - 1));
    }
  }

  async function markAllRead() {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });

    if (response.ok) {
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnread(0);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        className="relative flex size-11 items-center justify-center rounded-2xl border border-black/5 bg-white/80 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 active:scale-95 dark:border-white/10 dark:bg-zinc-900/70 dark:hover:bg-zinc-800"
      >
        <Bell className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-1 text-[10px] font-black leading-none text-white shadow-lg shadow-orange-500/30">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <section className="absolute right-0 top-14 z-50 w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/15 dark:border-white/10 dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white p-4 dark:border-white/10 dark:from-orange-950/30 dark:to-zinc-950">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Notifications</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {unread ? `${unread} unread update${unread === 1 ? "" : "s"}` : "You're all caught up"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={() => void markAllRead()}
                    title="Mark all as read"
                    className="rounded-xl p-2 text-orange-600 transition hover:bg-orange-100 dark:hover:bg-orange-500/15"
                  >
                    <CheckCheck className="size-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-2">
              {loading ? (
                <p className="p-6 text-center text-sm text-slate-500">Loading updates…</p>
              ) : items.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto size-8 text-orange-400" />
                  <p className="mt-3 font-semibold">Nothing new yet</p>
                  <p className="mt-1 text-sm text-slate-500">Your important updates will appear here.</p>
                </div>
              ) : items.map((item) => (
                <div
                  key={item.id}
                  className={`mb-1 flex gap-3 rounded-2xl p-3 transition ${
                    item.isRead
                      ? "hover:bg-slate-50 dark:hover:bg-zinc-900"
                      : "bg-orange-50/80 dark:bg-orange-500/[0.08]"
                  }`}
                >
                  <span className={`mt-1 size-2 shrink-0 rounded-full ${item.isRead ? "bg-slate-300" : "bg-orange-500"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-slate-600 dark:text-zinc-400">{item.message}</p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => {
                          if (!item.isRead) void markRead(item.id);
                          setOpen(false);
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                      >
                        View update <ArrowUpRight className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block border-t border-slate-100 p-3 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:border-white/10 dark:hover:bg-orange-500/10"
            >
              View all notifications
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
