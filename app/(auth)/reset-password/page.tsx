"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/password-reset";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(formData: FormData) {
    formData.set("token", token);
    setBusy(true);
    setMessage("");
    try {
      const result = await resetPassword(formData);
      setMessage(result.message);
      setDone(result.success);
    } catch {
      setMessage("Something went wrong. Request a new reset link if needed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold">Choose a new password</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your reset link is valid for 30 minutes and can only be used once.
      </p>
      <form action={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">New password</label>
          <input id="password" name="password" type="password" required minLength={8}
            autoComplete="new-password" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="confirmPassword">Confirm new password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8}
            autoComplete="new-password" className="w-full rounded-md border px-3 py-2" />
        </div>
        <button disabled={busy || !token || done}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">
          {busy ? "Updating..." : "Update password"}
        </button>
        {message && <p role="status" className="text-sm">{message}</p>}
      </form>
      {done && <Link href="/login" className="mt-5 inline-block text-sm underline">Go to sign in</Link>}
      {!token && <p className="mt-4 text-sm">The reset link is missing a token. <Link className="underline" href="/forgot-password">Request another</Link>.</p>}
    </main>
  );
}
