"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/password-reset";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(formData: FormData) {
    setBusy(true);
    setMessage("");
    try {
      const result = await requestPasswordReset(formData);
      setMessage(result.message);
    } catch {
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold">Reset your password</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Enter the email address associated with your Employa account.
      </p>
      <form action={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium" htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" required autoComplete="email"
          className="w-full rounded-md border px-3 py-2" placeholder="you@example.com" />
        <button disabled={busy} className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">
          {busy ? "Sending..." : "Send reset link"}
        </button>
        {message && <p role="status" className="text-sm">{message}</p>}
      </form>
      <Link href="/login" className="mt-5 text-sm underline">Back to sign in</Link>
    </main>
  );
}
