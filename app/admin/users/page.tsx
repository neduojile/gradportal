import Link from "next/link";
import { Prisma, Role } from "@prisma/client";
import { Building2, GraduationCap, Search, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import AccountReviewActions from "@/components/admin/users/AccountReviewActions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; role?: string }>;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const role = params.role ?? "ALL";

  const where: Prisma.UserWhereInput = {
    role: role === "GRADUATE" || role === "BUSINESS_OWNER"
      ? role
      : { in: ["GRADUATE", "BUSINESS_OWNER"] as const },
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { business: { is: { companyName: { contains: q, mode: "insensitive" as const } } } },
          ],
        }
      : {}),
  };

  const [accounts, graduates, businesses, pendingVerification] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        business: true,
        profile: true,
        _count: { select: { applications: true, createdJobs: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.user.count({ where: { role: "GRADUATE" } }),
    prisma.user.count({ where: { role: "BUSINESS_OWNER" } }),
    prisma.businessProfile.count({ where: { verificationStatus: "PENDING" } }),
  ]);

  return (
    <main className="space-y-7">
      <header>
        <p className="text-sm font-semibold text-orange-600">Platform Control</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Users & Businesses</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review business verification, manage account access, and inspect registered users.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Graduate accounts", value: graduates, icon: GraduationCap },
          { label: "Business accounts", value: businesses, icon: Building2 },
          { label: "Pending verification", value: pendingVerification, icon: Users },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <Icon className="h-5 w-5 text-orange-500" />
              <p className="mt-4 text-3xl font-black text-slate-950">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <form method="GET" className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, or company"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-orange-400"
            />
          </div>
          <select name="role" defaultValue={role} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">
            <option value="ALL">All account types</option>
            <option value="GRADUATE">Graduates</option>
            <option value="BUSINESS_OWNER">Businesses</option>
          </select>
          <button className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white">Search</button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Account</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Account details</th>
                <th className="px-5 py-4">Account status</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Admin actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-orange-50/30">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">{account.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{account.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      {account.role === "BUSINESS_OWNER" ? "Business" : "Graduate"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {account.role === "BUSINESS_OWNER" ? (
                      <>
                        <p className="font-medium text-slate-800">{account.business?.companyName ?? "Business profile incomplete"}</p>
                        <p className="mt-1 text-xs">Verification: {account.business?.verificationStatus ?? "Not submitted"}</p>
                        <p className="mt-1 text-xs">{account._count.createdJobs} jobs posted</p>
                      </>
                    ) : (
                      <>
                        <p>{account.profile?.university ?? "University not provided"}</p>
                        <p className="mt-1 text-xs">{account._count.applications} applications</p>
                      </>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      account.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {account.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{account.createdAt.toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <AccountReviewActions
                      userId={account.id}
                      userName={account.name}
                      isActive={account.isActive}
                      businessId={account.business?.id}
                      companyName={account.business?.companyName}
                      verificationStatus={account.business?.verificationStatus}
                    />
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                    No matching accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          Showing up to 100 accounts. Admin actions are recorded in the activity log.
        </p>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/admin/notifications" className="font-semibold text-orange-700 hover:underline">
          Send graduate announcement
        </Link>
        <Link href="/admin/settings" className="font-semibold text-orange-700 hover:underline">
          Platform settings
        </Link>
      </div>
    </main>
  );
}


