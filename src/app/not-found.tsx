"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/tracker");
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-screen bg-background overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-surface p-8 sm:p-10 rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col items-center text-center">
        {/* Brand Mascot */}
        <Image
          src="/ats-victim-logo.jpg"
          alt="ATS Victim Logo"
          width={64}
          height={64}
          className="w-16 h-16 rounded-2xl object-cover shadow-xs mb-5"
          priority
        />

        {/* Status Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-4">
          <span className="material-symbols-outlined text-sm">error</span>
          404 Not Found
        </span>

        {/* Title & Description */}
        <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
          The page you are looking for doesn&apos;t exist, was removed, or is temporarily unavailable.
        </p>

        {/* Single Action Button */}
        <button
          type="button"
          onClick={handleGoBack}
          className="w-full h-11 px-5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Go Back
        </button>
      </div>
    </div>
  );
}
