"use client";

import { useEffect, useState } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={!isDeleting ? onClose : undefined}
      />

      <div
        className="relative w-full max-w-sm bg-surface rounded-2xl border border-outline-variant/40 shadow-xl p-6 space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0 border border-error/20">
            <span className="material-symbols-outlined text-xl">delete</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 id="delete-modal-title" className="text-sm font-bold text-on-surface">
              {title}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {description || (
                <>
                  Are you sure you want to delete{" "}
                  {itemName ? (
                    <strong className="font-semibold text-on-surface break-words">
                      {itemName}
                    </strong>
                  ) : (
                    "this item"
                  )}
                  ? This action cannot be undone.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-full text-xs font-bold bg-error text-white hover:bg-error/90 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting && (
              <span className="material-symbols-outlined text-xs animate-spin">
                progress_activity
              </span>
            )}
            {isDeleting ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
