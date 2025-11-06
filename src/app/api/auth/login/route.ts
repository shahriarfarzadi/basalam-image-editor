import { NextResponse } from "next/server";

const BASALAM_CLIENT_ID = process.env.BASALAM_CLIENT_ID;
const REDIRECT_URI = process.env.BASALAM_REDIRECT_URI || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/` : "http://localhost:3000/");

export async function GET() {
  if (!BASALAM_CLIENT_ID) {
    return NextResponse.json({ error: "OAuth not configured. Please set BASALAM_CLIENT_ID in environment variables." }, { status: 500 });
  }

  // Generate state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15);
  
  // Use Basalam OAuth format without scope (as it was working before)
  const oauthUrl = `https://basalam.com/accounts/sso?client_id=${BASALAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
  
  // Debug logging
  console.log("OAuth Login - Generated URL:", oauthUrl);
  console.log("OAuth Login - Client ID:", BASALAM_CLIENT_ID);
  console.log("OAuth Login - Redirect URI:", REDIRECT_URI);
  console.log("OAuth Login - State:", state);
  
  // Store state in session/cookie for verification
  const response = NextResponse.redirect(oauthUrl);
  
  // Set state cookie for verification
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
  });

  return response;
}