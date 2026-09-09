"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPopup, signOut } from "firebase/auth";
import { getFirebaseAuth, googleAuthProvider } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/tracker";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDevBypass = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS !== "false";

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error(
          "Firebase credentials are not configured in your environment. Please add NEXT_PUBLIC_FIREBASE_* variables to .env.local, or enter as Dev User."
        );
      }

      // 1. Client Google Sign-In with popup
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await userCredential.user.getIdToken();

      // 2. Exchange ID token for server-side __session cookie
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to establish server session");
      }

      // 3. Clear client-side state per Firebase doc best practices for httpOnly cookies
      await signOut(auth);

      // 4. Navigate to destination
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/popup-closed-by-user") {
        setErrorMessage("Sign-in popup was closed before completing.");
      } else {
        setErrorMessage(error.message || "An unexpected error occurred during sign-in.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="h-full min-h-screen bg-background text-on-surface font-sans antialiased flex flex-col justify-between">
      {/* Minimal Top Header per Stitch Design */}
      <header className="w-full px-6 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/ats-victim-logo.jpg"
            alt="ATS Victim Logo"
            width={40}
            height={40}
            className="w-10 h-10 shrink-0 rounded-xl object-cover shadow-xs"
            priority
          />
          <div>
            <span className="text-xl font-bold tracking-tight text-primary">ATS Victim</span>
            <span className="block text-xs font-medium text-on-surface-variant">
              Better days ahead!
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant">
          <span>Need help?</span>
          <a
            href="mailto:support@example.com"
            className="text-primary hover:underline font-medium"
          >
            Contact Support
          </a>
        </div>
      </header>

      {/* Main Login Card Container per Stitch Design */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-outline-variant/30 p-8 sm:p-10 text-center transition-all">
          {/* Brand Logo / Badge */}
          <Image
            src="/ats-victim-logo.jpg"
            alt="ATS Victim Logo"
            width={56}
            height={56}
            className="w-14 h-14 mx-auto rounded-2xl object-cover shadow-sm mb-6"
            priority
          />

          <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-2">
            Sign in to ATS Victim
          </h1>
          <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
            Manage your job applications, interview timelines, and career milestones in one place.
          </p>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-status-rejected/10 border border-status-rejected/20 text-status-rejected text-xs flex items-start gap-2.5 text-left">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Primary Google SSO Action */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 px-4 rounded-full border border-outline-variant/60 bg-white hover:bg-surface-variant active:bg-surface-container transition-all flex items-center justify-center gap-3.5 shadow-xs text-sm font-semibold text-on-surface hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin text-primary">
                    progress_activity
                  </span>
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  {/* Google official colored vector logo */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Developer Bypass Action */}
            {isDevBypass && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    router.push(redirectUrl);
                    router.refresh();
                  }}
                  className="w-full h-11 px-4 rounded-full border border-status-applied/30 bg-status-applied/10 hover:bg-status-applied/20 active:bg-status-applied/25 text-status-applied text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">terminal</span>
                  <span>Enter as Alex Dev (Dev Bypass)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer per Stitch Design */}
      <footer className="w-full py-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/30 gap-4">
        <div>
          <span>&copy; {new Date().getFullYear()} ATS Victim. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-on-surface transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-on-surface transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-on-surface transition-colors">
            Security
          </a>
        </div>
      </footer>
    </div>
  );
}
