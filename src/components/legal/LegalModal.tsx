"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { TermsContent, PrivacyContent } from "./legalContent";

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: "terms" | "privacy";
  onClose: () => void;
}

export function LegalModal({ isOpen, initialTab = "terms", onClose }: LegalModalProps) {
  const [selectedTab, setSelectedTab] = useState<"terms" | "privacy" | null>(null);
  const activeTab = selectedTab ?? initialTab;

  const handleClose = useCallback(() => {
    setSelectedTab(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-text">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <Image
              src="/ats-victim-logo.png"
              alt="ATS Victim Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-contain drop-shadow-xs"
            />
            <div className="flex items-center bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedTab("terms")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "terms"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("privacy")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "privacy"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Privacy Policy
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/80 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 space-y-6 overscroll-contain">
          {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 sm:px-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <span className="text-[11px] text-slate-400">
            ATS Victim &bull; Career Application Tracker
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
