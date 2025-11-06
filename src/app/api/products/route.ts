import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const API_BASE = process.env.BASALAM_API_BASE || "https://openapi.basalam.com";

export async function GET(req: NextRequest) {
  try {
    // Get the latest session
    const { data: session } = await supabaseServer
      .from("sessions")
      .select("access_token, user_id")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (!session?.access_token) {
      return NextResponse.json({ error: "not authenticated" }, { status: 401 });
    }

    // Get user info to get vendor_id
    const { data: user } = await supabaseServer
      .from("users")
      .select("vendor_id")
      .eq("id", session.user_id)
      .single();

    if (!user?.vendor_id) {
      return NextResponse.json({ error: "no vendor associated with account" }, { status: 400 });
    }

    const url = new URL(`${API_BASE}/v1/vendors/${user.vendor_id}/products`);
    const res = await fetch(url, {
      headers: { 
        Accept: "application/json", 
        Authorization: `Bearer ${session.access_token}` 
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "failed to fetch products" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}

