import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

type CookieValue = { value: string };

type CookieStore = {
  get(name: string): CookieValue | undefined;
};

function isCookieStore(value: unknown): value is CookieStore {
  return typeof value === "object" && value !== null && typeof (value as CookieStore).get === "function";
}

async function getCookieValue(name: string) {
  const cookieStore = await cookies();
  const cookie = isCookieStore(cookieStore) ? cookieStore.get(name) : undefined;
  if (cookie?.value) {
    return cookie.value;
  }

  const headerStore = await headers();
  const cookieHeader = headerStore.get?.("cookie");
  if (!cookieHeader || typeof cookieHeader !== "string") {
    return undefined;
  }

  const cookiePairs = cookieHeader.split(";").map((cookieString) => cookieString.trim());
  for (const pair of cookiePairs) {
    const [key, ...valueParts] = pair.split("=");
    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return undefined;
}

export async function getCurrentUser() {
  const cookieValue = await getCookieValue("current-user-id");
  if (!cookieValue) {
    return null;
  }

  return prisma.user.upsert({
    where: { id: cookieValue },
    update: {},
    create: {
      id: cookieValue,
      name: "Campus User",
      points: 0,
    },
  });
}

export async function getCurrentClub() {
  const cookieValue = await getCookieValue("current-club-id");
  if (!cookieValue) {
    return null;
  }

  return prisma.club.upsert({
    where: { id: cookieValue },
    update: {},
    create: {
      id: cookieValue,
      name: "Club",
      verified: true,
    },
  });
}

export async function getActiveRole(): Promise<"student" | "club"> {
  const cookieValue = await getCookieValue("active-role");
  return cookieValue === "club" ? "club" : "student";
}
