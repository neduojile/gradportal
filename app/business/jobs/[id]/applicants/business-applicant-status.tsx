"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, ChevronDown, LoaderCircle, Search, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApplicationStatus } from "@prisma/client";
import { updateBusinessApplicationStatus } from "@/lib/actions/application.actions";

const actions: {
  status: ApplicationStatus;
  label: string;
  icon: typeof Search;
}[] = [
  { status: "UNDER_REVIEW", label: "Move to under review", icon: Search },
  { status: "SHORTLISTED", label: "Shortlist applicant", icon: CheckCircle2 },
  { status: "ACCEPTED", label: "Accept applicant", icon: CheckCircle2 },
  { status: "REJECTED", label: "Reject application", icon: XCircle },
];

export default function BusinessApplicantStatus({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

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

  function updateStatus(status: ApplicationStatus) {
    setMenuOpen(false);
    setMessage("");

    startTransition(async () => {
      try {
        const result = await updateBusinessApplicationStatus(applicationId, status);

        if (!result.success) {
          setMessage(result.error ?? "Could not update the application.");
          return;
        }

        setMessage(result.message ?? "Application updated.");
        router.refresh();
      } catch {
        setMessage("Something went wrong. Please try again.");
      }
    });
  }

  if (available.length === 0) {
    return (
      <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        Final status
      </span>
    );
  }

  const PrimaryIcon = available[0].icon;

  return (
    <div className="relative min-w-48">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => updateStatus(available[0].status)}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : <PrimaryIcon className="size-4" />}
          {pending ? "Updating..." : available[0].label}
        </button>

        {available.length > 1 && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl border border-slate-200 px-3 text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            aria-label="More status options"
          >
            <ChevronDown className="size-4" />
          </button>
        )}
      </div>

      {menuOpen && (
        <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {available.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.status}
                type="button"
                onClick={() => updateStatus(action.status)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-slate-50 ${
                  action.status === "REJECTED" ? "text-red-600" : "text-slate-700"
                }`}
              >
                <Icon className="size-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {message && <p className="mt-2 text-xs text-slate-500">{message}</p>}
    </div>
  );
}

