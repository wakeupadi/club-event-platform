import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function buildSetCookieHeader(name: string, value: string, maxAge: number) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Derive the redirect URI from the current request origin to avoid mismatches.
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/oauth/google`;

  // If there's no code, start the OAuth flow by redirecting the user to Google
  if (!code) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const scope = encodeURIComponent("openid email profile");
    const authUrl = `${GOOGLE_AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account`;

    return NextResponse.redirect(authUrl);
  }

  // Exchange the code for tokens
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    console.error("Token exchange failed:", text);
    return NextResponse.json({ success: false, error: "Token exchange failed" }, { status: 500 });
  }

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token as string;

  // Fetch user info
  const userRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) {
    const text = await userRes.text();
    console.error("Userinfo fetch failed:", text);
    return NextResponse.json({ success: false, error: "Failed to fetch user info" }, { status: 500 });
  }

  const profile = await userRes.json();
  const providerId = profile.sub as string;
  const email = profile.email as string | undefined;
  const name = profile.name as string | undefined;

  // Find or create the Club by provider/providerId
  let club = await prisma.club.findFirst({ where: { provider: "google", providerId } });
  if (!club) {
    // Auto-verify if email domain looks like an academic domain or matches configured domains
    let verified = false;
    if (email) {
      const domain = email.split("@").slice(1).join("@");
      const allowed = process.env.UNIVERSITY_DOMAINS?.split(",").map((d) => d.trim()).filter(Boolean) ?? [];
      if (domain.endsWith(".edu") || allowed.includes(domain)) {
        verified = true;
      }
    }

    club = await prisma.club.create({
      data: {
        name: name ?? (email ? email.split("@")[0] : "Club"),
        email: email ?? undefined,
        provider: "google",
        providerId,
        verified,
      },
    });
  }

  // Set the club session cookie and redirect to the dashboard
  const response = NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_AFTER_OAUTH ?? "/", request.url));
  response.cookies.set("current-club-id", club.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
