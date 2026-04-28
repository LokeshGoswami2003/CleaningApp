import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { env } from "../src/config/env.js";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: {
      phone: env.ADMIN_PHONE
    },
    update: {
      fullName: env.ADMIN_FULL_NAME,
      email: env.ADMIN_EMAIL,
      passwordHash,
      role: "admin",
      isActive: true
    },
    create: {
      fullName: env.ADMIN_FULL_NAME,
      email: env.ADMIN_EMAIL,
      phone: env.ADMIN_PHONE,
      passwordHash,
      role: "admin",
      isActive: true
    }
  });

  console.log(`Seeded admin user: ${admin.phone}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
