import { PrismaClient, Role, JobStatus, EmploymentType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@employa.com",
    },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@employa.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Graduate
  const graduate = await prisma.user.upsert({
    where: {
      email: "graduate@employa.com",
    },
    update: {},
    create: {
      name: "John Graduate",
      email: "graduate@employa.com",
      password: hashedPassword,
      role: Role.GRADUATE,
    },
  });

  await prisma.profile.upsert({
    where: {
      userId: graduate.id,
    },
    update: {},
    create: {
      userId: graduate.id,
      university: "University of Nigeria",
      course: "Computer Science",
      graduationYear: 2026,
      location: "Enugu",
    },
  });

  await prisma.job.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Frontend Developer",
        company: "TechNova Ltd",
        category: "Software Engineering",
        description: "Develop modern web applications.",
        requirements: "React, Next.js",
        skills: "React, TypeScript",
        location: "Lagos",
        salary: "₦450,000/month",
        employmentType: EmploymentType.FULL_TIME,
        deadline: new Date("2027-01-31"),
        featured: true,
        status: JobStatus.OPEN,
        createdById: admin.id,
      },
      {
        title: "Backend Engineer",
        company: "CloudStack",
        category: "Software Engineering",
        description: "Develop backend APIs.",
        requirements: "Node.js, PostgreSQL",
        skills: "Node.js, Prisma",
        location: "Remote",
        salary: "₦600,000/month",
        employmentType: EmploymentType.REMOTE,
        deadline: new Date("2027-02-15"),
        featured: false,
        status: JobStatus.OPEN,
        createdById: admin.id,
      },
    ],
  });

  console.log("✅ Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });