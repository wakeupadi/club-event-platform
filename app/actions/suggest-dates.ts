"use server";

import { prisma } from "@/lib/prisma";

export async function suggestBestDates() {
  const today = new Date();
  const fortyFiveDaysFromNow = new Date();
  fortyFiveDaysFromNow.setDate(today.getDate() + 45);

  try {
    // 1. Fetch University Blackout Dates
    const blackoutDates = await prisma.academicCalendar.findMany({
      where: {
        endDate: { gte: today },
        startDate: { lte: fortyFiveDaysFromNow },
      },
    });

    // 2. Fetch Existing Club Events
    const existingEvents = await prisma.event.findMany({
      where: {
        date: { gte: today, lte: fortyFiveDaysFromNow },
      },
    });

    const scoredDates = [];

    // 3. Run the Scoring Algorithm for the next 45 days
    for (let i = 1; i <= 45; i++) {
      const testDate = new Date();
      testDate.setDate(today.getDate() + i);
      testDate.setHours(0, 0, 0, 0); // Normalize to midnight for clean comparisons

      let score = 50; // Every day starts with a base score
      let reasons: string[] = [];
      let isBlackout = false;

      // RULE 1: The Blackout Check (Instant Disqualification)
      for (const blackout of blackoutDates) {
        const bStart = new Date(blackout.startDate).setHours(0,0,0,0);
        const bEnd = new Date(blackout.endDate).setHours(0,0,0,0);
        
        if (testDate.getTime() >= bStart && testDate.getTime() <= bEnd) {
          isBlackout = true;
          break;
        }
      }
      if (isBlackout) continue; // Throw it in the trash, score is 0.

      // RULE 2: The Double-Booking Check
      const eventsOnDay = existingEvents.filter(e => {
        const eDate = new Date(e.date).setHours(0, 0, 0, 0);
        return eDate === testDate.getTime();
      });

      if (eventsOnDay.length > 0) {
        score -= (eventsOnDay.length * 20); // Heavy penalty for clashing
        reasons.push(`${eventsOnDay.length} other event(s) scheduled`);
      } else {
        score += 15;
        reasons.push("Clear campus schedule");
      }

      // RULE 3: The Prime-Time Bonus (Fridays and Saturdays)
      const dayOfWeek = testDate.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) { // 5 is Friday, 6 is Saturday
        score += 20;
        reasons.push("Prime weekend slot");
      }

      scoredDates.push({
        date: testDate.toISOString().split('T')[0], // Format as YYYY-MM-DD for the HTML input
        displayDate: testDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        score,
        reason: reasons.join(" • ")
      });
    }

    // 4. Sort by highest score and return the Top 3
    return scoredDates.sort((a, b) => b.score - a.score).slice(0, 3);
    
  } catch (error) {
    console.error("Algorithm failed:", error);
    return [];
  }
}