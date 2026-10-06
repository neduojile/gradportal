import Container from "@/components/design/Container";

const companies = [
  "Google",
  "Microsoft",
  "Flutterwave",
  "Moniepoint",
  "Interswitch",
  "Andela",
];

export default function Stats() {
  return (
    <section className="border-y bg-white py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
            Trusted by Employers
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950">
            Connecting Top Graduates With Leading Companies
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Employa helps graduates discover opportunities while helping
            employers recruit the right talent faster.
          </p>
        </div>

        {/* Company Logos */}

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <div
              key={company}
              className="flex h-20 items-center justify-center rounded-2xl border border-slate-200 bg-[#fffaf5] text-lg font-semibold text-slate-700"
            >
              {company}
            </div>
          ))}
        </div>

        {/* Trust Metrics */}

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-5xl font-black text-orange-600">10K+</h3>

            <p className="mt-3 text-slate-600">
              Successful Applications
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-5xl font-black text-orange-600">850+</h3>

            <p className="mt-3 text-slate-600">
              Hiring Companies
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-5xl font-black text-orange-600">98%</h3>

            <p className="mt-3 text-slate-600">
              Employer Satisfaction
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

