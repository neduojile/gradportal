"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

import { toggleSavedJob } from "@/app/jobs/actions";

export default function SaveJobButton({
  jobId,
  initiallySaved,
}: {
  jobId: string;
  initiallySaved: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const previous = saved;
    setSaved(!previous);

    startTransition(async () => {
      try {
        await toggleSavedJob(jobId);
      } catch {
        setSaved(previous);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={saved ? "Remove saved job" : "Save job"}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 ${
        saved
          ? "border-orange-200 bg-orange-50 text-orange-600"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      {saved ? (
        <BookmarkCheck className="size-4" />
      ) : (
        <Bookmark className="size-4" />
      )}

      {pending ? "Saving..." : saved ? "Saved" : "Save job"}
    </button>
  );
}

