import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="max-w-md w-full bg-surface p-8 sm:p-10 rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col items-center">
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/tracker"
            className="w-full sm:flex-1 h-11 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">table_chart</span>
            Go to Tracker
          </Link>

          <Link
            href="/login"
            className="w-full sm:flex-1 h-11 px-4 rounded-xl border border-outline-variant/60 bg-surface hover:bg-surface-variant text-on-surface text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">login</span>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
