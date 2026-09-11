import React from "react";

export function PrivacyContent() {
  return (
    <div className="space-y-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
      <div>
        <span className="inline-block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Last Updated: September 11, 2026
        </span>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">Privacy Policy</h3>
      </div>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          1. Overview & Scope
        </h4>
        <p>
          ATS Victim (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides a web application designed to help job seekers organize, track, and manage job applications. This Privacy Policy outlines our data practices when you access or use our platform.
        </p>
        <p>
          We strictly minimize data collection to only what is necessary to operate your application tracker, schedule interview milestones, and maintain task tracking.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          2. Information We Collect
        </h4>
        <div className="space-y-2 pl-3 border-l-2 border-slate-200">
          <p>
            <strong className="text-slate-800">A. Google Authentication:</strong> When you sign in using Google SSO (via Firebase Authentication), Google provides your name, email address, profile avatar, and an opaque account ID.
          </p>
          <p className="bg-slate-50 p-2.5 rounded-lg text-slate-500 font-medium">
            Important: ATS Victim requests only standard identity scopes (openid, email, profile). We never request, read, or scan your Gmail inbox, sent messages, or personal communications.
          </p>
          <p>
            <strong className="text-slate-800">B. Career Records:</strong> Job titles, companies, statuses, employment types, work setups, compensation expectations, job URLs, application dates, interview schedules, and notes that you voluntarily record.
          </p>
          <p>
            <strong className="text-slate-800">C. Session Cookies:</strong> Secure, HTTP-only session cookies used solely to keep you logged in securely.
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          3. How We Use Your Information
        </h4>
        <p>Your data is used strictly to provide the job tracking service to you:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Rendering your personal application pipeline and analytics.</li>
          <li>Enforcing authenticated session security and multi-tenant isolation.</li>
          <li>Generating user-requested CSV exports in your browser.</li>
        </ul>
        <p>
          We do not sell, rent, monetize, or share your personal data with third-party advertisers, recruiters, or data brokers, nor do we train public AI models on your private job notes.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          4. Data Storage, Security & Encryption
        </h4>
        <p>
          Your data is stored in Supabase PostgreSQL protected by Row Level Security (RLS), ensuring that users can only access their own records. Sensitive personal identifiers (name and email) are encrypted at rest using authenticated AES-256-GCM encryption. All network communication is encrypted via TLS 1.3.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          5. Third-Party Service Providers
        </h4>
        <p>
          We rely on reputable infrastructure providers to operate the service: Google Firebase (Authentication), Supabase Inc. (PostgreSQL Database), and Vercel Inc. (Cloud Hosting).
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          6. Data Retention & Deletion Rights
        </h4>
        <p>
          You have full control over your career records. You may delete individual applications, tasks, or interview events at any time directly through the UI. To request complete account and data erasure, you may use the in-app profile deletion feature or contact us at{" "}
          <a href="mailto:orenoytemail@gmail.com" className="text-blue-600 underline font-medium">
            orenoytemail@gmail.com
          </a>
          . All associated records will be permanently purged within thirty (30) days.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          7. Children&apos;s Privacy
        </h4>
        <p>
          ATS Victim is intended strictly for individuals of legal working age in their jurisdiction (and at least 16 years old). We do not knowingly collect personal information from children or individuals under 16.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          8. Contact Us
        </h4>
        <p>
          If you have questions regarding this Privacy Policy or your data, please contact:{" "}
          <a href="mailto:orenoytemail@gmail.com" className="text-blue-600 underline font-medium">
            orenoytemail@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}

export function TermsContent() {
  return (
    <div className="space-y-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
      <div>
        <span className="inline-block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Last Updated: September 11, 2026
        </span>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">Terms of Service</h3>
      </div>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          1. Acceptance of Terms
        </h4>
        <p>
          By accessing, signing in to, or using ATS Victim (&quot;the Service&quot;, &quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these Terms, you must not access or use the Platform.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          2. Description of Service & Disclaimers
        </h4>
        <p>
          ATS Victim is an organizational utility software designed to assist your career job search workflow by providing application tracking, status pipelines, and calendar scheduling.
        </p>
        <p className="bg-slate-50 p-2.5 rounded-lg text-slate-600 font-medium">
          Notice: ATS Victim is not an employment agency, recruiter, or job board. We do not represent hiring employers, schedule interviews on behalf of companies, or guarantee that using the Platform will lead to interviews, offers, or employment.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          3. Account Registration & Eligibility
        </h4>
        <p>
          You represent and warrant that you are of legal working age in your jurisdiction (and at least 16 years of age) to register for an account and use the Service. You authenticate via Google Sign-In and are responsible for safeguarding your Google credentials and device security.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          4. User Content & Ownership
        </h4>
        <p>
          You retain full ownership and intellectual property rights to all application data, job descriptions, notes, and records you submit into the Platform. By submitting content, you grant ATS Victim a limited, non-exclusive license solely to host, store, and process your data to provide the Service to you.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          5. Acceptable Use & Conduct
        </h4>
        <p>
          You agree not to violate any applicable laws, attempt to breach security or authentication barriers, reverse engineer or decompile the application, or execute automated scraping or denial-of-service attacks against the Platform. We reserve the right to suspend accounts that engage in abusive or harmful conduct.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          6. Disclaimer of Warranties
        </h4>
        <p>
          THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, COMPLETELY ERROR-FREE, OR IMMUNE FROM SERVICE DISRUPTIONS. YOU ARE ENCOURAGED TO REGULARLY BACK UP YOUR RECORDS VIA CSV EXPORT.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          7. Limitation of Liability
        </h4>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ATS VICTIM, ITS DEVELOPERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF OR INABILITY TO USE THE SERVICE.
        </p>
      </section>

      <section className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          8. Contact Us
        </h4>
        <p>
          For any questions concerning these Terms, please contact:{" "}
          <a href="mailto:orenoytemail@gmail.com" className="text-blue-600 underline font-medium">
            orenoytemail@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
