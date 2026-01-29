import { describe, it, expect } from "vitest";
import { validateBarcodeInput } from "@/lib/validation";

describe("validateBarcodeInput", () => {
  it("returns valid for correct input with code only", () => {
    const result = validateBarcodeInput({ code: "123456" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns valid for correct input with code and format", () => {
    const result = validateBarcodeInput({ code: "ABC-123", format: "QR_CODE" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects null input", () => {
    const result = validateBarcodeInput(null);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("JSON object");
  });

  it("rejects undefined input", () => {
    const result = validateBarcodeInput(undefined);
    expect(result.valid).toBe(false);
  });

  it("rejects non-object input", () => {
    const result = validateBarcodeInput("string");
    expect(result.valid).toBe(false);
  });

  it("rejects missing code field", () => {
    const result = validateBarcodeInput({ format: "QR" });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("code");
  });

  it("rejects empty code string", () => {
    const result = validateBarcodeInput({ code: "" });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("code");
  });

  it("rejects whitespace-only code", () => {
    const result = validateBarcodeInput({ code: "   " });
    expect(result.valid).toBe(false);
  });

  it("rejects numeric code value", () => {
    const result = validateBarcodeInput({ code: 12345 });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("code");
  });

  it("rejects non-string format", () => {
    const result = validateBarcodeInput({ code: "ABC", format: 123 });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("format");
  });

  it("accepts null format", () => {
    const result = validateBarcodeInput({ code: "ABC", format: null });
    expect(result.valid).toBe(true);
  });

  it("accepts undefined format (omitted)", () => {
    const result = validateBarcodeInput({ code: "ABC" });
    expect(result.valid).toBe(true);
  });
});
