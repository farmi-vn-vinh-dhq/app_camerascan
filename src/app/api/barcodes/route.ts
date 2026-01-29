import { NextResponse } from "next/server";
import { BarcodeService } from "@/services/barcode.service";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { BarcodeResponse, BarcodeListResponse, ApiErrorResponse } from "@/types/barcode";

const SERVICE_NAME = "API:/api/barcodes";

/**
 * POST /api/barcodes
 * Saves a scanned barcode. Returns 201 on success, 400/409/500 on error.
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const barcode = await BarcodeService.create(body);

    const response: BarcodeResponse = {
      id: barcode.id,
      code: barcode.code,
      format: barcode.format,
      createdAt: barcode.createdAt.toISOString(),
    };

    logger.info(SERVICE_NAME, "POST success", { id: barcode.id });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      const body: ApiErrorResponse = error.toResponse();
      return NextResponse.json(body, { status: error.statusCode });
    }

    logger.error(SERVICE_NAME, "Unexpected POST error", { error: String(error) });
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}

/**
 * GET /api/barcodes
 * Returns all barcodes sorted by created_at descending.
 */
export async function GET() {
  try {
    const barcodes = await BarcodeService.findAll();

    const response: BarcodeListResponse = {
      data: barcodes.map((b) => ({
        id: b.id,
        code: b.code,
        format: b.format,
        createdAt: b.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      const body: ApiErrorResponse = error.toResponse();
      return NextResponse.json(body, { status: error.statusCode });
    }

    logger.error(SERVICE_NAME, "Unexpected GET error", { error: String(error) });
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
