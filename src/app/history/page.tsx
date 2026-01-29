"use client";

import { useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { BarcodeList } from "@/components/BarcodeList";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Toast } from "@/components/Toast";
import { useBarcodeStore } from "@/hooks/useBarcodeStore";

/**
 * History page — displays all saved barcodes with copy buttons.
 * Data fetched from API on mount; no direct DB access.
 */
export default function HistoryPage() {
  const store = useBarcodeStore();

  useEffect(() => {
    store.fetchBarcodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="mx-auto max-w-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Lịch sử quét</h1>
          <button
            onClick={store.fetchBarcodes}
            disabled={store.state.isLoading}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            {store.state.isLoading ? "Đang tải..." : "Làm mới"}
          </button>
        </div>

        {store.state.error && (
          <ErrorMessage message={store.state.error} onRetry={store.fetchBarcodes} />
        )}

        {store.state.isLoading && !store.state.barcodes.length ? (
          <div className="py-12 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <BarcodeList
            barcodes={store.state.barcodes}
            copySuccess={store.state.copySuccess}
            onCopy={store.copyToClipboard}
          />
        )}

        {store.state.copySuccess && (
          <Toast
            message="Đã sao chép thành công!"
            type="success"
            onClose={store.clearMessages}
          />
        )}
      </main>
    </div>
  );
}
