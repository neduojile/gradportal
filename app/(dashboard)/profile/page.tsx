import {
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireGraduate } from "@/lib/graduate";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await requireGraduate();

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      profile: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const profile = user.profile;

  const completed = [
    Boolean(user.name),
    Boolean(user.email),
    Boolean(profile?.phone),
    Boolean(profile?.location),
    Boolean(profile?.qualification),
    Boolean(profile?.bio),
  ].filter(Boolean).length;

  const strength = Math.round((completed / 6) * 100);

  const initials =
    (user.name ?? "Graduate")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GR";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/60 p-7 shadow-xl backdrop-blur-3xl dark:bg-zinc-900/60 sm:p-9">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 text-2xl font-bold text-white shadow-xl shadow-orange-500/20">
              {initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {user.name}
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  Graduate
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {profile?.bio || "Complete your profile to stand out to employers."}
              </p>
            </div>
          </div>

          <div className="min-w-[190px] rounded-2xl border border-border/50 bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Profile strength
              </span>
              <span className="font-bold text-orange-500">{strength}%</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-white/20 bg-white/60 p-5 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50">
          <Mail className="size-5 text-orange-500" />
          <p className="mt-4 text-xs text-muted-foreground">Email</p>
          <p className="mt-1 truncate font-semibold">{user.email}</p>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/60 p-5 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50">
          <Phone className="size-5 text-orange-500" />
          <p className="mt-4 text-xs text-muted-foreground">Phone</p>
          <p className="mt-1 truncate font-semibold">
            {profile?.phone || "Not added"}
          </p>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/60 p-5 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50">
          <BriefcaseBusiness className="size-5 text-orange-500" />
          <p className="mt-4 text-xs text-muted-foreground">Applications</p>
          <p className="mt-1 font-semibold">{user._count.applications} submitted</p>
        </div>
      </div>

      <ProfileForm
        profile={{
          name: user.name ?? "",
          email: user.email ?? "",
          phone: profile?.phone ?? "",
          location: profile?.location ?? "",
          qualification: profile?.qualification ?? "",
          bio: profile?.bio ?? "",
        }}
      />

      <div className="rounded-[28px] border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-orange-500" />
          <div>
            <p className="text-sm font-semibold">Current location</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.location || "Add your location above"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-5">
          <UserRound className="size-5 text-orange-500" />
          <div>
            <p className="text-sm font-semibold">Qualification</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.qualification || "Add your qualification above"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

