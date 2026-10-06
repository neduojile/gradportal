import { ActivityChartClient } from "./activity-chart-client";

interface ActivityChartProps {
  activity: {
    label: string;
    value: number;
  }[];
}

export function ActivityChart({
  activity,
}: ActivityChartProps) {
  const total = activity.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border/60 bg-background/80 shadow-[0_20px_70px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-orange-500/8 blur-3xl" />

      <div className="relative flex items-start justify-between gap-6 border-b border-border/50 px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />

            <h2 className="text-lg font-semibold tracking-tight">
              Weekly Activity
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Applications submitted over the last seven days.
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-orange-200/60 bg-orange-50/70 px-4 py-2 text-right dark:border-orange-500/20 dark:bg-orange-500/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            This week
          </p>

          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {total}
          </p>
        </div>
      </div>

      <div className="relative px-4 pb-5 pt-2 sm:px-6">
        <ActivityChartClient
          labels={activity.map((item) => item.label)}
          values={activity.map((item) => item.value)}
        />
      </div>
    </section>
  );
}
