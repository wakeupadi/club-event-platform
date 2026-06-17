"use client";

import { useState } from "react";
import { createClubAction } from "@/app/actions/club-actions";

export function CreateClubForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createClubAction(formData);

    if (result?.success) {
      alert(result.message);
      (e.target as HTMLFormElement).reset(); // Clear the form instantly
    } else {
      alert(result?.error || "Failed to create club");
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="bg-sidebar p-6 rounded-xl border border-sidebar-border shadow-sm">
      <h3 className="text-lg font-semibold text-sidebar-foreground mb-1">Register a New Club</h3>
      <p className="text-sm text-muted-foreground mb-4">Create a space for your campus community to host events.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="name"
          required
          placeholder="e.g., DA-IICT Coding Club"
          className="flex-1 bg-background border border-sidebar-border rounded-lg px-4 py-2 text-sidebar-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-accent transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-sidebar-foreground text-background font-semibold rounded-lg px-6 py-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isSubmitting ? "Creating..." : "Create Club"}
        </button>
      </form>
    </div>
  );
}