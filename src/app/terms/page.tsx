import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { TermsContent } from "@/components/legal/legalContent";

export const metadata: Metadata = {
  title: "Terms of Service - ATS Victim",
  description: "Terms of Service and user agreement for ATS Victim job application tracker.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center select-text">
      <div className="w-full max-w-3xl flex items-center justify-between mb-8">
        <Link href="/login" className="flex items-center gap-3 group">
          <Image
            src="/ats-victim-logo.png"
            alt="ATS Victim Logo"
            width={36}
            height={36}
            className="w-9 h-9 rounded-xl object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="block text-base font-extrabold text-blue-700 leading-tight">
              ATS Victim
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Career Application Tracker
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Sign In</span>
        </Link>
      </div>

      <main className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
        <TermsContent />
      </main>

      <footer className="w-full max-w-3xl py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} ATS Victim. All rights reserved. &bull;{" "}
        <Link href="/privacy" className="underline hover:text-slate-600 transition-colors">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
