"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  LogOut,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { signOut } from "next-auth/react";

const preferencesKey = "employa-settings";

type Preferences = {
  applicationUpdates: boolean;
  platformUpdates: boolean;
  darkMode: boolean;
};

const defaults: Preferences = {
  applicationUpdates: true,
  platformUpdates: true,
  darkMode: false,
};

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(preferencesKey);

      if (stored) {
        setPreferences({
          ...defaults,
          ...JSON.parse(stored),
        });
      }
    } catch {
      // Keep defaults.
    }
  }, []);

  function updatePreference(key: keyof Preferences, value: boolean) {
    const next = {
      ...preferences,
      [key]: value,
    };

    setPreferences(next);
    localStorage.setItem(preferencesKey, JSON.stringify(next));

    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", value);
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/60 p-7 shadow-xl backdrop-blur-3xl dark:bg-zinc-900/60 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-300">
            <ShieldCheck className="size-3.5" />
            Account controls
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage how Employa communicates with you and how your workspace looks.
          </p>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50 sm:p-8">
        <div className="mb-7">
          <h2 className="text-xl font-bold">Notifications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose which updates you want to receive inside Employa.
          </p>
        </div>

        <div className="divide-y divide-border/50">
          <SettingToggle
            icon={Bell}
            title="Application updates"
            description="Receive updates when your application status changes."
            checked={preferences.applicationUpdates}
            onChange={(value) => updatePreference("applicationUpdates", value)}
          />

          <SettingToggle
            icon={Bell}
            title="Platform updates"
            description="Receive important announcements from Employa."
            checked={preferences.platformUpdates}
            onChange={(value) => updatePreference("platformUpdates", value)}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50 sm:p-8">
        <div className="mb-7">
          <h2 className="text-xl font-bold">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Adjust the visual mode for your dashboard.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <AppearanceButton
            icon={Sun}
            title="Light"
            active={!preferences.darkMode}
            onClick={() => updatePreference("darkMode", false)}
          />

          <AppearanceButton
            icon={Moon}
            title="Dark"
            active={preferences.darkMode}
            onClick={() => updatePreference("darkMode", true)}
          />

          <AppearanceButton
            icon={Monitor}
            title="System"
            active={false}
            disabled
            onClick={() => undefined}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-red-200/60 bg-red-50/60 p-6 shadow-lg backdrop-blur-xl dark:border-red-900/40 dark:bg-red-950/20 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-red-600">Sign out</h2>
            <p className="mt-1 text-sm text-red-600/70">
              End your current Employa session on this device.
            </p>
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:bg-zinc-950"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </section>

      {saved ? (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
          <Check className="size-4 text-emerald-400" />
          Preference saved
        </div>
      ) : null}
    </div>
  );
}

function SettingToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-orange-500" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
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
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-orange-400 bg-orange-500/10 text-orange-600"
          : "border-border/60 bg-background/50 hover:border-orange-300"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <Icon className="size-5" />
      <div>
        <p className="font-semibold">{title}</p>
        {disabled ? (
          <p className="text-xs text-muted-foreground">Coming soon</p>
        ) : null}
      </div>
    </button>
  );
}
