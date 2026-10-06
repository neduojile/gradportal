import {
  CalendarDays,
  CircleCheckBig,
  Clock3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatRelativeDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);

  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;

  return date.toLocaleDateString();
}

interface RecentApplicationsProps {
  applications: {
    id: string;
    status:
      | "PENDING"
      | "UNDER_REVIEW"
      | "SHORTLISTED"
      | "REJECTED"
      | "ACCEPTED";
    appliedAt: Date;
    job: {
      title: string;
      category: string;
    };
  }[];
}

export function RecentApplications({
  applications,
}: RecentApplicationsProps) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>

        <CardDescription>
          Track your latest job applications.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <p className="font-medium">No applications yet</p>

            <p className="mt-2 text-sm text-muted-foreground">
              Start applying for jobs and they will appear here.
            </p>
          </div>
        ) : (
          applications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between rounded-2xl border p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {application.job.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {application.job.category}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {application.status === "ACCEPTED" ||
                  application.status === "SHORTLISTED" ? (
                    <CircleCheckBig className="size-4 text-green-500" />
                  ) : (
                    <Clock3 className="size-4 text-orange-500" />
                  )}

                  <span className="text-sm font-medium">
                    {application.status
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3" />
                  {formatRelativeDate(application.appliedAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

