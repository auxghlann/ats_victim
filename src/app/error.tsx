"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-screen bg-background overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-surface p-8 sm:p-10 rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col items-center text-center">
        <Image
          src="/ats-victim-logo.png"
          alt="ATS Victim Logo"
          width={64}
          height={64}
          className="w-16 h-16 rounded-2xl object-contain drop-shadow-xs mb-5"
          priority
        />

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-status-rejected/10 text-status-rejected border border-status-rejected/20 mb-4">
          <span className="material-symbols-outlined text-sm">error</span>
          Unexpected Error
        </span>

        <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
          We couldn&apos;t complete your request right now. Please try again or return to your tracker.
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex-1 h-11 px-5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Try Again
          </button>
          <Link
            href="/tracker"
            className="flex-1 h-11 px-5 rounded-xl border border-outline-variant/60 bg-surface text-on-surface text-xs font-bold hover:bg-surface-container-low transition-all flex items-center justify-center gap-2"
          >
            Back to Tracker
          </Link>
        </div>
      </div>
    </div>
  );
}
