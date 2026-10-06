import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDeadline(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

interface RecommendedJobsProps {
  jobs: {
    id: string;
    title: string;
    category: string;
    location: string;
    deadline: Date;
  }[];
}

export function RecommendedJobs({ jobs }: RecommendedJobsProps) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Recommended Jobs</CardTitle>

        <CardDescription>
          Latest graduate opportunities available for you.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <p className="font-medium">No jobs available</p>

            <p className="mt-2 text-sm text-muted-foreground">
              New opportunities will appear here once they are published.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-2xl border p-4"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>

                <p className="text-sm text-muted-foreground">
                  {job.category}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {job.location}
                  </div>

                  <div className="flex items-center gap-1">
                    <CalendarDays className="size-4" />
                    Apply before {formatDeadline(job.deadline)}
                  </div>
                </div>
              </div>

              <Link
                href={`/jobs/${job.id}`}
                className="flex items-center gap-1 text-sm font-medium text-orange-600"
              >
                View
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

