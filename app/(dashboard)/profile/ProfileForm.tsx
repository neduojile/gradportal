"use client";

import { useState, useTransition } from "react";
import { Check, Save } from "lucide-react";

import { updateGraduateProfile } from "./actions";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  qualification: string;
  bio: string;
};

const inputClass =
  "w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10";

export default function ProfileForm({
  profile,
}: {
  profile: ProfileData;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      action={(formData) => {
        setError("");
        setSaved(false);

        startTransition(async () => {
          try {
            await updateGraduateProfile(formData);
            setSaved(true);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to update your profile.",
            );
          }
        });
      }}
      className="space-y-8"
    >
      <section className="rounded-[28px] border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50 sm:p-8">
        <div className="mb-7">
          <h2 className="text-xl font-bold">Personal information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your candidate information current.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold">Full name</span>
            <input
              name="name"
              defaultValue={profile.name}
              className={inputClass}
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Email address</span>
            <input
              value={profile.email}
              readOnly
              className={`${inputClass} cursor-not-allowed opacity-60`}
            />
            <span className="block text-xs text-muted-foreground">
              Your account email is managed separately.
            </span>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Phone</span>
            <input
              name="phone"
              defaultValue={profile.phone}
              placeholder="e.g. 08012345678"
              className={inputClass}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Location</span>
            <input
              name="location"
              defaultValue={profile.location}
              placeholder="City, State"
              className={inputClass}
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold">Qualification</span>
            <select
              name="qualification"
              defaultValue={profile.qualification}
              className={inputClass}
            >
              <option value="">Select qualification</option>
              <option value="SSCE">SSCE</option>
              <option value="OND">OND</option>
              <option value="HND">HND</option>
              <option value="BSC">BSc</option>
              <option value="BENG">BEng</option>
              <option value="BA">BA</option>
              <option value="MSC">MSc</option>
              <option value="PHD">PhD</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50 sm:p-8">
        <div className="mb-7">
          <h2 className="text-xl font-bold">Professional summary</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Give recruiters a concise view of who you are and what you bring.
          </p>
        </div>

        <textarea
          name="bio"
          defaultValue={profile.bio}
          rows={7}
          maxLength={2000}
          placeholder="Write a short professional summary..."
          className={`${inputClass} resize-none`}
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Keep it clear, specific and relevant to the opportunities you want.
          </p>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saved ? <Check className="size-4" /> : <Save className="size-4" />}
            {pending ? "Saving..." : saved ? "Saved" : "Save profile"}
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </section>
    </form>
  );
}
