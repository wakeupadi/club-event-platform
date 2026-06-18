"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEventAction } from "@/app/actions/event-actions";
import { getClubs } from "@/app/actions/club-actions";
import { suggestBestDates, getCalendarFlags } from "@/app/actions/suggest-dates"; // NEW: Algorithm import
import { FlaggedCalendar } from "@/components/dashboard/flagged-calendar";

export default function CreateEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([]);
  const [activeClubId, setActiveClubId] = useState("");
  
  // NEW STATE FOR THE ALGORITHM
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [calendarFlags, setCalendarFlags] = useState<any[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const dbClubs = await getClubs();
      setClubs(dbClubs);

      try {
        const res = await fetch("/api/club-session");
        if (res.ok) {
          const data = await res.json();
          if (data.currentClubId) {
            setActiveClubId(data.currentClubId);
          }
        }
      } catch (err) {
        console.error("Failed to load active club session:", err);
      }
    }
    loadData();
  }, []);

  // Trigger the Conflict Resolution Engine
  async function handleGetSuggestions() {
    setIsSuggesting(true);
    const [optimalDates, flags] = await Promise.all([
      suggestBestDates(),
      getCalendarFlags()
    ]);
    setSuggestions(optimalDates);
    setCalendarFlags(flags);
    setIsSuggesting(false);
  }

  // Auto-fill the form when a user clicks a suggestion
  function applyDate(dateString: string) {
    const dateInput = document.getElementById("date") as HTMLInputElement;
    if (dateInput) {
      dateInput.value = dateString;
      setSuggestions([]); // Hide the suggestions after picking one
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createEventAction(formData);

    if (result.success) {
      router.push("/");
    } else {
      alert(result.error ?? "Something went wrong saving the event.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl w-full p-8 bg-[#0a0a0a] rounded-xl border border-zinc-800 shadow-2xl">
      <h2 className="text-2xl font-serif text-zinc-100 mb-2">Create New Event</h2>
      <p className="text-zinc-400 mb-8 text-sm">
        Publish an upcoming club session or workshop to the campus timeline.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* The Club Selection Dropdown */}
        <div>
          <label htmlFor="clubId" className="block text-sm font-medium text-zinc-300 mb-2">Hosting Club</label>
          <select
            id="clubId"
            name="clubId"
            required
            value={activeClubId}
            onChange={(e) => setActiveClubId(e.target.value)}
            className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all appearance-none"
          >
            <option value="" disabled>Select a registered club...</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600"
            placeholder="e.g., Advanced Graph Theory Workshop"
          />
        </div>

        {/* Date and Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* UPGRADED: Date with Smart Suggestions */}
          <div className="relative">
            <div className="flex justify-between items-end mb-2">
              <label htmlFor="date" className="block text-sm font-medium text-zinc-300">Date</label>
              <button 
                type="button" 
                onClick={handleGetSuggestions}
                disabled={isSuggesting}
                className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 bg-[#1a1a1a] px-2 py-1.5 rounded border border-zinc-800 hover:border-zinc-600"
              >
                ✨ {isSuggesting ? "Calculating..." : "Suggest Best Dates"}
              </button>
            </div>
            
            <input
              type="date"
              id="date"
              name="date"
              required
              className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all"
              style={{ colorScheme: "dark" }} 
            />

            {/* The Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="mt-4">
                <div className="mb-4 bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
                  <div className="px-4 py-2 bg-zinc-800/50 border-b border-zinc-800 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Top Recommended Dates
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {suggestions.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyDate(slot.date)}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-800/80 transition-colors flex flex-col gap-1"
                      >
                        <span className="font-medium text-emerald-400">{slot.displayDate}</span>
                        <span className="text-xs text-zinc-400">{slot.reason}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Visual Calendar */}
                <FlaggedCalendar 
                  suggestions={suggestions} 
                  flags={calendarFlags} 
                  onSelectDate={applyDate} 
                />
              </div>
            )}
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-zinc-300 mb-2">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              required
              className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-2">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600"
            placeholder="e.g., CEP Building, Room 104"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="w-full bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all resize-none placeholder:text-zinc-600"
            placeholder="What should students expect at this event?"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-100 text-black font-semibold rounded-lg px-4 py-3.5 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isSubmitting ? "Publishing..." : "Publish Event"}
          </button>
        </div>
      </form>
    </div>
  );
}