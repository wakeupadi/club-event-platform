"use client";

import { useState } from "react";
import { rsvpToEvent } from "@/app/actions/rsvp-actions";

export function RsvpButton({ eventId }: { eventId: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleRsvp() {
    setIsPending(true);
    
    const result = await rsvpToEvent(eventId);
    alert(result.message); // A quick native alert to show success or failure
    
    setIsPending(false);
  }

  return (
    <button
      onClick={handleRsvp}
      disabled={isPending}
      className="mt-4 w-full bg-sidebar-accent text-sidebar-accent-foreground font-semibold rounded-lg px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "Processing..." : "Join Event (+10 Pts)"}
    </button>
  );
}