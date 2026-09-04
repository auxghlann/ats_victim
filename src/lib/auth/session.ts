import { User } from "@/types/database";

export const DEV_USER: User = {
  id: "dev-user-001",
  email: "alex.dev@example.com",
  name: "Alex Dev",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  created_at: new Date().toISOString(),
};

/**
 * Returns the active user session.
 * In development mode with DEV_AUTH_BYPASS enabled, returns the mock DEV_USER.
 */
export async function getCurrentUser(): Promise<User | null> {
  const isBypassEnabled = process.env.DEV_AUTH_BYPASS !== "false";

  if (isBypassEnabled) {
    return DEV_USER;
  }

  // Placeholder for production Better Auth / Google SSO session retrieval
  return null;
}

export function isDevAuthEnabled(): boolean {
  return process.env.DEV_AUTH_BYPASS !== "false";
}
