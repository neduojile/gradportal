"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, XCircle } from "lucide-react";
import { closeBusinessJob } from "@/lib/actions/business-job.actions";

export default function CloseBusinessJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClose() {
    const confirmed = window.confirm(
      "Close this job listing? Graduates will no longer be able to apply."
    );

    if (!confirmed) return;

    setError("");

    startTransition(async () => {
      try {
        const result = await closeBusinessJob(jobId);

        if (!result.success) {
          setError(result.message);
          return;
        }

        router.refresh();
      } catch {
        setError("Unable to close this listing. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClose}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <XCircle className="size-4" />
        )}
        {isPending ? "Closing listing..." : "Close listing"}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
