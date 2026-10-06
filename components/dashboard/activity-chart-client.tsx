"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

interface ActivityChartClientProps {
  labels: string[];
  values: number[];
}

export function ActivityChartClient({
  labels,
  values,
}: ActivityChartClientProps) {
  const hasActivity = values.some((value) => value > 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: values,

        borderColor: "#f97316",

        backgroundColor: (context: {
          chart: {
            ctx: CanvasRenderingContext2D;
            chartArea: {
              top: number;
              bottom: number;
              left: number;
              right: number;
            } | undefined;
          };
        }) => {
          const { ctx, chartArea } = context.chart;

          if (!chartArea) {
            return "rgba(249,115,22,0.08)";
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          gradient.addColorStop(0, "rgba(249,115,22,0.24)");
          gradient.addColorStop(0.55, "rgba(249,115,22,0.08)");
          gradient.addColorStop(1, "rgba(249,115,22,0)");

          return gradient;
        },

        fill: true,

        tension: 0.45,

        borderWidth: 2.5,

        pointRadius: hasActivity ? 4 : 3,

        pointHoverRadius: 7,

        pointBorderWidth: 2,

        pointBackgroundColor: "#ffffff",

        pointBorderColor: "#f97316",

        pointHoverBackgroundColor: "#f97316",

        pointHoverBorderColor: "#ffffff",

        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    animation: {
      duration: 1400,
      easing: "easeOutQuart",
    },

    transitions: {
      active: {
        animation: {
          duration: 300,
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        displayColors: false,

        backgroundColor: "rgba(17, 17, 17, 0.94)",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        titleFont: {
          size: 12,
          weight: 600,
        },

        bodyFont: {
          size: 13,
          weight: 500,
        },

        padding: 12,

        cornerRadius: 12,

        callbacks: {
          label: (context) => {
            const value = context.parsed.y ?? 0;

            return `${value} application${value === 1 ? "" : "s"}`;
          },
        },
      },
    },

    scales: {
      x: {
        border: {
          display: false,
        },

        grid: {
          display: false,
        },

        ticks: {
          color: "#737373",
          font: {
            size: 12,
          },
          padding: 8,
        },
      },

      y: {
        beginAtZero: true,

        suggestedMax: hasActivity
          ? Math.max(...values) + 1
          : 1,

        border: {
          display: false,
        },

        grid: {
          color: "rgba(115,115,115,0.12)",
        },

        ticks: {
          color: "#737373",
          stepSize: 1,
          padding: 8,
          precision: 0,
        },
      },
    },

    elements: {
      line: {
        capBezierPoints: true,
      },
    },
  };

  return (
    <Card className="overflow-hidden rounded-[28px] border-border/60 bg-background/80 shadow-[0_20px_70px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <CardHeader className="relative">
        <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-orange-500/10 blur-3xl" />

        <CardTitle className="relative tracking-tight">
          Weekly Activity
        </CardTitle>

        <CardDescription className="relative">
          Applications submitted over the last seven days.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative h-80">
          <Line data={data} options={options} />

          {!hasActivity && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="rounded-2xl border border-border/50 bg-background/75 px-5 py-3 text-center shadow-lg backdrop-blur-xl">
                <p className="text-sm font-semibold">
                  No applications yet
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your activity will appear here as you apply.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

