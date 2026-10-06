"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import { updateApplicationStatus } from "../actions";

const actions = [
  {
    status: "UNDER_REVIEW",
    label: "Move to under review",
    icon: Search,
  },
  {
    status: "SHORTLISTED",
    label: "Shortlist candidate",
    icon: CheckCircle2,
  },
  {
    status: "ACCEPTED",
    label: "Accept candidate",
    icon: CheckCircle2,
  },
  {
    status: "REJECTED",
    label: "Reject application",
    icon: XCircle,
  },
] as const;

export default function StatusActions({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus:
    | "PENDING"
    | "UNDER_REVIEW"
    | "SHORTLISTED"
    | "ACCEPTED"
    | "REJECTED";
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const available = actions.filter((action) => {
    if (currentStatus === "PENDING") {
      return ["UNDER_REVIEW", "REJECTED"].includes(action.status);
    }

    if (currentStatus === "UNDER_REVIEW") {
      return ["SHORTLISTED", "REJECTED"].includes(action.status);
    }

    if (currentStatus === "SHORTLISTED") {
      return ["ACCEPTED", "REJECTED"].includes(action.status);
    }

    return false;
  });

  function handleChange(status: (typeof actions)[number]["status"]) {
    setOpen(false);
    setMessage("");

    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, status);

      if (!result.success) {
        setMessage(result.error ?? "Unable to update application.");
        return;
      }

      setMessage(result.message ?? "Application updated.");
    });
  }

  if (available.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
        This application has reached a final status.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => handleChange(available[0].status)}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            (() => {
              const Icon = available[0].icon;
              return <Icon className="h-4 w-4" />;
            })()
          )}
          {pending ? "Updating..." : available[0].label}
        </button>

        {available.length > 1 && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            aria-label="More application actions"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-12 z-20 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {available.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.status}
                type="button"
                onClick={() => handleChange(action.status)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                  action.status === "REJECTED"
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {message && (
        <p className="mt-2 text-xs font-medium text-slate-500">{message}</p>
      )}
    </div>
  );
}
