import {
  Bookmark,
  BriefcaseBusiness,
  FileText,
  UserCheck,
} from "lucide-react";

import { StatCard } from "./stat-card";

interface StatsGridProps {
  stats: {
    applicationCount: number;
    savedJobsCount: number;
    availableJobsCount: number;
    profileStrength: string;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-4">
      <StatCard
        title="Applications"
        value={stats.applicationCount}
        change="Total applications"
        trend="neutral"
        icon={<FileText className="size-6" />}
      />

      <StatCard
        title="Saved Jobs"
        value={stats.savedJobsCount}
        change="Saved opportunities"
        trend="neutral"
        icon={<Bookmark className="size-6" />}
      />

      <StatCard
        title="Available Jobs"
        value={stats.availableJobsCount}
        change="Currently open"
        trend="neutral"
        icon={<BriefcaseBusiness className="size-6" />}
      />

      <StatCard
        title="Profile Strength"
        value={stats.profileStrength}
        change="Keep improving"
        trend="neutral"
        icon={<UserCheck className="size-6" />}
      />
    </section>
  );
}
