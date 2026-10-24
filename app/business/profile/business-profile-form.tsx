"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  LoaderCircle,
  Save,
  ShieldAlert,
} from "lucide-react";

import { saveBusinessProfile } from "@/lib/actions/business-profile.actions";

type ProfileValues = {
  companyName: string;
  registrationNumber: string;
  industry: string;
  description: string;
  website: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
};

type DocumentItem = {
  id: string;
  type: string;
  fileUrl: string;
  originalFilename: string | null;
  verificationStatus: string;
  createdAt: string;
  adminNotes: string | null;
};

type Props = {
  initialValues: ProfileValues;
  verificationStatus: string;
  verifiedAt: string | null;
  documents: DocumentItem[];
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

const labelClass = "block text-sm font-semibold text-slate-800";

function readableStatus(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function BusinessProfileForm({
  initialValues,
  verificationStatus,
  verifiedAt,
  documents,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setMessage("");
    setSuccess(false);

    startTransition(async () => {
      const result = await saveBusinessProfile(formData);

      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        router.refresh();
      }
    });
  }

  const verified = verificationStatus === "VERIFIED";
  const rejected = verificationStatus === "REJECTED" || verificationStatus === "FLAGGED";

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-10">
      <Link
        href="/business"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-700"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            Business settings
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Company profile
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep your company information accurate so graduates can understand who is hiring.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
          <Building2 className="size-4 text-orange-600" />
          Company information
        </span>
      </header>

      <section className={`rounded-2xl border p-5 ${
        verified
          ? "border-emerald-200 bg-emerald-50"
          : rejected
            ? "border-red-200 bg-red-50"
            : "border-amber-200 bg-amber-50"
      }`}>
        <div className="flex items-start gap-3">
          {verified ? (
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-700" />
          ) : rejected ? (
            <ShieldAlert className="mt-0.5 size-6 shrink-0 text-red-700" />
          ) : (
            <Clock3 className="mt-0.5 size-6 shrink-0 text-amber-700" />
          )}
          <div>
            <h2 className="font-bold text-slate-950">
              Verification: {readableStatus(verificationStatus)}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {verified
                ? "Your company is verified."
                : rejected
                  ? "Your company needs attention. Review any available document feedback and contact your administrator if needed."
                  : "Your company is awaiting review. Saving your profile does not itself verify your business."}
            </p>
            {verifiedAt && verified && (
              <p className="mt-2 text-xs text-slate-600">
                Verified on {new Date(verifiedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <section>
          <h2 className="text-lg font-bold text-slate-950">Company details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Fields marked with an asterisk are required.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Company name *
              <input name="companyName" required minLength={2} maxLength={120} defaultValue={initialValues.companyName} className={fieldClass} />
            </label>

            <label className={labelClass}>
              Registration number
              <input name="registrationNumber" maxLength={100} defaultValue={initialValues.registrationNumber} placeholder="CAC registration number" className={fieldClass} />
            </label>

            <label className={labelClass}>
              Industry
              <input name="industry" maxLength={100} defaultValue={initialValues.industry} placeholder="e.g. Technology, Finance" className={fieldClass} />
            </label>

            <label className={labelClass}>
              Company website
              <input name="website" type="text" maxLength={255} defaultValue={initialValues.website} placeholder="https://example.com" className={fieldClass} />
            </label>

            <label className={labelClass}>
              Business email *
              <input name="businessEmail" type="email" required maxLength={255} defaultValue={initialValues.businessEmail} placeholder="hr@company.com" className={fieldClass} />
            </label>

            <label className={labelClass}>
              Business phone
              <input name="businessPhone" type="tel" maxLength={40} defaultValue={initialValues.businessPhone} placeholder="+234..." className={fieldClass} />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Business address
              <input name="address" maxLength={255} defaultValue={initialValues.address} placeholder="Office address, city, state" className={fieldClass} />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Company description
              <textarea name="description" rows={5} maxLength={3000} defaultValue={initialValues.description} placeholder="Tell graduates about your company, team, and work culture." className={fieldClass} />
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Maximum 3,000 characters.
              </span>
            </label>
          </div>
        </section>

        {message && (
          <div role="status" className={`rounded-xl border p-4 text-sm ${
            success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            {pending ? "Saving profile..." : "Save company profile"}
          </button>
        </div>
      </form>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-950">Verification documents</h2>
              <p className="mt-1 text-sm text-slate-500">
                Existing documents and their current review status.
              </p>
            </div>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="px-5 py-10 text-center sm:px-6">
            <FileCheck2 className="mx-auto size-8 text-slate-400" />
            <h3 className="mt-3 font-semibold text-slate-900">No documents submitted</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Document uploads will be enabled after secure file storage is configured. Saving company details does not count as submitting verification documents.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map((document) => (
              <div key={document.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {document.originalFilename || readableStatus(document.type)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {readableStatus(document.type)} · Submitted {new Date(document.createdAt).toLocaleDateString()}
                  </p>
                  {document.adminNotes && (
                    <p className="mt-2 text-sm text-slate-600">
                      Review note: {document.adminNotes}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {readableStatus(document.verificationStatus)}
                  </span>
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-800"
                  >
                    Open document <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
