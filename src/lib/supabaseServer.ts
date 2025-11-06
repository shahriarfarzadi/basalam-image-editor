import { createClient } from "@supabase/supabase-js";

// Create a function that returns the Supabase client
function createSupabaseServer() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // During build time, return a mock client to prevent errors
  if (!supabaseUrl || !serviceRoleKey || supabaseUrl === "https://placeholder.supabase.co") {
    return {
      from: () => ({
        select: () => ({ eq: () => ({ limit: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      }),
      auth: {},
      storage: {},
    } as any;
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabaseServer = createSupabaseServer();

