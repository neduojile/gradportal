import Container from "@/components/design/Container";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#fffaf5]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-32 -top-24 h-[520px] w-[520px] rounded-full bg-orange-200/30 blur-3xl"
        />

        <div
          className="absolute -bottom-32 -right-32 h-[560px] w-[560px] rounded-full bg-orange-100/50 blur-3xl"
        />

        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-200/40 to-transparent" />
      </div>

      <Container className="grid min-h-[90vh] items-center gap-20 py-24 lg:grid-cols-2">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-orange-600" />

            <span className="text-sm font-semibold text-slate-700">
              Trusted Graduate Recruitment Platform
            </span>
          </div>

          <div className="mt-8 overflow-hidden [perspective:1000px]">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
              <span
                className="block origin-bottom"
              >
                Find Opportunities.
              </span>

              <span
                className="block origin-bottom"
              >
                Build Your Future.
              </span>

              <span
                className="block origin-bottom text-orange-600"
              >
                Get Hired Faster.
              </span>
            </h1>
          </div>

          <p
            className="mt-8 max-w-xl text-lg leading-8 text-slate-600"
          >
            Employa connects graduates with verified employers through a
            modern recruitment platform designed for smarter applications,
            faster hiring, and long-term career growth.
          </p>

          <div
            className="mt-10 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/30"
          >
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
              <div className="flex items-center gap-3 rounded-2xl border px-4">
                <Search className="h-5 w-5 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="h-14 w-full bg-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border px-4">
                <MapPin className="h-5 w-5 text-slate-400" />

                <input
                  type="text"
                  placeholder="Location"
                  className="h-14 w-full bg-transparent outline-none"
                />
              </div>

              <Button
                size="lg"
              >
                Search
              </Button>
            </div>
          </div>

          <div
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/register">
              <Button
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/jobs">
              <Button
                variant="outline"
                size="lg"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-10">
            {[
              ["5K+", "Graduates"],
              ["850+", "Employers"],
              ["12K+", "Applications"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="group"
              >
                <h2 className="text-3xl font-black text-slate-950">
                  {value}
                </h2>

                <p className="text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative will-change-transform [perspective:1400px]"
        >
          <div className="absolute -inset-8 -z-10 rounded-[50px] bg-orange-200/30 blur-3xl" />

          <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/30">
            <div
              className="flex items-center justify-between border-b border-slate-200 pb-6"
            >
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>

                <h3 className="text-2xl font-bold text-slate-950">
                  Employa Dashboard
                </h3>
              </div>

              <div className="rounded-2xl bg-orange-50 p-3">
                <BriefcaseBusiness className="h-6 w-6 text-orange-600" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5">
              <div
                className="rounded-2xl bg-[#fffaf5] p-5"
              >
                <p className="text-sm text-slate-500">
                  Profile Completion
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  82%
                </h2>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[82%] rounded-full bg-orange-500" />
                </div>
              </div>

              <div
                className="rounded-2xl bg-[#fffaf5] p-5"
              >
                <p className="text-sm text-slate-500">
                  Applications
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  24
                </h2>

                <p className="mt-4 text-sm font-medium text-green-600">
                  +8 this month
                </p>
              </div>
            </div>

            <div
              className="mt-6 rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-950">
                  Best Job Match
                </h4>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                  96% Match
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-950">
                Frontend Engineer
              </h3>

              <p className="mt-1 text-slate-500">
                TechNova Ltd • Remote
              </p>

              <Button className="mt-5 w-full">
                View Job
              </Button>
            </div>

            <div
              className="mt-6 rounded-2xl border border-slate-200 p-5"
            >
              <h4 className="font-semibold text-slate-950">
                Recent Activity
              </h4>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    Applied to UI Designer
                  </span>

                  <span className="text-xs text-slate-400">
                    Today
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    CV Updated
                  </span>

                  <span className="text-xs text-slate-400">
                    Yesterday
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    Interview Invitation
                  </span>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    New
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}



