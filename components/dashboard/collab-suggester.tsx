"use client";

import { useState } from "react";

export type ClubSuggestion = {
  id: string;
  name: string;
  score: number;
  reason: string;
};

type CollabSuggesterProps = {
  clubId: string;
};

export function CollabSuggester({ clubId }: CollabSuggesterProps) {
  const [suggestions, setSuggestions] = useState<ClubSuggestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFindCollaborators() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/collab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clubId }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error ?? "Could not fetch collaborators.");
        setSuggestions([]);
      } else {
        setSuggestions(data.suggestions ?? []);
      }
    } catch {
      setError("Network error while finding collaborators.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <button
        type="button"
        onClick={handleFindCollaborators}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-[#111111] px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Finding collaborators..." : "Find Collaborators"}
      </button>

      {error ? (
        <div className="rounded-xl border border-red-600/30 bg-[#111111] p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {suggestions && suggestions.length > 0 ? (
        <div className="grid gap-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="rounded-2xl border border-zinc-800 bg-[#111111] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">{suggestion.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{suggestion.reason}</p>
                </div>
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
                  {suggestion.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {suggestions && suggestions.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-4 text-sm text-zinc-400">
          No strong collaborator matches found yet.
        </div>
      ) : null}
    </div>
  );
}
