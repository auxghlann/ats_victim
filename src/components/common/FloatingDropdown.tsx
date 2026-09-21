"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FloatingDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
}

export function FloatingDropdown({
  isOpen,
  onClose,
  anchorRef,
  children,
  className,
}: FloatingDropdownProps) {
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const updatePosition = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    };

    updatePosition();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleScrollOrResize = () => {
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, anchorRef, onClose]);

  if (!isOpen || !coords || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-transparent cursor-default"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        style={{
          position: "fixed",
          top: `${coords.top}px`,
          right: `${coords.right}px`,
          zIndex: 50,
        }}
        onClick={(e) => e.stopPropagation()}
        className={
          className ||
          "w-32 bg-surface rounded-xl border border-outline-variant/40 shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100 text-left"
        }
      >
        {children}
      </div>
    </>,
    document.body
  );
}
