"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User } from "@/types/database";

interface SideNavBarProps {
  user?: User | null;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SideNavBar({
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: SideNavBarProps) {
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

  const effectiveWidth = isCollapsed ? 72 : 260;

  return (
    <aside
      style={{ width: `${effectiveWidth}px` }}
      className="h-screen flex-col sticky top-0 bg-surface-container border-r border-outline-variant/40 z-30 flex py-6 select-none shrink-0 relative transition-[width] duration-200 ease-in-out"
    >
      {/* Brand Header & Retraction Button */}
      <div className={`px-4 mb-8 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/ats-victim-logo.jpg"
            alt="ATS Victim Logo"
            width={40}
            height={40}
            className="w-10 h-10 shrink-0 rounded-xl object-cover shadow-xs"
            priority
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-primary tracking-tight leading-tight truncate">
                ATS Victim
              </h1>
              <p className="text-xs font-medium text-on-surface-variant truncate">
                Better days ahead!
              </p>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}

        {/* Desktop Retraction / Collapse Toggle */}
        {!onCloseMobile && onToggleCollapse && !isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors"
            title="Retract sidebar"
            aria-label="Retract sidebar"
          >
            <span className="material-symbols-outlined text-xl">menu_open</span>
          </button>
        )}
      </div>

      {/* When collapsed, show expand button at top */}
      {!onCloseMobile && onToggleCollapse && isCollapsed && (
        <div className="px-2 mb-4 flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center rounded-full text-sm font-medium transition-all duration-150 ${isCollapsed
                ? "justify-center w-11 h-11 mx-auto"
                : "gap-4 px-5 py-3"
                } ${active
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-variant/70 hover:text-on-surface"
                }`}
            >
              <span
                className="material-symbols-outlined text-xl shrink-0"
                style={{
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
