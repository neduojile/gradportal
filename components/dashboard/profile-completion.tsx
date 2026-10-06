import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileCompletionProps {
  profile: {
    phone: string | null;
    location: string | null;
    careerField: string | null;
    preferredRole: string | null;
    qualification: string | null;
    cvUrl: string | null;
    profileImage: string | null;
  } | null;
}

export function ProfileCompletion({
  profile,
}: ProfileCompletionProps) {
  const checks = [
    {
      label: "Phone number",
      completed: Boolean(profile?.phone),
    },
    {
      label: "Location",
      completed: Boolean(profile?.location),
    },
    {
      label: "Career field",
      completed: Boolean(profile?.careerField),
    },
    {
      label: "Preferred role",
      completed: Boolean(profile?.preferredRole),
    },
    {
      label: "Qualification",
      completed: Boolean(profile?.qualification),
    },
    {
      label: "CV / Resume",
      completed: Boolean(profile?.cvUrl),
    },
    {
      label: "Profile photo",
      completed: Boolean(profile?.profileImage),
    },
  ];

  const completed = checks.filter((item) => item.completed).length;
  const progress = Math.round((completed / checks.length) * 100);
  const missingItems = checks.filter((item) => !item.completed);

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>

        <CardDescription>
          Complete your profile to improve job matches.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>{progress}% Complete</span>

            <CheckCircle2
              className={`size-5 ${
                progress === 100
                  ? "text-green-500"
                  : "text-orange-500"
              }`}
            />
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {missingItems.length === 0 ? (
          <p className="text-sm text-green-600 dark:text-green-400">
            Your profile is fully completed.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Complete the following to improve your visibility:
            </p>

            <ul className="space-y-1 text-sm text-muted-foreground">
              {missingItems.map((item) => (
                <li key={item.label}>• {item.label}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

