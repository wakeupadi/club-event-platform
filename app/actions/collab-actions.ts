"use server";

import { prisma } from "@/lib/prisma";

export type CollaboratorSuggestion = {
  id: string;
  name: string;
  score: number;
  reason: string;
};

export async function suggestCollaborators(clubId: string): Promise<CollaboratorSuggestion[]> {
  const targetRsvps = await prisma.rSVP.findMany({
    where: {
      event: {
        clubId,
      },
    },
    select: {
      userId: true,
    },
  });

  const targetAudience = new Set(targetRsvps.map((rsvp) => rsvp.userId));

  const otherClubs = await prisma.club.findMany({
    where: {
      id: {
        not: clubId,
      },
    },
    include: {
      events: {
        include: {
          RSVP: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });

  const suggestions = otherClubs.map((club) => {
    const otherAudience = new Set<string>();

    for (const event of club.events) {
      for (const rsvp of event.RSVP) {
        otherAudience.add(rsvp.userId);
      }
    }

    let overlap = 0;
    for (const userId of otherAudience) {
      if (targetAudience.has(userId)) {
        overlap += 1;
      }
    }

    return {
      id: club.id,
      name: club.name,
      score: overlap,
      reason: overlap > 0
        ? `Shares ${overlap} active student${overlap === 1 ? "" : "s"} with your audience.`
        : "No shared RSVP audience yet, but still a good match to expand reach.",
    };
  });

  return suggestions
    .sort((a, b) => b.score - a.score || b.name.localeCompare(a.name))
    .slice(0, 3);
}
