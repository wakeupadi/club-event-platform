"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Club = {
  id: string;
  name: string;
};

export function ClubSelector() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch("/api/club-session", { credentials: "include" });
        if (sessionRes.ok) {
          const sessionData = (await sessionRes.json()) as { currentClubId?: string | null };
          setSelected(sessionData.currentClubId ?? "");
        }

        const clubsRes = await fetch("/api/clubs");
        if (clubsRes.ok) {
          const clubsData = await clubsRes.json();
          setClubs(clubsData.clubs ?? []);
        }
      } catch (err) {
        console.error("Error loading club selector data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function selectClub(clubId: string) {
    const response = await fetch("/api/club-session", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clubId }),
    });

    if (response.ok) {
      setSelected(clubId);
      await router.refresh();
    }
  }

  async function signOutClub() {
    const response = await fetch("/api/club-session/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      setSelected("");
      await router.refresh();
    }
  }

  if (loading) return <div className="text-sm text-zinc-400">Loading…</div>;

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="club-selector" className="text-xs uppercase tracking-[0.18em] text-zinc-400">
        Club
      </label>
      <select
        id="club-selector"
        value={selected}
        onChange={(event) => selectClub(event.target.value)}
        className="rounded-lg border border-zinc-700 bg-[#111111] px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-zinc-500"
      >
        <option value="" disabled={selected !== ""}>
          {selected ? "Switch club..." : "Select a club"}
        </option>
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>
      {selected && (
        <button
          onClick={signOutClub}
          className="rounded-lg border border-zinc-700 bg-[#111111] px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-900"
        >
          Clear
        </button>
      )}
    </div>
  );
}
