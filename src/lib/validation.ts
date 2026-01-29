/** Supported barcode format types */
export const BARCODE_FORMATS = [
  "QR_CODE",
  "EAN_13",
  "EAN_8",
  "UPC_A",
  "UPC_E",
  "CODE_128",
  "CODE_39",
  "CODE_93",
  "ITF",
  "CODABAR",
  "DATA_MATRIX",
  "PDF_417",
  "AZTEC",
] as const;

export type BarcodeFormat = (typeof BARCODE_FORMATS)[number];

export interface CreateBarcodeInput {
  code: string;
  format?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates input for barcode creation.
 * Ensures code is non-empty and format (if provided) is recognized.
 */
export function validateBarcodeInput(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== "object") {
    return { valid: false, errors: ["Request body must be a JSON object"] };
  }

  const { code, format } = input as Record<string, unknown>;

  if (typeof code !== "string" || code.trim().length === 0) {
    errors.push("Field 'code' is required and must be a non-empty string");
  }

  if (format !== undefined && format !== null) {
    if (typeof format !== "string") {
      errors.push("Field 'format' must be a string");
    }
  }

  return { valid: errors.length === 0, errors };
}
