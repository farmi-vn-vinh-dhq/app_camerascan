"use client";

import { useCallback, useState } from "react";
import type { BarcodeResponse } from "@/types/barcode";

interface BarcodeStoreState {
  barcodes: BarcodeResponse[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveSuccess: boolean;
  copySuccess: string | null;
}

interface UseBarcodeStore {
  state: BarcodeStoreState;
  fetchBarcodes: () => Promise<void>;
  saveBarcode: (code: string, format?: string) => Promise<boolean>;
  copyToClipboard: (code: string) => Promise<void>;
  clearMessages: () => void;
}

/**
 * Hook for barcode data management — fetch, save, copy.
 * Calls API endpoints; no direct DB access.
 */
export function useBarcodeStore(): UseBarcodeStore {
  const [state, setState] = useState<BarcodeStoreState>({
    barcodes: [],
    isLoading: false,
    isSaving: false,
    error: null,
    saveSuccess: false,
    copySuccess: null,
  });

  const fetchBarcodes = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch("/api/barcodes");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setState((prev) => ({ ...prev, barcodes: data.data, isLoading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch barcodes",
      }));
    }
  }, []);

  const saveBarcode = useCallback(async (code: string, format?: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isSaving: true, error: null, saveSuccess: false }));
    try {
      const res = await fetch("/api/barcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, format }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          isSaving: false,
          error: data.error || `HTTP ${res.status}`,
        }));
        return false;
      }

      setState((prev) => ({
        ...prev,
        isSaving: false,
        saveSuccess: true,
        barcodes: [data, ...prev.barcodes],
      }));
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isSaving: false,
        error: err instanceof Error ? err.message : "Failed to save barcode",
      }));
      return false;
    }
  }, []);

  const copyToClipboard = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setState((prev) => ({ ...prev, copySuccess: code }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, copySuccess: null }));
      }, 2000);
    } catch {
      setState((prev) => ({
        ...prev,
        error: "Không thể sao chép. Trình duyệt không hỗ trợ clipboard API.",
      }));
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, saveSuccess: false, copySuccess: null }));
  }, []);

  return { state, fetchBarcodes, saveBarcode, copyToClipboard, clearMessages };
}
