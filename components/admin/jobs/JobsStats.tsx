import {
  BriefcaseBusiness,
  CheckCircle2,
  Lock,
  Star,
  TrendingUp,
} from "lucide-react";

type JobsStatsProps = {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  featuredJobs: number;
};

const cards = [
  {
    title: "Total Jobs",
    key: "totalJobs",
    icon: BriefcaseBusiness,
    color: "from-blue-500 to-cyan-500",
    glow: "bg-blue-500/20",
  },
  {
    title: "Open Jobs",
    key: "openJobs",
    icon: CheckCircle2,
    color: "from-emerald-500 to-green-500",
    glow: "bg-emerald-500/20",
  },
  {
    title: "Closed Jobs",
    key: "closedJobs",
    icon: Lock,
    color: "from-rose-500 to-red-500",
    glow: "bg-rose-500/20",
  },
  {
    title: "Featured",
    key: "featuredJobs",
    icon: Star,
    color: "from-amber-500 to-orange-500",
    glow: "bg-orange-500/20",
  },
] as const;

export default function JobsStats({
  totalJobs,
  openJobs,
  closedJobs,
  featuredJobs,
}: JobsStatsProps) {
  const values = {
    totalJobs,
    openJobs,
    closedJobs,
    featuredJobs,
  };

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white shadow-xl"
          >
            <div
              className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl ${card.glow}`}
            />

            <div className="relative p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-5xl font-black tracking-tight text-slate-900">
                    {values[card.key]}
                  </h2>
                </div>

                <div
                  className={`rounded-2xl bg-gradient-to-br p-4 text-white shadow-lg ${card.color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />

                  <span className="text-sm font-semibold">
                    Live Statistics
                  </span>
                </div>

                <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full w-full rounded-full bg-gradient-to-r ${card.color}`}
                  />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 transition-[box-shadow] group-hover:ring-2 group-hover:ring-orange-400/20" />
          </div>
        );
      })}
    </section>
  );
}

