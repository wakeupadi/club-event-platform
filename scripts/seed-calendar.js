const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DA-IICT Academic Calendar...');

  // Wipe existing calendar data
  await prisma.academicCalendar.deleteMany();

  const today = new Date();
  
  // Mid-Semester Exams starting 10 days from today, lasting 5 days
  const midSemStart = new Date(today);
  midSemStart.setDate(today.getDate() + 10);
  const midSemEnd = new Date(midSemStart);
  midSemEnd.setDate(midSemStart.getDate() + 5);

  // End-Semester Exams starting 40 days from today, lasting 10 days
  const endSemStart = new Date(today);
  endSemStart.setDate(today.getDate() + 40);
  const endSemEnd = new Date(endSemStart);
  endSemEnd.setDate(endSemStart.getDate() + 10);

  // Diwali Break (HOLIDAY)
  const diwaliStart = new Date(today);
  diwaliStart.setDate(today.getDate() + 25);
  const diwaliEnd = new Date(diwaliStart);
  diwaliEnd.setDate(diwaliStart.getDate() + 5);

  const events = [
    {
      title: "Mid-Semester Exams",
      startDate: midSemStart,
      endDate: midSemEnd,
      type: "EXAM"
    },
    {
      title: "End-Semester Exams",
      startDate: endSemStart,
      endDate: endSemEnd,
      type: "EXAM"
    },
    {
      title: "Diwali Break",
      startDate: diwaliStart,
      endDate: diwaliEnd,
      type: "HOLIDAY"
    }
  ];

  for (const ev of events) {
    await prisma.academicCalendar.create({ data: ev });
    console.log(`Created: ${ev.title} (${ev.startDate.toDateString()} to ${ev.endDate.toDateString()})`);
  }

  console.log('Academic Calendar seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
