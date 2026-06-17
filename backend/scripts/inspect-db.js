const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== CLUBS ===");
  const clubs = await prisma.club.findMany();
  console.log(clubs);

  console.log("=== EVENTS ===");
  const events = await prisma.event.findMany();
  console.log(events);

  console.log("=== USERS ===");
  const users = await prisma.user.findMany();
  console.log(users);

  console.log("=== RSVPS ===");
  const rsvps = await prisma.rSVP.findMany();
  console.log(rsvps);

  console.log("=== ACADEMIC CALENDAR (BLACKOUTS) ===");
  const blackouts = await prisma.academicCalendar.findMany();
  console.log(blackouts);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
