import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  const now = new Date();

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    applicationCount,
    savedJobsCount,
    availableJobsCount,
    profile,
    recentApplications,
    notifications,
    recommendedJobs,
    recentActivity,
  ] = await Promise.all([
    prisma.application.count({
      where: { applicantId: userId },
    }),

    prisma.savedJob.count({
      where: { userId },
    }),

    prisma.job.count({
      where: { status: "OPEN" },
    }),

    prisma.profile.findUnique({
      where: { userId },
      select: {
        phone: true,
        location: true,
        careerField: true,
        preferredRole: true,
        qualification: true,
        cvUrl: true,
        profileImage: true,
      },
    }),

    prisma.application.findMany({
      where: { applicantId: userId },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        job: {
          select: {
            title: true,
            category: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
      take: 5,
    }),

    prisma.notification.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    prisma.job.findMany({
      where: {
        status: "OPEN",
        deadline: { gt: now },
      },
      select: {
        id: true,
        title: true,
        category: true,
        location: true,
        deadline: true,
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
      take: 5,
    }),

    prisma.application.findMany({
      where: {
        applicantId: userId,
        appliedAt: {
          gte: sevenDaysAgo,
          lte: now,
        },
      },
      select: {
        appliedAt: true,
      },
    }),
  ]);

  const profileFields = [
    profile?.phone,
    profile?.location,
    profile?.careerField,
    profile?.preferredRole,
    profile?.qualification,
    profile?.cvUrl,
    profile?.profileImage,
  ];

  const completedProfileFields = profileFields.filter(Boolean).length;
  const profileStrength = `${Math.round(
    (completedProfileFields / profileFields.length) * 100,
  )}%`;

  const activity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const count = recentActivity.filter(
      (application) =>
        application.appliedAt >= dayStart &&
        application.appliedAt <= dayEnd,
    ).length;

    return {
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      value: count,
    };
  });

  return {
    stats: {
      applicationCount,
      savedJobsCount,
      availableJobsCount,
      profileStrength,
    },
    activity,
    recentApplications,
    notifications,
    recommendedJobs,
    profile,
  };
}
