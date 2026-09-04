"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/database";

interface SideNavBarProps {
  user: User | null;
  onCloseMobile?: () => void;
}

export function SideNavBar({ user, onCloseMobile }: SideNavBarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: "dashboard" },
    { label: "Tracker", href: "/tracker", icon: "work" },
    { label: "Interviews", href: "/interviews", icon: "event_repeat" },
    { label: "Tasks", href: "/tasks", icon: "checklist" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="h-screen w-72 flex-col fixed left-0 top-0 bg-surface-container border-r border-outline-variant/40 z-50 flex py-6 select-none">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shadow-xs">
            <span className="material-symbols-outlined text-2xl">work</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-primary tracking-tight leading-tight">
              ATS Victim
            </h1>
            <p className="text-xs font-medium text-on-surface-variant">
              Track while waiting!
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-4 px-5 py-3 rounded-full text-sm font-medium transition-all duration-150 ${active
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-variant/70 hover:text-on-surface"
                }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Session Footer */}
      {user && (
        <div className="px-4 mt-auto pt-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-surface/60 border border-outline-variant/30">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate">
                {user.email}
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-status-applied/10 text-status-applied border border-status-applied/20">
              Dev
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
