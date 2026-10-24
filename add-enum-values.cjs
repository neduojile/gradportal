const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(
    `ALTER TYPE "JobStatus" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL'`
  );
  console.log("Added PENDING_APPROVAL");

  await prisma.$executeRawUnsafe(
    `ALTER TYPE "JobStatus" ADD VALUE IF NOT EXISTS 'REJECTED'`
  );
  console.log("Added REJECTED");

  await prisma.$executeRawUnsafe(
    `ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'BUSINESS_OWNER'`
  );
  console.log("Added BUSINESS_OWNER");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
