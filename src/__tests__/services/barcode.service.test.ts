import { describe, it, expect, vi, beforeEach } from "vitest";
import { BarcodeService } from "@/services/barcode.service";
import { AppError, ErrorCode } from "@/lib/errors";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    barcode: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// Mock logger to suppress output
vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Import after mocking
import { prisma } from "@/lib/prisma";

const mockFindUnique = vi.mocked(prisma.barcode.findUnique);
const mockCreate = vi.mocked(prisma.barcode.create);
const mockFindMany = vi.mocked(prisma.barcode.findMany);

describe("BarcodeService.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a barcode with valid input", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 1,
      code: "TEST123",
      format: "QR_CODE",
      createdAt: new Date("2024-01-01"),
    });

    const result = await BarcodeService.create({ code: "TEST123", format: "QR_CODE" });

    expect(result.code).toBe("TEST123");
    expect(result.format).toBe("QR_CODE");
    expect(result.id).toBe(1);
    expect(mockCreate).toHaveBeenCalledWith({
      data: { code: "TEST123", format: "QR_CODE" },
    });
  });

  it("creates a barcode without format", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 2,
      code: "ABC",
      format: null,
      createdAt: new Date(),
    });

    const result = await BarcodeService.create({ code: "ABC" });
    expect(result.format).toBeNull();
    expect(mockCreate).toHaveBeenCalledWith({
      data: { code: "ABC", format: null },
    });
  });

  it("trims whitespace from code", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 3,
      code: "TRIMMED",
      format: null,
      createdAt: new Date(),
    });

    await BarcodeService.create({ code: "  TRIMMED  " });
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { code: "TRIMMED" } });
    expect(mockCreate).toHaveBeenCalledWith({
      data: { code: "TRIMMED", format: null },
    });
  });

  it("throws 400 for invalid input (missing code)", async () => {
    await expect(BarcodeService.create({ format: "QR" })).rejects.toThrow(AppError);

    try {
      await BarcodeService.create({ format: "QR" });
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect((e as AppError).statusCode).toBe(400);
      expect((e as AppError).code).toBe(ErrorCode.INVALID_PAYLOAD);
    }
  });

  it("throws 400 for empty code string", async () => {
    try {
      await BarcodeService.create({ code: "" });
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect((e as AppError).statusCode).toBe(400);
    }
  });

  it("throws 400 for null input", async () => {
    try {
      await BarcodeService.create(null);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect((e as AppError).statusCode).toBe(400);
    }
  });

  it("throws 409 for duplicate barcode", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      code: "DUP",
      format: null,
      createdAt: new Date(),
    });

    try {
      await BarcodeService.create({ code: "DUP" });
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect((e as AppError).statusCode).toBe(409);
      expect((e as AppError).code).toBe(ErrorCode.DUPLICATE_CODE);
    }
  });

  it("throws 500 when DB create fails", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockRejectedValue(new Error("DB connection lost"));

    try {
      await BarcodeService.create({ code: "FAIL" });
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect((e as AppError).statusCode).toBe(500);
      expect((e as AppError).code).toBe(ErrorCode.DB_WRITE_ERROR);
    }
  });
});

describe("BarcodeService.findAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns barcodes sorted by createdAt desc", async () => {
    const mockData = [
      { id: 2, code: "NEW", format: null, createdAt: new Date("2024-01-02") },
      { id: 1, code: "OLD", format: "EAN_13", createdAt: new Date("2024-01-01") },
    ];
    mockFindMany.mockResolvedValue(mockData);

    const result = await BarcodeService.findAll();

    expect(result).toHaveLength(2);
    expect(result[0].code).toBe("NEW");
    expect(result[1].code).toBe("OLD");
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { createdAt: "desc" } });
  });

  it("returns empty array when no barcodes", async () => {
    mockFindMany.mockResolvedValue([]);
    const result = await BarcodeService.findAll();
    expect(result).toHaveLength(0);
  });

  it("throws 500 when DB read fails", async () => {
    mockFindMany.mockRejectedValue(new Error("DB read error"));

    try {
      await BarcodeService.findAll();
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect((e as AppError).statusCode).toBe(500);
      expect((e as AppError).code).toBe(ErrorCode.INTERNAL_ERROR);
    }
  });
});

describe("BarcodeService.findByCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns barcode when found", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      code: "FOUND",
      format: null,
      createdAt: new Date(),
    });
    const result = await BarcodeService.findByCode("FOUND");
    expect(result?.code).toBe("FOUND");
  });

  it("returns null when not found", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await BarcodeService.findByCode("MISSING");
    expect(result).toBeNull();
  });
});
