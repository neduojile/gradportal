import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

function csvCell(value: string | null | undefined) {
  const safe = (value ?? "").replace(/"/g, '""');
  return `"${safe}"`;
}

export async function GET() {
  await requireAdmin();

  const applications = await prisma.application.findMany({
    orderBy: { appliedAt: "desc" },
    select: {
      id: true,
      status: true,
      appliedAt: true,
      coverLetter: true,
      applicant: {
        select: {
          name: true,
          email: true,
          profile: {
            select: { phone: true, location: true, qualification: true },
          },
        },
      },
      job: {
        select: {
          title: true,
          company: true,
          location: true,
          employmentType: true,
        },
      },
    },
  });

  const headers = [
    "Application ID",
    "Candidate",
    "Email",
    "Phone",
    "Candidate Location",
    "Qualification",
    "Job Title",
    "Company",
    "Job Location",
    "Employment Type",
    "Status",
    "Applied At",
    "Cover Letter",
  ];

  const rows = applications.map((application) => [
    application.id,
    application.applicant.name,
    application.applicant.email,
    application.applicant.profile?.phone,
    application.applicant.profile?.location,
    application.applicant.profile?.qualification,
    application.job.title,
    application.job.company,
    application.job.location,
    application.job.employmentType.replaceAll("_", " "),
    application.status.replaceAll("_", " "),
    application.appliedAt.toISOString(),
    application.coverLetter,
  ]);

  const csv = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ].join("\r\n");

  return new NextResponse("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="employa-applications.csv"',
      "Cache-Control": "no-store",
    },
  });
}
