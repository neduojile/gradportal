import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BusinessProfileForm from "./business-profile-form";

export default async function BusinessProfilePage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  if (session.user.role !== "BUSINESS_OWNER") {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const business = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      documents: {
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          fileUrl: true,
          originalFilename: true,
          verificationStatus: true,
          createdAt: true,
          adminNotes: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen">
      <BusinessProfileForm
        initialValues={{
          companyName: business?.companyName ?? "",
          registrationNumber: business?.registrationNumber ?? "",
          industry: business?.industry ?? "",
          description: business?.description ?? "",
          website: business?.website ?? "",
          businessEmail: business?.businessEmail ?? session.user.email ?? "",
          businessPhone: business?.businessPhone ?? "",
          address: business?.address ?? "",
        }}
        verificationStatus={business?.verificationStatus ?? "PENDING"}
        verifiedAt={business?.verifiedAt?.toISOString() ?? null}
        documents={(business?.documents ?? []).map((document) => ({
          ...document,
          createdAt: document.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
