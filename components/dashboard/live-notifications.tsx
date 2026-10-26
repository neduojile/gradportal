"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, X, ArrowUpRight } from "lucide-react";

type Notice = {
  id: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

export default function LiveNotifications() {
  const [items, setItems] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setItems(Array.isArray(data.notifications) ? data.notifications : []);
      }
    } catch {
      // Keep the last successful notification state.
    }
  }

  async function markRead(id: string) {
    setBusy(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setItems((current) =>
          current.map((item) => item.id === id ? { ...item, isRead: true } : item)
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function markAllRead() {
    setBusy(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (response.ok) {
        setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      }
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const unread = items.filter((item) => !item.isRead).length;

  return (
    <div className="fixed right-4 top-4 z-[100] sm:right-6 sm:top-6">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open notifications"
        className="relative flex size-12 items-center justify-center rounded-2xl border border-orange-200 bg-white text-slate-800 shadow-xl shadow-orange-950/10 transition hover:-translate-y-0.5 hover:border-orange-400 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-1 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <section className="absolute right-0 mt-3 w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 dark:border-white/10 dark:bg-zinc-950">
          <header className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-white/10">
            <div>
              <h2 className="font-bold text-slate-950 dark:text-white">Notifications</h2>
              <p className="mt-1 text-xs text-slate-500">
                {unread ? `${unread} unread updates` : "You're all caught up"}
              </p>
            </div>
            <div className="flex gap-2">
              {unread > 0 && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void markAllRead()}
                  title="Mark all as read"
                  className="rounded-xl p-2 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                >
                  <CheckCheck className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
            </div>
          </header>

          <div className="max-h-[65vh] overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto mb-3 size-8 text-orange-400" />
                <p className="font-medium">No notifications yet</p>
                <p className="mt-1 text-sm text-slate-500">Your important updates will appear here.</p>
              </div>
            ) : items.slice(0, 20).map((item) => (
              <article
                key={item.id}
                className={`mb-1 rounded-2xl p-3 ${item.isRead ? "" : "bg-orange-50/80 dark:bg-orange-500/10"}`}
              >
                <div className="flex gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-orange-500" style={{ opacity: item.isRead ? 0 : 1 }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-slate-600 dark:text-zinc-300">{item.message}</p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {item.link && (
                        <Link
                          href={item.link}
                          onClick={() => { if (!item.isRead) void markRead(item.id); setOpen(false); }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                        >
                          View update <ArrowUpRight className="size-3" />
                        </Link>
                      )}
                      {!item.isRead && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void markRead(item.id)}
                          className="text-xs font-medium text-slate-500 hover:text-orange-600"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <footer className="border-t border-slate-100 p-3 text-center dark:border-white/10">
            <Link href="/notifications" onClick={() => setOpen(false)} className="text-sm font-semibold text-orange-600">
              View all notifications
            </Link>
          </footer>
        </section>
      )}
    </div>
  );
}
