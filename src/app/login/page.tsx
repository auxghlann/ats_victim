"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPopup, signOut } from "firebase/auth";
import { getFirebaseAuth, googleAuthProvider } from "@/lib/firebase/client";
import { LegalModal } from "@/components/legal/LegalModal";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/tracker";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<"terms" | "privacy" | null>(null);

  const isDevBypass =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true";

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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden font-sans antialiased select-none">
      {/* Scenic Background Artwork (z-0 sits above body background, below z-10 content) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/bg-sign-in.png"
          alt="Scenic sunrise landscape with hills and traveler"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-bottom sm:object-center"
        />
      </div>

      {/* Main Foreground Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto min-h-screen px-6 sm:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 py-12 lg:py-8">
        {/* Left Section: Brand, Motivational Headline & Feature Highlights */}
        <div className="w-full lg:max-w-xl flex flex-col items-start gap-6 sm:gap-8 pt-4 lg:pt-0 lg:-translate-y-16 lg:translate-x-12">
          {/* Brand Header */}
          <div className="flex items-center gap-3.5">
            <Image
              src="/ats-victim-logo.png"
              alt="ATS Victim Logo"
              width={48}
              height={48}
              className="w-12 h-12 rounded-2xl object-contain drop-shadow-xs"
              priority
            />
            <div>
              <span className="block text-2xl font-extrabold tracking-tight text-[#1d4ed8]">
                ATS Victim
              </span>
              <span className="block text-xs font-semibold text-slate-600 tracking-wide">
                Better days ahead!
              </span>
            </div>
          </div>

          {/* Motivational Hero Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.18] drop-shadow-xs">
            Keep going.
            <br />
            One application
            <br />
            at a time.
          </h1>

          {/* Feature Highlights Card */}
          <div className="bg-white/80 backdrop-blur-md border border-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-5 inline-flex flex-wrap sm:flex-nowrap items-center gap-5 sm:gap-7">
            {/* Feature 1: Organize */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
              </div>
              <div className="text-xs leading-tight">
                <span className="block font-bold text-slate-800">Organize</span>
                <span className="text-slate-500 font-medium">your applications</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-slate-200/80" />

            {/* Feature 2: Track */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-lg">leaderboard</span>
              </div>
              <div className="text-xs leading-tight">
                <span className="block font-bold text-slate-800">Track your</span>
                <span className="text-slate-500 font-medium">progress</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-slate-200/80" />

            {/* Feature 3: Support */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-lg">favorite</span>
              </div>
              <div className="text-xs leading-tight">
                <span className="block font-bold text-slate-800">Support your</span>
                <span className="text-slate-500 font-medium">well-being</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Sign-In Authentication Card */}
        <div className="w-full max-w-[420px] sm:max-w-[440px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100/90 p-8 sm:p-12 text-center transition-all">
          {/* Mascot Centerpiece */}
          <Image
            src="/ats-victim-logo.png"
            alt="ATS Victim Mascot"
            width={64}
            height={64}
            className="w-16 h-16 mx-auto rounded-2xl object-contain drop-shadow-xs mb-6"
            priority
          />

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            Sign in to ATS Victim
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-21 leading-relaxed max-w-[300px] mx-auto">
            Manage your job applications, interview timelines, and career milestones in one place.
          </p>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-status-rejected/10 border border-status-rejected/20 text-status-rejected text-xs flex items-start gap-2.5 text-left">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Google SSO Action Button */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-xs hover:shadow-sm text-sm font-semibold text-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {/* Official Google Vector Logo */}
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

            {/* Developer Bypass Action (Dev Mode Only) */}
            {isDevBypass && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push(redirectUrl);
                    router.refresh();
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:border-slate-400 hover:bg-slate-50/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">terminal</span>
                  <span>Enter as Alex Dev (Dev Bypass)</span>
                </button>
              </div>
            )}
          </div>

          {/* Legal / Terms Disclaimer */}
          <p className="text-[11px] sm:text-xs text-slate-400 mt-8 leading-relaxed">
            By continuing, you confirm that you are of legal working age and agree to our{" "}
            <button
              type="button"
              onClick={() => setActiveLegalModal("terms")}
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setActiveLegalModal("privacy")}
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>

      {/* Scrollable Legal Pop-up Modal */}
      <LegalModal
        isOpen={Boolean(activeLegalModal)}
        initialTab={activeLegalModal ?? "terms"}
        onClose={() => setActiveLegalModal(null)}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginContent />
    </Suspense>
  );
}
