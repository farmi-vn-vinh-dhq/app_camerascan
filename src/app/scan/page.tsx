"use client";

import { useCallback } from "react";
import { NavBar } from "@/components/NavBar";
import { ScanResult } from "@/components/ScanResult";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Toast } from "@/components/Toast";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useBarcodeStore } from "@/hooks/useBarcodeStore";

/**
 * Scan page — camera preview, decode result, save action.
 * All business logic lives in hooks; this page only wires UI.
 */
export default function ScanPage() {
  const scanner = useBarcodeScanner();
  const store = useBarcodeStore();

  const handleSave = useCallback(async () => {
    if (!scanner.state.lastResult) return;
    const saved = await store.saveBarcode(
      scanner.state.lastResult,
      scanner.state.lastFormat ?? undefined
    );
    if (saved) {
      scanner.clearResult();
    }
  }, [scanner, store]);

  const handleCancel = useCallback(() => {
    scanner.clearResult();
  }, [scanner]);

  const handleRetry = useCallback(() => {
    scanner.clearError();
    scanner.startScanning();
  }, [scanner]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="mx-auto max-w-2xl p-4 space-y-4">
        <h1 className="text-xl font-bold">Quét mã vạch</h1>

        {/* Camera Preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={scanner.videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
          />
          {!scanner.state.isScanning && !scanner.state.error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={scanner.startScanning}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors"
              >
                Bắt đầu quét
              </button>
            </div>
          )}
          {scanner.state.isScanning && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Đang quét...
              </span>
            </div>
          )}
        </div>

        {/* Stop button */}
        {scanner.state.isScanning && (
          <button
            onClick={scanner.stopScanning}
            className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Dừng quét
          </button>
        )}

        {/* Error display */}
        {scanner.state.error && (
          <ErrorMessage message={scanner.state.error} onRetry={handleRetry} />
        )}

        {/* Scan result display */}
        {scanner.state.lastResult && (
          <ScanResult
            code={scanner.state.lastResult}
            format={scanner.state.lastFormat}
            isSaving={store.state.isSaving}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* Store error */}
        {store.state.error && (
          <ErrorMessage message={store.state.error} />
        )}

        {/* Toast messages */}
        {store.state.saveSuccess && (
          <Toast
            message="Mã vạch đã được lưu thành công!"
            type="success"
            onClose={store.clearMessages}
          />
        )}
      </main>
    </div>
  );
}
