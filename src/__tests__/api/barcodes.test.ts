import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "@/app/api/barcodes/route";
import { AppError, ErrorCode } from "@/lib/errors";

// Mock BarcodeService
vi.mock("@/services/barcode.service", () => ({
  BarcodeService: {
    create: vi.fn(),
    findAll: vi.fn(),
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { BarcodeService } from "@/services/barcode.service";
const mockCreate = vi.mocked(BarcodeService.create);
const mockFindAll = vi.mocked(BarcodeService.findAll);

/** Helper to create a Request with JSON body */
function createRequest(body: unknown): Request {
  return new Request("http://localhost/api/barcodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/barcodes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 with created barcode on success", async () => {
    mockCreate.mockResolvedValue({
      id: 1,
      code: "ABC123",
      format: "QR_CODE",
      createdAt: new Date("2024-01-01T00:00:00Z"),
    });

    const request = createRequest({ code: "ABC123", format: "QR_CODE" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.id).toBe(1);
    expect(body.code).toBe("ABC123");
    expect(body.format).toBe("QR_CODE");
    expect(body.createdAt).toBe("2024-01-01T00:00:00.000Z");
  });

  it("returns 400 for invalid payload", async () => {
    mockCreate.mockRejectedValue(
      new AppError("Code is required", 400, ErrorCode.INVALID_PAYLOAD)
    );

    const request = createRequest({ format: "QR" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Code is required");
    expect(body.code).toBe("INVALID_PAYLOAD");
  });

  it("returns 409 for duplicate barcode", async () => {
    mockCreate.mockRejectedValue(
      new AppError("Already exists", 409, ErrorCode.DUPLICATE_CODE)
    );

    const request = createRequest({ code: "DUP" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.code).toBe("DUPLICATE_CODE");
  });

  it("returns 500 for DB write error", async () => {
    mockCreate.mockRejectedValue(
      new AppError("Failed to save", 500, ErrorCode.DB_WRITE_ERROR)
    );

    const request = createRequest({ code: "FAIL" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("DB_WRITE_ERROR");
  });

  it("returns 500 for unexpected error", async () => {
    mockCreate.mockRejectedValue(new Error("Unexpected"));

    const request = createRequest({ code: "X" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
  });
});

describe("GET /api/barcodes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with barcode list", async () => {
    mockFindAll.mockResolvedValue([
      { id: 2, code: "NEW", format: null, createdAt: new Date("2024-01-02T00:00:00Z") },
      { id: 1, code: "OLD", format: "EAN_13", createdAt: new Date("2024-01-01T00:00:00Z") },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(2);
    expect(body.data[0].code).toBe("NEW");
    expect(body.data[1].code).toBe("OLD");
    expect(body.data[1].format).toBe("EAN_13");
  });

  it("returns 200 with empty data when no barcodes", async () => {
    mockFindAll.mockResolvedValue([]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(0);
  });

  it("returns 500 when service throws AppError", async () => {
    mockFindAll.mockRejectedValue(
      new AppError("DB failed", 500, ErrorCode.INTERNAL_ERROR)
    );

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
  });

  it("returns 500 for unexpected error", async () => {
    mockFindAll.mockRejectedValue(new Error("Unknown"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
  });
});
