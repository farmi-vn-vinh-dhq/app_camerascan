/**
 * Shared type definitions for barcode domain.
 * Used across services, API routes, and UI components.
 */

/** Barcode record as returned from the database */
export interface BarcodeRecord {
  id: number;
  code: string;
  format: string | null;
  createdAt: Date;
}

/** Shape of a barcode returned via API responses */
export interface BarcodeResponse {
  id: number;
  code: string;
  format: string | null;
  createdAt: string;
}

/** Input payload for creating a new barcode (POST body) */
export interface CreateBarcodeDTO {
  code: string;
  format?: string;
}

/** API list response shape */
export interface BarcodeListResponse {
  data: BarcodeResponse[];
}

/** Standard API error response */
export interface ApiErrorResponse {
  error: string;
  code: string;
}
