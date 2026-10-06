import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  title,
  value,
  icon,
  change,
  trend = "neutral",
}: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/70 backdrop-blur-xl">
      {/* Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0" />

      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              {value}
            </h2>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
            {icon}
          </div>
        </div>

        {change && (
          <div className="mt-6 flex items-center gap-2">
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                trend === "up"
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : trend === "down"
                    ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {trend === "up" && <ArrowUpRight className="size-3.5" />}
              {trend === "down" && <ArrowDownRight className="size-3.5" />}
              {trend === "neutral" && <Minus className="size-3.5" />}

              {change}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
