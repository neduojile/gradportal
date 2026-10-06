"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">
          Something went wrong
        </h2>

        <p className="text-muted-foreground">
          An unexpected error occurred while loading this page.
        </p>
      </div>

      <Button onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}