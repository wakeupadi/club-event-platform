"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RoleSwitcherProps = {
  initialRole: "student" | "club";
};

export function RoleSwitcher({ initialRole }: RoleSwitcherProps) {
  const [role, setRole] = useState<"student" | "club">(initialRole);
  const router = useRouter();

  async function toggleRole(newRole: "student" | "club") {
    if (newRole === role) return;

    try {
      const res = await fetch("/api/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setRole(newRole);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to switch role:", err);
    }
  }

  return (
    <div className="flex bg-[#121214] p-1 rounded-lg border border-zinc-850">
      <button
        type="button"
        onClick={() => toggleRole("student")}
        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          role === "student"
            ? "bg-zinc-800 text-zinc-100 shadow-sm"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        Student Mode
      </button>
      <button
        type="button"
        onClick={() => toggleRole("club")}
        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          role === "club"
            ? "bg-zinc-800 text-zinc-100 shadow-sm"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        Club Mode
      </button>
    </div>
  );
}
