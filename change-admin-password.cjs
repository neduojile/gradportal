const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

  try {
    const email = "admin@employa.com";
    const password = await ask("Enter the new admin password: ");

    if (password.length < 8) {
      console.log("Password must be at least 8 characters.");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true },
    });

    if (!user || user.role !== "ADMIN") {
      console.log("Admin account not found. No changes made.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash },
    });

    console.log("Admin password updated successfully.");
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Password update failed:", error.message);
  process.exitCode = 1;
});
