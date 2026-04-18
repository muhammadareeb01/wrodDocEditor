import { createClient } from "@supabase/supabase-js";

// Admin client with service role key — use only in server-side API routes
// This bypasses RLS and should never be exposed to the client
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
