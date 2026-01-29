"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  type Result,
} from "@zxing/library";

export interface ScannerState {
  /** Whether camera is actively scanning */
  isScanning: boolean;
  /** Last successfully decoded barcode value */
  lastResult: string | null;
  /** Last decoded barcode format */
  lastFormat: string | null;
  /** Error message if camera/scan fails */
  error: string | null;
  /** Whether camera permission was denied */
  permissionDenied: boolean;
}

interface UseBarcodeScanner {
  state: ScannerState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  startScanning: () => void;
  stopScanning: () => void;
  clearResult: () => void;
  clearError: () => void;
}

const DEBOUNCE_MS = 500;

/**
 * Checks if the browser supports camera access via getUserMedia.
 * Returns false for non-secure contexts or unsupported browsers.
 */
function isCameraSupported(): boolean {
  return !!(navigator?.mediaDevices?.getUserMedia);
}

/**
 * Custom hook encapsulating barcode scanning logic.
 * Manages camera lifecycle, decode, debounce, and error handling.
 * Acquires camera stream manually then passes to @zxing decoder
 * for maximum browser compatibility.
 */
export function useBarcodeScanner(): UseBarcodeScanner {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  const [state, setState] = useState<ScannerState>({
    isScanning: false,
    lastResult: null,
    lastFormat: null,
    error: null,
    permissionDenied: false,
  });

  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState((prev) => ({ ...prev, isScanning: false }));
  }, []);

  const startScanning = useCallback(async () => {
    if (!videoRef.current) return;

    // Check browser support before attempting
    if (!isCameraSupported()) {
      setState((prev) => ({
        ...prev,
        error:
          "Trình duyệt không hỗ trợ camera. Vui lòng sử dụng HTTPS hoặc mở qua localhost.",
        permissionDenied: false,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isScanning: true,
      error: null,
      permissionDenied: false,
      lastResult: null,
      lastFormat: null,
    }));

    try {
      // Step 1: Acquire camera stream manually
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      // Step 2: Use @zxing to continuously decode from the camera stream
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      await reader.decodeFromStream(
        stream,
        video,
        (result: Result | null, error?: Error) => {
          if (result) {
            const now = Date.now();
            if (now - lastScanTimeRef.current < DEBOUNCE_MS) return;
            lastScanTimeRef.current = now;

            setState((prev) => ({
              ...prev,
              lastResult: result.getText(),
              lastFormat: result.getBarcodeFormat()?.toString() ?? null,
            }));
          }
          if (error && !(error instanceof NotFoundException)) {
            // NotFoundException is normal — means no barcode in current frame
          }
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isDenied =
        msg.includes("NotAllowedError") ||
        msg.includes("Permission") ||
        msg.includes("denied");

      setState((prev) => ({
        ...prev,
        isScanning: false,
        permissionDenied: isDenied,
        error: isDenied
          ? "Không thể truy cập camera. Vui lòng cấp quyền trong cài đặt trình duyệt."
          : `Lỗi camera: ${msg}`,
      }));
    }
  }, []);

  const clearResult = useCallback(() => {
    setState((prev) => ({ ...prev, lastResult: null, lastFormat: null }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, permissionDenied: false }));
  }, []);

  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { state, videoRef, startScanning, stopScanning, clearResult, clearError };
}
