"use client";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Error display component with optional retry action.
 * Used for camera errors, API errors, etc.
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">⚠</span>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-900"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
