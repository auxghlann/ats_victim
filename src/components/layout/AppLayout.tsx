"use client";

import { useState } from "react";
import { SideNavBar } from "./SideNavBar";
import { User } from "@/types/database";

interface AppLayoutProps {
  user: User | null;
  children: React.ReactNode;
}

export function AppLayout({ user, children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <SideNavBar user={user} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-surface-container shadow-xl">
            <SideNavBar user={user} onCloseMobile={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-72 min-h-screen w-full">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-surface-variant text-on-surface-variant"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/40">
              <span className="w-2 h-2 rounded-full bg-status-applied animate-pulse" />
              <span>Dev Auth Session Active: {user?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
