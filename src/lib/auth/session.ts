import { cache } from "react";
import { cookies } from "next/headers";
import { User } from "@/types/database";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { getUserById, upsertUser } from "@/lib/repositories/usersRepository";


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

  return null;
});
