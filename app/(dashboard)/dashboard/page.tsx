import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getDashboardData } from "@/lib/dashboard-data";

import { ActivityChart } from "@/components/dashboard/activity-chart";
import { NotificationPanel } from "@/components/dashboard/notification-panel";
import { ProfileCompletion } from "@/components/dashboard/profile-completion";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { RecommendedJobs } from "@/components/dashboard/recommended-jobs";
import { StatsGrid } from "@/components/dashboard/stats-grid";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const data = await getDashboardData(userId);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-orange-200/60 bg-gradient-to-br from-white via-white to-orange-50/80 p-7 shadow-[0_24px_80px_rgba(249,115,22,0.08)] dark:border-white/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-orange-950/20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-orange-500" />
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-400">
              Employa Career Hub
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Track your applications, discover new opportunities, and stay
            on top of your graduate career journey.
          </p>
        </div>
      </section>

      <StatsGrid stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ActivityChart activity={data.activity} />

          <RecentApplications applications={data.recentApplications} />
        </div>

        <div className="space-y-6">
          <QuickActions />

          <ProfileCompletion profile={data.profile} />

          <NotificationPanel notifications={data.notifications} />
        </div>
      </div>

      <RecommendedJobs jobs={data.recommendedJobs} />
    </div>
  );
}

