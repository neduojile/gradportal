import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EditBusinessJobForm from "./edit-business-job-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBusinessJobPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (session.user.role !== "BUSINESS_OWNER") {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const { id } = await params;

  const business = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!business) notFound();

  const job = await prisma.job.findFirst({
    where: { id, businessId: business.id },
  });

  if (!job) notFound();

  if (job.status === "CLOSED") {
    redirect(`/business/jobs/${job.id}`);
  }

  return (
    <EditBusinessJobForm
      job={{
        id: job.id,
        title: job.title,
        category: job.category,
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        deadline: job.deadline.toISOString().slice(0, 10),
        employmentType: job.employmentType,
        salary: job.salary ?? "",
        skills: job.skills ?? "",
      }}
    />
  );
}
