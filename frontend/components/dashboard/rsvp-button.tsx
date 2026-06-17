"use client";

import { useState } from "react";
import { rsvpToEvent } from "@/app/actions/rsvp-actions";

export function RsvpButton({ eventId, initialRegistered = false }: { eventId: string; initialRegistered?: boolean }) {
  const [isRegistered, setIsRegistered] = useState(initialRegistered);
  const [isPending, setIsPending] = useState(false);

  async function handleRsvp() {
    setIsPending(true);
    
    const result = await rsvpToEvent(eventId);
    alert(result.message); // A quick native alert to show success or failure
    
    if (result.success) {
      setIsRegistered(true);
    }
    
    setIsPending(false);
  }

  return (
    <button
      onClick={handleRsvp}
      disabled={isPending || isRegistered}
      className={`mt-4 w-full font-semibold rounded-lg px-4 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isRegistered
          ? "bg-zinc-900 text-zinc-500 border border-zinc-800"
          : "bg-sidebar-accent text-sidebar-accent-foreground hover:opacity-90"
      }`}
    >
      {isPending ? "Processing..." : isRegistered ? "✓ Registered" : "Join Event (+10 Pts)"}
    </button>
  );
}