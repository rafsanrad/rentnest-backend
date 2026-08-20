import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // =========================
  // 1. Create Admin
  // =========================

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@rentnest.com",
    },
    update: {},
    create: {
      name: "RentNest Admin",
      email: "admin@rentnest.com",
      password: hashedPassword,
      role: "ADMIN",
      phone: "01700000000",
      address: "Dhaka, Bangladesh",
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);

  // =========================
  // 2. Create Categories
  // =========================

  const categories = [
    {
      name: "Apartment",
      description: "Modern apartments for rent",
    },
    {
      name: "House",
      description: "Houses available for rent",
    },
    {
      name: "Studio",
      description: "Compact studio apartments",
    },
    {
      name: "Villa",
      description: "Spacious villas for rent",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name: category.name,
      },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories created");
  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });