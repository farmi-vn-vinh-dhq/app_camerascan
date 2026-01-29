"use client";

import type { BarcodeResponse } from "@/types/barcode";

interface BarcodeListProps {
  barcodes: BarcodeResponse[];
  copySuccess: string | null;
  onCopy: (code: string) => void;
}

/**
 * Renders a list of saved barcodes with copy-to-clipboard buttons.
 * Sorted by createdAt descending (newest first) as provided by API.
 */
export function BarcodeList({ barcodes, copySuccess, onCopy }: BarcodeListProps) {
  if (barcodes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
        Chưa có mã vạch nào được lưu.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {barcodes.map((barcode) => (
        <li
          key={barcode.id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm font-medium text-gray-900">
              {barcode.code}
            </p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
              {barcode.format && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5">{barcode.format}</span>
              )}
              <time dateTime={barcode.createdAt}>
                {new Date(barcode.createdAt).toLocaleString("vi-VN")}
              </time>
            </div>
          </div>
          <button
            onClick={() => onCopy(barcode.code)}
            className="shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-100 transition-colors"
            aria-label={`Sao chép ${barcode.code}`}
          >
            {copySuccess === barcode.code ? "Đã sao chép ✓" : "Copy"}
          </button>
        </li>
      ))}
    </ul>
  );
}
