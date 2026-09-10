import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Maintain singleton across Next.js server invocations and HMR reloads
const globalForSupabase = globalThis as unknown as {
  supabaseClient: SupabaseClient | undefined;
};

function resolveKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = resolveKey();
  return Boolean(url && key && url.trim() !== "" && key.trim() !== "");
}

export function getSupabase(): SupabaseClient {
  if (!globalForSupabase.supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = resolveKey();

    if (!url || !key) {
      throw new Error(
        "Supabase credentials missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) must be defined."
      );
    }

    globalForSupabase.supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return globalForSupabase.supabaseClient;
}
