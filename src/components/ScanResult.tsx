"use client";

interface ScanResultProps {
  code: string;
  format: string | null;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Displays the decoded barcode result with save/cancel actions.
 * Shows format badge if available.
 */
export function ScanResult({ code, format, isSaving, onSave, onCancel }: ScanResultProps) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
        Quét thành công
      </p>
      <p className="mt-1 text-lg font-mono font-bold text-green-900 break-all">{code}</p>
      {format && (
        <span className="mt-1 inline-block rounded bg-green-200 px-2 py-0.5 text-xs text-green-800">
          {format}
        </span>
      )}
      <div className="mt-3 flex gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Đang lưu..." : "Lưu"}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
