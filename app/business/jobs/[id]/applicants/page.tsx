import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, FileText, GraduationCap, MapPin, Users } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BusinessApplicantStatus from "./business-applicant-status";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; status?: string }>;
};

function statusLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusStyle(status: string) {
  if (status === "ACCEPTED" || status === "SHORTLISTED") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "REJECTED") return "bg-red-50 text-red-700";
  if (status === "UNDER_REVIEW") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

export default async function BusinessApplicantsPage({ params, searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "BUSINESS_OWNER") {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const [{ id }, filters] = await Promise.all([params, searchParams]);
  const query = (filters.q ?? "").trim().toLowerCase();
  const allowedStatuses = ["PENDING", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"];
  const selectedStatus = allowedStatuses.includes(filters.status ?? "") ? filters.status! : "ALL";
  const business = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, companyName: true },
  });

  if (!business) redirect("/business/profile");

  const job = await prisma.job.findFirst({
    where: { id, businessId: business.id },
    select: {
      id: true,
      title: true,
      status: true,
      applications: {
        orderBy: { appliedAt: "desc" },
        select: {
          id: true,
          status: true,
          appliedAt: true,
          coverLetter: true,
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: {
                select: {
                  phone: true,
                  careerField: true,
                  preferredRole: true,
                  qualification: true,
                  location: true,
                  cvUrl: true,
                  bio: true,
                  course: true,
                  graduationYear: true,
                  linkedinUrl: true,
                  githubUrl: true,
                  portfolioUrl: true,
                  university: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!job) notFound();

  const total = job.applications.length;
  const counts = {
    PENDING: job.applications.filter((a) => a.status === "PENDING").length,
    UNDER_REVIEW: job.applications.filter((a) => a.status === "UNDER_REVIEW").length,
    SHORTLISTED: job.applications.filter((a) => a.status === "SHORTLISTED").length,
    ACCEPTED: job.applications.filter((a) => a.status === "ACCEPTED").length,
    REJECTED: job.applications.filter((a) => a.status === "REJECTED").length,
  };
  const filteredApplications = job.applications.filter((application) => {
    const profile = application.applicant.profile;
    const searchable = [application.applicant.name, application.applicant.email, profile?.course, profile?.qualification, profile?.university, profile?.careerField].filter(Boolean).join(" ").toLowerCase();
    return (!query || searchable.includes(query)) && (selectedStatus === "ALL" || application.status === selectedStatus);
  });

  return (
    <main className="mx-auto max-w-6xl space-y-6 pb-12">
      <Link
        href={`/business/jobs/${job.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-700"
      >
        <ArrowLeft className="size-4" /> Back to job details
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
          {business.companyName}
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Applicants
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="size-4" /> {job.title}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" /> {total} {total === 1 ? "application" : "applications"}
              </span>
            </p>
          </div>
          <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Job: {statusLabel(job.status)}
          </span>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Pending", value: counts.PENDING },
            { label: "Under review", value: counts.UNDER_REVIEW },
            { label: "Shortlisted", value: counts.SHORTLISTED },
            { label: "Accepted", value: counts.ACCEPTED },
            { label: "Rejected", value: counts.REJECTED },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>

        <form method="GET" className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search name, email, course, university..."
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
          <select
            name="status"
            defaultValue={selectedStatus}
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button type="submit" className="min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">
            Filter applicants
          </button>
          {(query || selectedStatus !== "ALL") && (
            <Link href={`/business/jobs/${job.id}/applicants`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Clear
            </Link>
          )}
        </form>
        <p className="text-sm text-slate-500">
          Showing {filteredApplications.length} of {total} applications
        </p>
      </section>

      {filteredApplications.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <Users className="mx-auto size-9 text-slate-400" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            {total === 0 ? "No applicants yet" : "No matching applicants"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {total === 0
              ? "Applications for this job will appear here when graduates apply."
              : "Try another search term or choose a different status filter."}
          </p>
        </section>
      ) : (
        <div className="space-y-5">
          {filteredApplications.map((application) => {
            const profile = application.applicant.profile;

            return (
              <article
                key={application.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-950">
                      {application.applicant.name}
                    </h2>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      {application.applicant.email}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Applied {new Date(application.appliedAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(application.status)}`}>
                      {statusLabel(application.status)}
                    </span>
                  </div>

                  <div className="w-full lg:w-auto">
                    <BusinessApplicantStatus
                      applicationId={application.id}
                      currentStatus={application.status}
                    />
                  </div>
                </div>

                <div className="my-5 border-t border-slate-100" />

                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <GraduationCap className="size-4 text-orange-600" /> Graduate profile
                </h3>

                {profile ? (
                  <>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        ["Qualification", profile.qualification],
                        ["Course", profile.course],
                        ["University", profile.university],
                        ["Graduation year", profile.graduationYear ? String(profile.graduationYear) : null],
                        ["Career field", profile.careerField],
                        ["Preferred role", profile.preferredRole],
                        ["Phone", profile.phone],
                        ["Location", profile.location],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="mt-1 break-words text-sm font-medium text-slate-800">
                            {value || "Not provided"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {profile.bio && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">About</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{profile.bio}</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      {profile.cvUrl && (
                        <a
                          href={profile.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                        >
                          <FileText className="size-4" /> View CV
                        </a>
                      )}
                      {profile.linkedinUrl && (
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                          LinkedIn
                        </a>
                      )}
                      {profile.portfolioUrl && (
                        <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                          Portfolio
                        </a>
                      )}
                      {profile.githubUrl && (
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                          GitHub
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">This graduate has not completed their profile yet.</p>
                )}

                <div className="my-5 border-t border-slate-100" />
                <h3 className="text-sm font-bold text-slate-900">Cover letter</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {application.coverLetter || "No cover letter was submitted."}
                </p>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <MapPin className="size-3.5" />
        Applicant details are visible only to the business that owns this listing.
      </div>
    </main>
  );
}



