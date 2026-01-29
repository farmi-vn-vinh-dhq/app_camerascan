import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { AppError, ErrorCode } from "@/lib/errors";
import { validateBarcodeInput } from "@/lib/validation";
import type { BarcodeRecord, CreateBarcodeDTO } from "@/types/barcode";

const SERVICE_NAME = "BarcodeService";

/**
 * Service layer for barcode CRUD operations.
 * All database access is encapsulated here — no direct Prisma usage in routes or UI.
 */
export const BarcodeService = {
  /**
   * Creates a new barcode record after validation and duplicate check.
   * @throws {AppError} 400 if input invalid, 409 if duplicate
   */
  async create(input: unknown): Promise<BarcodeRecord> {
    const validation = validateBarcodeInput(input);
    if (!validation.valid) {
      throw new AppError(validation.errors.join("; "), 400, ErrorCode.INVALID_PAYLOAD);
    }

    const dto = input as CreateBarcodeDTO;
    const trimmedCode = dto.code.trim();

    const existing = await prisma.barcode.findUnique({
      where: { code: trimmedCode },
    });

    if (existing) {
      logger.warn(SERVICE_NAME, "Duplicate barcode rejected", { code: trimmedCode });
      throw new AppError(
        `Barcode '${trimmedCode}' already exists`,
        409,
        ErrorCode.DUPLICATE_CODE
      );
    }

    try {
      const barcode = await prisma.barcode.create({
        data: {
          code: trimmedCode,
          format: dto.format?.trim() || null,
        },
      });

      logger.info(SERVICE_NAME, "Barcode created", { id: barcode.id, code: barcode.code });
      return barcode;
    } catch (error) {
      logger.error(SERVICE_NAME, "DB write failed", {
        code: trimmedCode,
        error: String(error),
      });
      throw new AppError("Failed to save barcode", 500, ErrorCode.DB_WRITE_ERROR);
    }
  },

  /**
   * Returns all barcodes sorted by createdAt descending (newest first).
   */
  async findAll(): Promise<BarcodeRecord[]> {
    try {
      const barcodes = await prisma.barcode.findMany({
        orderBy: { createdAt: "desc" },
      });

      logger.info(SERVICE_NAME, "Barcodes fetched", { count: barcodes.length });
      return barcodes;
    } catch (error) {
      logger.error(SERVICE_NAME, "DB read failed", { error: String(error) });
      throw new AppError("Failed to fetch barcodes", 500, ErrorCode.INTERNAL_ERROR);
    }
  },

  /**
   * Finds a single barcode by its unique code string.
   * @returns The barcode record or null if not found
   */
  async findByCode(code: string): Promise<BarcodeRecord | null> {
    return prisma.barcode.findUnique({ where: { code } });
  },
};
