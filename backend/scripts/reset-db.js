const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== RESETTING DATABASE ===");
  
  console.log("Deleting RSVPs...");
  await prisma.rSVP.deleteMany();
  
  console.log("Deleting Events...");
  await prisma.event.deleteMany();
  
  console.log("Deleting Clubs...");
  await prisma.club.deleteMany();
  
  console.log("Deleting Users...");
  await prisma.user.deleteMany();
  
  console.log("Deleting Academic Calendar...");
  await prisma.academicCalendar.deleteMany();
  
  console.log("Database reset successfully!");
}

main()
  .catch((e) => console.error("Reset failed:", e))
  .finally(() => prisma.$disconnect());
