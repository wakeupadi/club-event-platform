const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== SEEDING MOCK COLLABORATION DATA ===");

  // 1. Clean up existing data first
  console.log("Clearing existing events, RSVPs, clubs, and users...");
  await prisma.rSVP.deleteMany();
  await prisma.event.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Mock Clubs
  console.log("Creating clubs...");
  const dadc = await prisma.club.create({ data: { name: "DADC (Dance Club)" } });
  const gdc = await prisma.club.create({ data: { name: "Google Developer Club" } });
  const music = await prisma.club.create({ data: { name: "Music Club" } });
  const dtg = await prisma.club.create({ data: { name: "DTG (Drama Club)" } });

  // 3. Create Mock Users (Students)
  console.log("Creating students...");
  const user1 = await prisma.user.create({ data: { id: "student-1", name: "Aarav Sharma", points: 40 } });
  const user2 = await prisma.user.create({ data: { id: "student-2", name: "Ananya Patel", points: 30 } });
  const user3 = await prisma.user.create({ data: { id: "student-3", name: "Kabir Mehta", points: 10 } });
  const user4 = await prisma.user.create({ data: { id: "student-4", name: "Riya Sen", points: 20 } });
  const user5 = await prisma.user.create({ data: { id: "student-5", name: "Dev Shah", points: 0 } });

  // 4. Create Mock Events
  console.log("Creating events...");
  const e1 = await prisma.event.create({
    data: {
      title: "Hip Hop Dance Workshop",
      date: new Date("2026-07-20T10:00:00+05:30"),
      location: "OAT",
      description: "Learn basic hip hop moves with DADC.",
      clubId: dadc.id
    }
  });

  const e2 = await prisma.event.create({
    data: {
      title: "React Web Buildathon",
      date: new Date("2026-07-21T13:00:00+05:30"),
      location: "CEP-104",
      description: "Build high performance React web apps with GDC.",
      clubId: gdc.id
    }
  });

  const e3 = await prisma.event.create({
    data: {
      title: "Unplugged Acoustic Jam",
      date: new Date("2026-07-22T17:00:00+05:30"),
      location: "OAT",
      description: "Show off your vocal and guitar skills with Music Club.",
      clubId: music.id
    }
  });

  const e4 = await prisma.event.create({
    data: {
      title: "Street Play Auditions",
      date: new Date("2026-07-23T15:00:00+05:30"),
      location: "LT-1 foyer",
      description: "Join the DTG street play group.",
      clubId: dtg.id
    }
  });

  // 5. Create RSVPs (Audience Overlaps)
  console.log("Adding registrations (RSVPs)...");

  // DADC RSVPs (Aarav, Ananya, Kabir) - total 3
  await prisma.rSVP.create({ data: { userId: user1.id, eventId: e1.id } });
  await prisma.rSVP.create({ data: { userId: user2.id, eventId: e1.id } });
  await prisma.rSVP.create({ data: { userId: user3.id, eventId: e1.id } });

  // GDC RSVPs (Aarav, Ananya, Riya) - shares Aarav & Ananya with DADC (overlap = 2)
  await prisma.rSVP.create({ data: { userId: user1.id, eventId: e2.id } });
  await prisma.rSVP.create({ data: { userId: user2.id, eventId: e2.id } });
  await prisma.rSVP.create({ data: { userId: user4.id, eventId: e2.id } });

  // Music RSVPs (Aarav, Dev) - shares Aarav with DADC (overlap = 1)
  await prisma.rSVP.create({ data: { userId: user1.id, eventId: e3.id } });
  await prisma.rSVP.create({ data: { userId: user5.id, eventId: e3.id } });

  // DTG RSVPs (Dev) - shares Dev with Music, shares 0 with DADC (overlap = 0)
  await prisma.rSVP.create({ data: { userId: user5.id, eventId: e4.id } });

  console.log("Mock data successfully seeded!");
  console.log("\nExpected outcomes for 'DADC (Dance Club)':");
  console.log("1. Google Developer Club (Overlap: 2 students - Aarav, Ananya)");
  console.log("2. Music Club             (Overlap: 1 student - Aarav)");
  console.log("3. DTG (Drama Club)       (Overlap: 0 students)");
}

main()
  .catch((e) => console.error("Mock seeding failed:", e))
  .finally(() => prisma.$disconnect());
