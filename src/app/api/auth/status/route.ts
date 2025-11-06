import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data: session } = await supabaseServer
      .from("sessions")
      .select("user_id, access_token")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (!session) {
      return NextResponse.json({ connected: false });
    }
    
    const { data: user } = await supabaseServer
      .from("users")
      .select("basalam_user_id, name, mobile, vendor_id")
      .eq("id", session.user_id)
      .single();
    
    return NextResponse.json({ 
      connected: true, 
      user, 
      has_token: !!session.access_token 
    });
  } catch (error) {
    return NextResponse.json({ connected: false });
  }
}