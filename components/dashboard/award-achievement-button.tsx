"use client";

import { useState } from "react";
import { awardAchievement } from "@/actions/achievements";

interface User {
  id: string;
  name: string;
}

interface AwardAchievementButtonProps {
  eventId: string;
  eventTitle: string;
  attendees: User[];
}

export function AwardAchievementButton({ eventId, eventTitle, attendees }: AwardAchievementButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(attendees.length > 0 ? attendees[0].id : "");
  const [title, setTitle] = useState("1st Place Winner");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (attendees.length === 0) return null;

  async function handleAward(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await awardAchievement(selectedUserId, eventId, title, description);
    
    if (result.success) {
      setMessage({ type: 'success', text: "Achievement successfully awarded!" });
      setTimeout(() => setIsOpen(false), 2000);
    } else {
      setMessage({ type: 'error', text: result.error || "Failed to award achievement." });
    }
    
    setLoading(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-3 text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded hover:bg-amber-500/20 transition-colors w-fit"
      >
        🏅 Award Participants
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">Award Achievement</h3>
            <p className="text-sm text-zinc-400 mb-6">Verify and award an accolade for {eventTitle}.</p>

            <form onSubmit={handleAward} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Select Student</label>
                <select 
                  className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-md p-2 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  required
                >
                  {attendees.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Achievement Title</label>
                <select 
                  className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-md p-2 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                >
                  <option value="1st Place Winner">1st Place Winner</option>
                  <option value="2nd Place Winner">2nd Place Winner</option>
                  <option value="3rd Place Winner">3rd Place Winner</option>
                  <option value="Lead Organizer">Lead Organizer</option>
                  <option value="Best Speaker">Best Speaker</option>
                  <option value="Participant">Participant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Description (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Led the winning team"
                  className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-md p-2 text-sm text-zinc-300 focus:outline-none focus:border-amber-500/50 placeholder:text-zinc-700"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Awarding...' : 'Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
