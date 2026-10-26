"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ExternalLink, X } from "lucide-react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  type: string;
  createdAt: string;
};

export default function LiveNotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      setItems(data.notifications ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      // Keep the existing notifications if the network is temporarily unavailable.
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 10000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  async function markRead(id: string) {
    const response = await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) await refresh();
  }

  async function markAllRead() {
    const response = await fetch("/api/notifications/read", {
      method: "PUT",
    });
    if (response.ok) await refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        className="relative flex size-11 items-center justify-center rounded-2xl border border-orange-100 bg-white text-slate-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-orange-600 px-1.5 py-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-20 z-[100] mx-auto max-w-md overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl shadow-slate-950/15 sm:absolute sm:inset-x-auto sm:right-0 sm:top-14 sm:w-[390px] dark:border-white/10 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-white/10">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Notifications</h2>
              <p className="text-xs text-slate-500">{unread} unread updates</p>
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={() => void markAllRead()} className="rounded-lg p-2 text-orange-600 hover:bg-orange-50" title="Mark all as read">
                  <CheckCheck className="size-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close notifications">
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[65vh] overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Bell className="mx-auto mb-3 size-8 text-orange-500" />
                <p className="font-semibold">You're all caught up</p>
                <p className="mt-1 text-sm text-slate-500">New updates will appear here automatically.</p>
              </div>
            ) : items.map((item) => (
              <div key={item.id} className={`mb-1 flex gap-3 rounded-2xl p-3 ${item.isRead ? "" : "bg-orange-50/80 dark:bg-orange-500/10"}`}>
                <span className="mt-1 size-2 shrink-0 rounded-full bg-orange-500" style={{ opacity: item.isRead ? 0 : 1 }} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-zinc-300">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {item.link && (
                      <Link onClick={() => { if (!item.isRead) void markRead(item.id); setOpen(false); }} href={item.link} className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700">
                        View update <ExternalLink className="size-3" />
                      </Link>
                    )}
                    {!item.isRead && (
                      <button onClick={() => void markRead(item.id)} className="text-xs font-medium text-slate-500 hover:text-orange-600">
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/notifications" onClick={() => setOpen(false)} className="block border-t border-slate-100 p-3 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:border-white/10 dark:hover:bg-white/5">
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
