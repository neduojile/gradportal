import Container from "@/components/design/Container";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section
      className="bg-white py-24"
    >
      <Container>
        <div
          className="relative isolate overflow-hidden rounded-[40px] bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-8 py-16 text-center text-white shadow-2xl md:px-16"
        >
          <div
            className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-white/15 blur-3xl"
          />

          <div className="relative">
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              Ready to Begin?
            </span>

            <h2 className="mx-auto mt-8 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Your Next Career Opportunity Starts Here
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-orange-100">
              Create your Employa account today, build your professional profile,
              and start applying to verified graduate opportunities from leading
              employers.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-orange-700 hover:bg-slate-100"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent text-white hover:bg-white hover:text-orange-700"
                >
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


