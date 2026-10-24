const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.$queryRaw`
    SELECT t.typname AS enum_name, e.enumlabel AS enum_value
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname IN ('JobStatus', 'Role')
    ORDER BY t.typname, e.enumsortorder
  `;

  console.table(rows);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
