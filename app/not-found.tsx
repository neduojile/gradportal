import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-8xl font-black text-blue-600">404</h1>

      <h2 className="mt-6 text-3xl font-bold text-slate-900">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-md text-slate-600">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

 <Link href="/">
  <Button className="mt-8">
    Back to Home
  </Button>
</Link>
    </main>
  );
}