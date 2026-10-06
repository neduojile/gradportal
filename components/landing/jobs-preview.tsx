import Container from "@/components/design/Container";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const jobs = [
  {
    title: "Frontend Developer",
    company: "TechNova Ltd",
    location: "Remote",
    type: "Full Time",
  },
  {
    title: "Backend Developer",
    company: "Flutterwave",
    location: "Lagos",
    type: "Full Time",
  },
  {
    title: "UI/UX Designer",
    company: "Moniepoint",
    location: "Abuja",
    type: "Hybrid",
  },
];

export default function JobsPreview() {
  return (
    <section
      className="bg-[#fffaf5] py-24"
    >
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              Featured Jobs
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
              Discover Your Next Opportunity
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Browse verified opportunities from trusted employers looking
              for talented graduates.
            </p>
          </div>

          <Link href="/jobs">
            <Button
            >
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm will-change-transform"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 will-change-transform"
              >
                <BriefcaseBusiness className="h-7 w-7 text-orange-600" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-950">
                {job.title}
              </h3>

              <p className="mt-2 font-medium text-slate-600">
                {job.company}
              </p>

              <div className="mt-6 space-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {job.type}
                </div>
              </div>

              <Button
                className="mt-8 w-full"
              >
                Apply Now
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}


