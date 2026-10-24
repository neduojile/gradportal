import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building2,
  BriefcaseBusiness,
  Bell,
  CalendarDays,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function BusinessSettingsPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "BUSINESS_OWNER") {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const [business, totalJobs, openJobs, pendingJobs] = await Promise.all([
    prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        companyName: true,
        industry: true,
        businessEmail: true,
        businessPhone: true,
        verificationStatus: true,
        updatedAt: true,
      },
    }),
    prisma.job.count({
      where: { business: { userId: session.user.id } },
    }),
    prisma.job.count({
      where: {
        business: { userId: session.user.id },
        status: "OPEN",
      },
    }),
    prisma.job.count({
      where: {
        business: { userId: session.user.id },
        status: "PENDING_APPROVAL",
      },
    }),
  ]);

  const verification = business?.verificationStatus ?? "PROFILE_REQUIRED";
  const statusStyles: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    REJECTED: "bg-red-50 text-red-700",
    FLAGGED: "bg-red-50 text-red-700",
    PROFILE_REQUIRED: "bg-slate-100 text-slate-600",
  };

  const sections = [
    {
      title: "Company information",
      description: "Edit your company name, industry, contact details, website and description.",
      href: "/business/profile",
      action: "Edit profile",
      icon: Building2,
    },
    {
      title: "Recruitment and job postings",
      description: "Manage job listings, check approval status and review applicants.",
      href: "/business/jobs",
      action: "Manage jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "Notifications",
      description: "View account and recruitment updates, and mark notifications as read.",
      href: "/business/notifications",
      action: "View notifications",
      icon: Bell,
    },
    {
      title: "Messages",
      description: "Open the business messaging workspace.",
      href: "/business/messages",
      action: "Open messages",
      icon: MessageCircle,
    },
    {
      title: "Interviews",
      description: "Open your interview workspace.",
      href: "/business/interviews",
      action: "Manage interviews",
      icon: CalendarDays,
    },
    {
      title: "Reviews",
      description: "Open your company review workspace.",
      href: "/business/reviews",
      action: "View reviews",
      icon: Star,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-7 pb-10">
      <header>
        <p className="text-sm font-semibold text-orange-600">Account and preferences</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Business settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your company profile, recruitment workspace and account information.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total job postings", value: totalJobs },
          { label: "Open jobs", value: openJobs },
          { label: "Awaiting approval", value: pendingJobs },
          { label: "Verification", value: verification.replaceAll("_", " ") },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-bold capitalize text-slate-950">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Building2 className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                {business?.companyName ?? "Company profile not set up"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {business?.industry || "Add your industry in your company profile"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {business?.businessEmail || session.user.email || "No email available"}
              </p>
              {business?.businessPhone && (
                <p className="mt-1 text-sm text-slate-600">{business.businessPhone}</p>
              )}
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              statusStyles[verification] ?? statusStyles.PROFILE_REQUIRED
            }`}
          >
            {verification.replaceAll("_", " ")}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link
            href="/business/profile"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
          >
            <UserRound className="size-4" />
            Manage company profile
          </Link>
          <Link
            href="/business"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to dashboard
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-bold text-slate-950">Workspace settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Open each section to manage its available features.
          </p>
        </div>

        {sections.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center gap-4 border-b border-slate-100 p-5 last:border-b-0 hover:bg-slate-50 sm:px-6"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900">{item.title}</span>
                <span className="mt-1 block text-sm leading-5 text-slate-500">
                  {item.description}
                </span>
              </span>
              <span className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-orange-600 sm:flex">
                {item.action}
                <ChevronRight className="size-4" />
              </span>
              <ChevronRight className="size-5 shrink-0 text-slate-400 sm:hidden" />
            </Link>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-slate-500" />
          <div>
            <h2 className="font-semibold text-slate-900">Account security</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Signed in as {session.user.email}. Password changes and persistent
              notification preferences are not exposed here until their corresponding
              authenticated actions and storage are implemented.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
