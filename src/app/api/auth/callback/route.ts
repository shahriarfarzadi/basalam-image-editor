import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const API_BASE = process.env.BASALAM_API_BASE || "https://openapi.basalam.com";
const CLIENT_ID = process.env.BASALAM_CLIENT_ID;
const CLIENT_SECRET = process.env.BASALAM_CLIENT_SECRET;
const REDIRECT_URI = process.env.BASALAM_REDIRECT_URI || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/` : "http://localhost:3000/");

async function processOAuthCallback(code: string, state: string, storedState?: string) {
  // Verify state for CSRF protection
  if (storedState && storedState !== state) {
    throw new Error("Invalid state parameter");
  }

  // Exchange authorization code for access token using Basalam's OpenAPI token endpoint
  const tokenRes = await fetch(`${API_BASE}/oauth/token`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  
  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    console.error("Token exchange failed:", {
      status: tokenRes.status,
      statusText: tokenRes.statusText,
      error: errorText,
      url: `${API_BASE}/oauth/token`,
      body: {
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code: code.substring(0, 10) + "...", // Log partial code for debugging
        redirect_uri: REDIRECT_URI,
      }
    });
    throw new Error(`Token exchange failed (${tokenRes.status}): ${errorText}`);
  }
  
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  
  // Fetch user info from Basalam
  const meRes = await fetch(`${API_BASE}/v1/users/me`, {
    headers: { 
      Accept: "application/json", 
      Authorization: `Bearer ${accessToken}` 
    },
  });
  
  if (!meRes.ok) {
    throw new Error("Failed to fetch user info");
  }
  
  const me = await meRes.json();

  // Upsert user in database
  const { data: existing } = await supabaseServer
    .from("users")
    .select("id")
    .eq("basalam_user_id", me.id)
    .limit(1)
    .maybeSingle();

  let userId = existing?.id;
  if (!userId) {
    const { data: created, error } = await supabaseServer.from("users").insert({
      basalam_user_id: me.id,
      name: me.name,
      mobile: me.mobile,
      vendor_id: me.vendor?.id ?? null,
    }).select("id").single();
    
    if (error) {
      throw new Error("Failed to create user");
    }
    userId = created.id;
  } else {
    await supabaseServer.from("users").update({ 
      name: me.name, 
      mobile: me.mobile, 
      vendor_id: me.vendor?.id ?? null 
    }).eq("id", userId);
  }

  // Store session
  await supabaseServer.from("sessions").delete().eq("user_id", userId);
  await supabaseServer.from("sessions").insert({ 
    user_id: userId, 
    access_token: accessToken,
    refresh_token: tokenData.refresh_token,
    expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null
  });

  return { success: true, user_id: userId };
}

// Handle GET request (direct redirect from Basalam)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  
  if (error) {
    return NextResponse.redirect(new URL(`/auth/callback?error=${error}`, req.url));
  }
  
  if (!code) {
    return NextResponse.redirect(new URL("/auth/callback?error=no_code", req.url));
  }

  // Redirect to our callback page to handle the OAuth flow
  return NextResponse.redirect(new URL(`/auth/callback?code=${code}&state=${state || ""}`, req.url));
}

// Handle POST request (from our callback page)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, state } = body;
    
    if (!code) {
      return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
    }

    const storedState = req.cookies.get("oauth_state")?.value;
    
    await processOAuthCallback(code, state, storedState);
    
    const response = NextResponse.json({ success: true });
    
    // Clear state cookie
    response.cookies.delete("oauth_state");
    
    return response;
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Authentication failed" 
    }, { status: 500 });
  }
}