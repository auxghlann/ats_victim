const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/popup-closed-by-user": "Sign-in was canceled before completion. Please try again.",
  "auth/cancelled-popup-request": "Sign-in was canceled before completion. Please try again.",
  "auth/popup-blocked":
    "Sign-in popup was blocked by your browser. Please allow popups for this site and try again.",
  "auth/unauthorized-domain":
    "Sign-in is not enabled on this domain. Please access the app from an authorized domain.",
  "auth/network-request-failed":
    "Network error while contacting the sign-in service. Check your connection and try again.",
  "auth/too-many-requests":
    "Too many sign-in attempts. Please wait a moment and try again.",
  "auth/user-disabled":
    "This account is currently disabled. Contact support for assistance.",
  "auth/config-missing":
    "Sign-in service is temporarily unavailable. Please try again later.",
  "auth/session-failed":
    "Unable to establish your session. Please try signing in again.",
};

const DEFAULT_AUTH_ERROR_MESSAGE =
  "Unable to complete sign-in right now. Please try again later.";

/**
 * Maps Firebase Auth and session errors to safe, user-facing messages
 * without exposing SDK internals, environment variables, or server details.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string" && code in AUTH_ERROR_MESSAGES) {
      return AUTH_ERROR_MESSAGES[code];
    }
  }
  return DEFAULT_AUTH_ERROR_MESSAGE;
}
