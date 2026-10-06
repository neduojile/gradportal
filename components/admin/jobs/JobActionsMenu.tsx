"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Eye,
  Lock,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
  Unlock,
} from "lucide-react";
import { Menu } from "@base-ui/react/menu";
import type { Job } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  deleteJob,
  duplicateJob,
  toggleFeaturedJob,
  toggleJobStatus,
} from "@/app/admin/jobs/actions";

type Props = {
  job: Job;
};

export default function JobActionsMenu({ job }: Props) {
  const [loading, setLoading] = useState(false);

  async function runAction(
    action: () => Promise<void>,
    successMessage: string,
  ) {
    try {
      setLoading(true);
      await action();
      toast.success(successMessage);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${job.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    await runAction(() => deleteJob(job.id), "Job deleted successfully.");
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        disabled={loading}
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          />
        }
      >
        <MoreHorizontal className="h-5 w-5" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner
          sideOffset={8}
          align="end"
          className="z-50 outline-none"
        >
          <Menu.Popup className="w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl outline-none">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Job Actions
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                {job.title}
              </p>
            </div>

            <div className="my-2 h-px bg-slate-100" />

            <Menu.Item
              render={
                <Link
                  href={`/admin/jobs/${job.id}`}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 data-highlighted:bg-slate-50"
                />
              }
            >
              <Eye className="h-4 w-4 text-slate-500" />
              View Job
            </Menu.Item>

            <Menu.Item
              render={
                <Link
                  href={`/admin/jobs/${job.id}/edit`}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 data-highlighted:bg-slate-50"
                />
              }
            >
              <Pencil className="h-4 w-4 text-slate-500" />
              Edit Job
            </Menu.Item>

            <Menu.Separator className="my-2 h-px bg-slate-100" />

            <Menu.Item
              onClick={() =>
                runAction(
                  () => toggleFeaturedJob(job.id),
                  job.featured
                    ? "Job removed from featured listings."
                    : "Job featured successfully.",
                )
              }
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition data-highlighted:bg-amber-50 data-highlighted:text-amber-700"
            >
              <Star
                className={`h-4 w-4 ${
                  job.featured
                    ? "fill-amber-400 text-amber-400"
                    : "text-amber-500"
                }`}
              />
              {job.featured ? "Remove Feature" : "Feature Job"}
            </Menu.Item>

            <Menu.Item
              onClick={() =>
                runAction(
                  () => duplicateJob(job.id),
                  "Job duplicated successfully.",
                )
              }
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition data-highlighted:bg-slate-50"
            >
              <Copy className="h-4 w-4 text-slate-500" />
              Duplicate Job
            </Menu.Item>

            <Menu.Item
              onClick={() =>
                runAction(
                  () => toggleJobStatus(job.id),
                  job.status === "OPEN"
                    ? "Job closed successfully."
                    : "Job reopened successfully.",
                )
              }
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition data-highlighted:bg-slate-50"
            >
              {job.status === "OPEN" ? (
                <>
                  <Lock className="h-4 w-4 text-slate-500" />
                  Close Job
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 text-emerald-500" />
                  Reopen Job
                </>
              )}
            </Menu.Item>

            <Menu.Separator className="my-2 h-px bg-slate-100" />

            <Menu.Item
              onClick={handleDelete}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 outline-none data-highlighted:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Job
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
