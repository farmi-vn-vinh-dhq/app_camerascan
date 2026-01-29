"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
  durationMs?: number;
}

/**
 * Auto-dismissing toast notification component.
 */
export function Toast({ message, type, onClose, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, durationMs);
    return () => clearTimeout(timer);
  }, [onClose, durationMs]);

  const bgColor = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500",
  }[type];

  return (
    <div
      role="alert"
      className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-white shadow-lg ${bgColor} max-w-sm`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-lg leading-none"
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
    </div>
  );
}
