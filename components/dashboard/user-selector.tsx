"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserOption = {
  id: string;
  name: string;
};

export function UserSelector() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch("/api/session", { credentials: "include" });
        if (sessionRes.ok) {
          const sessionData = (await sessionRes.json()) as { currentUserId?: string | null };
          setSelected(sessionData.currentUserId ?? "");
        }

        const usersRes = await fetch("/api/users");
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users ?? []);
        }
      } catch (err) {
        console.error("Error loading user selector data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function signInUser(userId: string) {
    const response = await fetch("/api/session", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      setSelected(userId);
      window.location.reload();
    }
  }

  async function signOutUser() {
    const response = await fetch("/api/session/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      setSelected("");
      window.location.reload();
    }
  }

  if (loading) return <div className="text-sm text-zinc-400">Loading…</div>;

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="user-selector" className="text-xs uppercase tracking-[0.18em] text-zinc-400">
        Profile
      </label>
      <select
        id="user-selector"
        value={selected}
        onChange={(event) => signInUser(event.target.value)}
        className="rounded-lg border border-zinc-700 bg-card/80 backdrop-blur-xl shadow-2xl px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-zinc-500"
      >
        <option value="" disabled={selected !== ""}>
          {selected ? "Switch profile..." : "Signed out"}
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      {selected && (
        <button
          onClick={signOutUser}
          className="rounded-lg border border-zinc-700 bg-card/80 backdrop-blur-xl shadow-2xl px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-900"
        >
          Sign out
        </button>
      )}
    </div>
  );
}
