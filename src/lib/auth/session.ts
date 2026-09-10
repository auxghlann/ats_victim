import { cache } from "react";
import { cookies } from "next/headers";
import { User } from "@/types/database";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { getUserById, upsertUser } from "@/lib/repositories/usersRepository";

export const DEV_USER: User = {
  id: "dev-user-001",
  email: "alex.dev@example.com",
  name: "Alex Dev",
  avatar_url:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  created_at: new Date().toISOString(),
};

/**
 * Returns true if local development auth bypass is enabled.
 * Strictly disabled in production under all circumstances.
 */
export function isDevAuthEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  return (
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true" ||
    process.env.DEV_AUTH_BYPASS === "true"
  );
}

/**
 * Returns the active user session.
 * 1. Checks for an active __session HTTP-only cookie.
 * 2. Cryptographically verifies the cookie using Firebase Admin SDK.
 * 3. Synchronizes user profile into the database via usersRepository.
 * 4. Falls back to DEV_USER if dev bypass is enabled and no session exists.
 *
 * Wrapped in React cache() to memoize per-request across RootLayout and page components.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (sessionCookie) {
      const adminAuth = getFirebaseAdminAuth();
      if (adminAuth) {
        try {
          // Verify session cookie using cached public certs (checkRevoked: false for low overhead)
          const decoded = await adminAuth.verifySessionCookie(sessionCookie, false);

          // Check if user already exists in database
          let dbUser = await getUserById(decoded.uid);
          if (!dbUser) {
            dbUser = await upsertUser({
              id: decoded.uid,
              email: decoded.email || "",
              name: decoded.name || null,
              avatar_url: decoded.picture || null,
            });
          }

          return dbUser;
        } catch (cookieError) {
          console.warn("Invalid or expired session cookie:", cookieError);
        }
      }
    }
  } catch {
    // cookies() might fail if invoked outside of a request scope (e.g. static prerender)
  }

  // Fallback to local dev user if bypass is enabled
  if (isDevAuthEnabled()) {
    return DEV_USER;
  }

  return null;
});
