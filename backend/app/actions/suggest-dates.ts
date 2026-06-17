"use server";

import { prisma } from "@/lib/prisma";

function getKolkataDateString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === "year")!.value;
  const month = parts.find(p => p.type === "month")!.value;
  const day = parts.find(p => p.type === "day")!.value;
  return `${year}-${month}-${day}`;
}

export async function suggestBestDates() {
  try {
    const blackoutDates = await prisma.academicCalendar.findMany();
    const existingEvents = await prisma.event.findMany();

    const kolkataFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const parts = kolkataFormatter.formatToParts(new Date());
    const year = parseInt(parts.find(p => p.type === "year")!.value, 10);
    const month = parseInt(parts.find(p => p.type === "month")!.value, 10) - 1; // 0-indexed
    const day = parseInt(parts.find(p => p.type === "day")!.value, 10);

    const scoredDates = [];

    // Run the Scoring Algorithm for the next 45 days in Asia/Kolkata
    for (let i = 1; i <= 45; i++) {
      const testDate = new Date(Date.UTC(year, month, day + i));
      const targetYear = testDate.getUTCFullYear();
      const targetMonth = String(testDate.getUTCMonth() + 1).padStart(2, '0');
      const targetDay = String(testDate.getUTCDate()).padStart(2, '0');
      const dateStr = `${targetYear}-${targetMonth}-${targetDay}`;

      let score = 50; // Base score
      let reasons: string[] = [];
      let isBlackout = false;

      // RULE 1: The Blackout Check (Instant Disqualification)
      for (const blackout of blackoutDates) {
        const startStr = getKolkataDateString(blackout.startDate);
        const endStr = getKolkataDateString(blackout.endDate);
        
        if (dateStr >= startStr && dateStr <= endStr) {
          isBlackout = true;
          break;
        }
      }
      if (isBlackout) continue; // Instantly disqualified, do not score or suggest

      // RULE 2: The Double-Booking Check
      const eventsOnDay = existingEvents.filter(e => {
        const eDateStr = getKolkataDateString(e.date);
        return eDateStr === dateStr;
      });

      if (eventsOnDay.length > 0) {
        score -= (eventsOnDay.length * 20); // Penalty for clashing
        reasons.push(`${eventsOnDay.length} other event(s) scheduled`);
      } else {
        score += 15;
        reasons.push("Clear campus schedule");
      }

      // RULE 3: The Prime-Time Bonus (Fridays and Saturdays)
      const dayOfWeek = testDate.getUTCDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) { // 5 is Friday, 6 is Saturday
        score += 20;
        reasons.push("Prime weekend slot");
      }

      const displayDate = testDate.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      scoredDates.push({
        date: dateStr, // Format as YYYY-MM-DD
        displayDate,
        score,
        reason: reasons.join(" • ")
      });
    }

    // Sort by highest score and return the Top 3
    return scoredDates.sort((a, b) => b.score - a.score).slice(0, 3);
    
  } catch (error) {
    console.error("Algorithm failed:", error);
    return [];
  }
}