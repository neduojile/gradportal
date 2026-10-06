import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FilePlus2,
  Search,
  UserRoundPen,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const actions = [
  {
    title: "Find Jobs",
    description: "Browse available opportunities",
    href: "/jobs",
    icon: Search,
  },
  {
    title: "My Applications",
    description: "Track submitted applications",
    href: "/applications",
    icon: FilePlus2,
  },
  {
    title: "Saved Jobs",
    description: "Continue where you stopped",
    href: "/saved",
    icon: BriefcaseBusiness,
  },
  {
    title: "Update Profile",
    description: "Improve your profile strength",
    href: "/profile",
    icon: UserRoundPen,
  },
];

export function QuickActions() {
  return (
    <Card className="overflow-hidden rounded-[28px] border-border/60 bg-background/80 shadow-[0_20px_70px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <CardHeader className="relative">
        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-orange-500/10 blur-3xl" />

        <CardTitle className="relative tracking-tight">
          Quick Actions
        </CardTitle>

        <CardDescription className="relative">
          Frequently used shortcuts.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div key={action.title}>
              <Link
                href={action.href}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-4 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-orange-500/[0.06] to-transparent" />

                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  <Icon className="size-5" />
                </span>

                <div className="relative min-w-0 flex-1">
                  <h3 className="font-semibold tracking-tight">
                    {action.title}
                  </h3>

                  <p className="truncate text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>

                <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground group-hover:text-orange-500">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

