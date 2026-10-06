"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react";

import { submitApplication } from "@/app/jobs/[id]/apply/actions";

const MIN_LENGTH = 20;
const MAX_LENGTH = 5000;

export default function ApplyForm({
  jobId,
}: {
  jobId: string;
}) {
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const characterCount = coverLetter.length;
  const minimumMet = characterCount >= MIN_LENGTH;
  const remaining = Math.max(MIN_LENGTH - characterCount, 0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmed = coverLetter.trim();

    if (trimmed.length < MIN_LENGTH) {
      setError(
        `Please write at least ${MIN_LENGTH} characters before submitting.`,
      );
      return;
    }

    if (trimmed.length > MAX_LENGTH) {
      setError(
        `Your cover letter cannot exceed ${MAX_LENGTH.toLocaleString()} characters.`,
      );
      return;
    }

    const formData = new FormData();
    formData.set("coverLetter", trimmed);

    startTransition(async () => {
      const result = await submitApplication(jobId, formData);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`overflow-hidden rounded-[24px] border bg-white ${
          error
            ? "border-red-300 ring-4 ring-red-500/5"
            : "border-slate-200 focus-within:ring-4 focus-within:ring-orange-500/10"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText className="size-4 text-orange-500" />
            Cover letter
          </div>

          <span
            className={`text-xs font-semibold ${
              characterCount > MAX_LENGTH
                ? "text-red-500"
                : minimumMet
                  ? "text-emerald-600"
                  : "text-slate-400"
            }`}
          >
            {characterCount.toLocaleString()} /{" "}
            {MAX_LENGTH.toLocaleString()}
          </span>
        </div>

        <textarea
          name="coverLetter"
          value={coverLetter}
          onChange={(event) => setCoverLetter(event.target.value)}
          disabled={isPending}
          rows={13}
          maxLength={MAX_LENGTH}
          placeholder={`Tell ${"the employer"} why you are interested in this role, what experience you bring, and what makes you a strong candidate...`}
          className="min-h-[280px] w-full resize-y bg-white px-5 py-5 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {minimumMet
              ? "Your cover letter meets the minimum length."
              : `${remaining} more character${remaining === 1 ? "" : "s"} recommended to continue.`}
          </p>

          {minimumMet && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="size-3.5" />
              Ready to submit
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
            !
          </span>

          <p className="text-sm leading-5 text-red-700">
            {error}
          </p>
        </div>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-orange-500" />

        <p className="text-xs leading-5 text-slate-500">
          By submitting, you confirm that the information in your
          application is accurate and that you are applying for this role
          intentionally.
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/jobs/${jobId}`}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600"
        >
          Save and go back
        </Link>

        <button
          type="submit"
          disabled={isPending || !minimumMet}
          className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-slate-300 disabled:shadow-none"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting application...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Submit application
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

