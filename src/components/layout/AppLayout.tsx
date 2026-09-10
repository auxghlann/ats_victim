"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SideNavBar } from "./SideNavBar";
import { User } from "@/types/database";

interface AppLayoutProps {
  user: User | null;
  children: React.ReactNode;
}

export function AppLayout({ user, children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Clean up any previously persisted keys so localStorage is not used
  useEffect(() => {
    try {
      localStorage.removeItem("ats_sidebar_width");
      localStorage.removeItem("ats_sidebar_collapsed");
    } catch {
      // Ignore storage access issues
    }
  }, []);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex w-full">
      {/* Desktop Persistent Sidebar (Sticky Flex Column) */}
      <div className="hidden md:block shrink-0">
        <SideNavBar
          user={user}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-surface-container shadow-xl">
            <SideNavBar user={user} onCloseMobile={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area: Automatically occupies remaining viewport width with zero margin recalculation */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-surface-variant text-on-surface-variant"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="p-0.5 rounded-full hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer focus:outline-none"
              aria-label="Open profile menu"
            >
              {user?.avatar_url && !avatarError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.avatar_url}
                  alt={user.name || "User profile"}
                  onError={() => setAvatarError(true)}
                  className="w-8 h-8 rounded-full object-cover shadow-xs border border-outline-variant/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
              )}
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-64 bg-surface rounded-2xl border border-outline-variant/40 shadow-xl p-3 animate-in fade-in zoom-in-95 duration-100">
                {user ? (
                  <div className="px-3 py-2 border-b border-outline-variant/30 mb-2 flex items-center gap-2.5">
                    {user.avatar_url && !avatarError ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.avatar_url}
                        alt={user.name || "User profile"}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-outline-variant/40 shadow-2xs"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-on-surface truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 border-b border-outline-variant/30 mb-2">
                    <p className="text-xs font-semibold text-on-surface">Not Signed In</p>
                    <a
                      href="/login"
                      className="text-[11px] font-bold text-primary hover:underline block mt-1"
                    >
                      Sign In to Account
                    </a>
                  </div>
                )}

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-error hover:bg-error/10 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Sign Out
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-primary/10 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">login</span>
                    Sign In
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
