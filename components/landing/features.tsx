import Container from "@/components/design/Container";
import {
  BriefcaseBusiness,
  SearchCheck,
  FileText,
  BellRing,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: SearchCheck,
    title: "Smart Job Discovery",
    description:
      "Quickly discover jobs that match your skills, interests, and career goals.",
  },
  {
    icon: FileText,
    title: "One-Click Applications",
    description:
      "Apply to multiple opportunities using your uploaded CV and completed profile.",
  },
  {
    icon: BellRing,
    title: "Real-Time Notifications",
    description:
      "Receive instant updates whenever your application status changes.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Verified Employers",
    description:
      "Browse opportunities from trusted organizations actively hiring graduates.",
  },
  {
    icon: BarChart3,
    title: "Application Tracking",
    description:
      "Monitor every application from submission to interview and final decision.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Your personal information and documents are securely stored and protected.",
  },
];

export default function Features() {
  return (
    <section className="bg-[#fffaf5] py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Why Choose Employa
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Everything You Need To Start Your Career
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Employa provides graduates with modern tools to discover jobs,
            apply confidently, and stay informed throughout the hiring process.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-200 bg-white p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
                  <Icon className="h-7 w-7 text-orange-600 group-hover:text-white" />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

