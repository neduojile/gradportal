"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Bell,
  Check,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { signOut } from "next-auth/react";
import {
  changeAccountPassword,
  getNotificationPreferences,
  saveNotificationPreference,
} from "./actions";

type Preferences = {
  applicationUpdates: boolean;
  platformUpdates: boolean;
  messageUpdates: boolean;
  interviewUpdates: boolean;
  darkMode: boolean;
};

const defaults: Preferences = {
  applicationUpdates: true,
  platformUpdates: true,
  messageUpdates: true,
  interviewUpdates: true,
  darkMode: false,
};

export default function SettingsPage() {
  const [preferences, setPreferences] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [stored, appearance] = await Promise.all([
          getNotificationPreferences(),
          Promise.resolve(localStorage.getItem("employa-settings")),
        ]);

        if (!active) return;

        let darkMode = false;

        try {
          if (appearance) {
            darkMode = Boolean(JSON.parse(appearance).darkMode);
          }
        } catch {
          darkMode = false;
        }

        setPreferences({ ...stored, darkMode });
        document.documentElement.classList.toggle("dark", darkMode);
      } catch {
        if (active) setError("Could not load settings. Refresh and try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => { active = false; };
  }, []);

  function updateAppearance(darkMode: boolean) {
    setPreferences((old) => ({ ...old, darkMode }));
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("employa-settings", JSON.stringify({ darkMode }));
    setNotice("Appearance saved.");
    setError("");
  }

  function updateNotification(
    key: keyof Omit<Preferences, "darkMode">,
    value: boolean,
  ) {
    const previous = preferences[key];

    setPreferences((old) => ({ ...old, [key]: value }));
    setNotice("");
    setError("");

    startTransition(async () => {
      try {
        const result = await saveNotificationPreference(key, value);

        if (!result.success) {
          setPreferences((old) => ({ ...old, [key]: previous }));
          setError(result.message ?? "Password change failed.");
          return;
        }

        setNotice("Notification preference saved.");
      } catch {
        setPreferences((old) => ({ ...old, [key]: previous }));
        setError("Could not save this preference. Please try again.");
      }
    });
  }

  async function submitPassword(formData: FormData) {
    setNotice("");
    setError("");

    startTransition(async () => {
      try {
        const result = await changeAccountPassword(formData);

        if (!result.success) {
          setError(result.message ?? "Password change failed.");
          return;
        }

        setNotice(result.message);
        const form = document.getElementById("password-form") as HTMLFormElement | null;
        form?.reset();
      } catch {
        setError("Could not change your password. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/60 p-7 shadow-xl backdrop-blur-3xl dark:bg-zinc-900/60 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-300">
            <ShieldCheck className="size-3.5" /> Account controls
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage your notifications, appearance, and account security.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border p-6 text-sm text-muted-foreground">
          Loading your settings…
        </div>
      ) : (
        <>
          <section className="rounded-[28px] border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50 sm:p-8">
            <h2 className="text-xl font-bold">Notifications</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These preferences are saved to your account.
            </p>
            <div className="mt-5 divide-y divide-border/50">
              <SettingToggle icon={Bell} title="Application updates"
                description="Receive application status updates."
                checked={preferences.applicationUpdates}
                disabled={pending}
                onChange={(v) => updateNotification("applicationUpdates", v)} />
              <SettingToggle icon={Bell} title="Platform updates"
                description="Receive important Employa announcements."
                checked={preferences.platformUpdates}
                disabled={pending}
                onChange={(v) => updateNotification("platformUpdates", v)} />
              <SettingToggle icon={Bell} title="Message updates"
                description="Receive notifications about new messages."
                checked={preferences.messageUpdates}
                disabled={pending}
                onChange={(v) => updateNotification("messageUpdates", v)} />
              <SettingToggle icon={Bell} title="Interview updates"
                description="Receive interview scheduling and status updates."
                checked={preferences.interviewUpdates}
                disabled={pending}
                onChange={(v) => updateNotification("interviewUpdates", v)} />
            </div>
          </section>

          <section className="rounded-[28px] border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50 sm:p-8">
            <h2 className="text-xl font-bold">Appearance</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose how Employa looks on this device.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <AppearanceButton icon={Sun} title="Light"
                active={!preferences.darkMode}
                onClick={() => updateAppearance(false)} />
              <AppearanceButton icon={Moon} title="Dark"
                active={preferences.darkMode}
                onClick={() => updateAppearance(true)} />
              <AppearanceButton icon={Monitor} title="System"
                active={false} disabled
                onClick={() => undefined} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              System appearance is not available yet.
            </p>
          </section>

          <section className="rounded-[28px] border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <KeyRound className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Change password</h2>
                <p className="text-sm text-muted-foreground">
                  Confirm your current password before choosing a new one.
                </p>
              </div>
            </div>

            <form id="password-form" action={submitPassword} className="max-w-xl space-y-4">
              <PasswordField label="Current password" name="currentPassword" autoComplete="current-password" />
              <PasswordField label="New password" name="newPassword" autoComplete="new-password" />
              <PasswordField label="Confirm new password" name="confirmPassword" autoComplete="new-password" />
              <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
              <button disabled={pending} type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                {pending ? "Saving…" : "Update password"}
              </button>
            </form>
          </section>

          <section className="rounded-[28px] border border-red-200/60 bg-red-50/60 p-6 shadow-lg dark:border-red-900/40 dark:bg-red-950/20 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-red-600">Sign out</h2>
                <p className="mt-1 text-sm text-red-600/70">
                  End your current Employa session on this device.
                </p>
              </div>
              <button type="button" onClick={() => signOut({ callbackUrl: "/login" })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:bg-zinc-950">
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          </section>
        </>
      )}

      {notice && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          <Check className="mr-2 inline size-4" />{notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordField({
  label,
  name,
  autoComplete,
}: {
  label: string;
  name: string;
  autoComplete: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input required minLength={name === "currentPassword" ? undefined : 8}
        maxLength={128} type="password" name={name} autoComplete={autoComplete}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15" />
    </label>
  );
}

function SettingToggle({
  icon: Icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={checked}
        disabled={disabled} onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${checked ? "bg-orange-500" : "bg-muted"}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

function AppearanceButton({
  icon: Icon,
  title,
  active,
  disabled,
  onClick,
}: {
  icon: typeof Sun;
  title: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-300" : "border-border hover:border-orange-300"}`}>
      <Icon className="size-5" />
      <span className="font-semibold">{title}</span>
      {active && <Check className="ml-auto size-4" />}
    </button>
  );
}
