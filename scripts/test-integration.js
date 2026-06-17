const { prisma } = require("../lib/prisma");
const { suggestBestDates } = require("../app/actions/suggest-dates");
const { createEventAction } = require("../app/actions/event-actions");
const { suggestCollaborators } = require("../app/actions/collab-actions");

async function runTests() {
  console.log("=== STARTING INTEGRATION TESTS ===");

  // 1. Test Date Suggestions
  console.log("\n--- Testing suggestBestDates algorithm ---");
  const suggestions = await suggestBestDates();
  console.log("Suggestions returned:", suggestions.length);
  if (suggestions.length > 0) {
    console.log("First suggestion details:", suggestions[0]);
    // Check for correct date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const isValidFormat = dateRegex.test(suggestions[0].date);
    console.log(`Date format valid (${suggestions[0].date})?`, isValidFormat);
    if (!isValidFormat) throw new Error("Suggested date has invalid format!");
  } else {
    throw new Error("No dates suggested!");
  }

  // 2. Test Club Collaborations
  console.log("\n--- Testing suggestCollaborators algorithm ---");
  const clubs = await prisma.club.findMany();
  if (clubs.length > 0) {
    const targetClub = clubs[0];
    console.log(`Checking collaborations for: ${targetClub.name} (${targetClub.id})`);
    const collabSuggestions = await suggestCollaborators(targetClub.id);
    console.log("Collaborator matches:", collabSuggestions);
  } else {
    console.log("No clubs in database to test collaborations.");
  }

  // 3. Test 2-Hour Gap Collision Validation
  console.log("\n--- Testing 2-hour minimum event gap validation ---");
  
  // Clean up any old test events
  await prisma.event.deleteMany({
    where: {
      title: { startsWith: "INTEGRATION_TEST_" }
    }
  });

  const testClub = clubs[0] || await prisma.club.create({ data: { name: "Test Club" } });
  
  // Set up mock Form Data for Event 1 (July 20, 2026, 10:00 AM)
  const fd1 = new FormData();
  fd1.append("title", "INTEGRATION_TEST_EVENT_1");
  fd1.append("date", "2026-07-20");
  fd1.append("time", "10:00");
  fd1.append("location", "CEP-104");
  fd1.append("description", "Testing gap 1");
  fd1.append("clubId", testClub.id);

  console.log("Creating Event 1 on 2026-07-20 at 10:00...");
  const res1 = await createEventAction(fd1);
  console.log("Event 1 creation result:", res1);
  if (!res1.success) throw new Error("Failed to create Event 1: " + res1.error);

  // Set up mock Form Data for Event 2 (July 20, 2026, 11:00 AM) - Conflicting (1 hour gap)
  const fd2 = new FormData();
  fd2.append("title", "INTEGRATION_TEST_EVENT_2");
  fd2.append("date", "2026-07-20");
  fd2.append("time", "11:00");
  fd2.append("location", "CEP-104");
  fd2.append("description", "Testing gap 2");
  fd2.append("clubId", testClub.id);

  console.log("Attempting to create Event 2 on 2026-07-20 at 11:00 (expected conflict)...");
  const res2 = await createEventAction(fd2);
  console.log("Event 2 creation result:", res2);
  if (res2.success) {
    throw new Error("Validation failed: allowed creating conflicting event within 1 hour!");
  } else {
    console.log("Success: Conflict successfully blocked! Error returned:", res2.error);
  }

  // Clean up test events
  await prisma.event.deleteMany({
    where: {
      title: { startsWith: "INTEGRATION_TEST_" }
    }
  });
  console.log("Test events cleaned up.");

  console.log("\n=== ALL INTEGRATION TESTS PASSED SUCCESSFULLY ===");
}

runTests()
  .catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
