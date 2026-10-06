import Container from "@/components/design/Container";
import {
  UserPlus,
  FileUp,
  Send,
  BriefcaseBusiness,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Register in minutes and complete your graduate profile with your academic and personal details.",
  },
  {
    icon: FileUp,
    title: "Upload Your CV",
    description:
      "Upload your latest CV once and use it to apply for multiple job opportunities.",
  },
  {
    icon: Send,
    title: "Apply For Jobs",
    description:
      "Browse verified graduate opportunities and submit applications with just a few clicks.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Get Hired",
    description:
      "Track your application progress, receive interview invitations, and launch your career.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            How It Works
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Land Your First Job In Four Simple Steps
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Employa simplifies the graduate recruitment process, making it
            easier to discover opportunities and apply with confidence.
          </p>
        </div>

        <div className="relative mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="absolute right-6 top-6 text-5xl font-black text-orange-100">
                  0{index + 1}
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
                  <Icon className="h-7 w-7 text-orange-600" />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

