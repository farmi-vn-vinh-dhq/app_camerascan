import { describe, it, expect } from "vitest";
import { AppError, ErrorCode } from "@/lib/errors";

describe("AppError", () => {
  it("creates an error with correct properties", () => {
    const err = new AppError("Test error", 400, ErrorCode.INVALID_PAYLOAD);
    expect(err.message).toBe("Test error");
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("INVALID_PAYLOAD");
    expect(err.name).toBe("AppError");
  });

  it("is an instance of Error", () => {
    const err = new AppError("test", 500, ErrorCode.INTERNAL_ERROR);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });

  it("toResponse returns correct shape", () => {
    const err = new AppError("Duplicate", 409, ErrorCode.DUPLICATE_CODE);
    const res = err.toResponse();
    expect(res).toEqual({
      error: "Duplicate",
      code: "DUPLICATE_CODE",
    });
  });
});

describe("ErrorCode", () => {
  it("has all expected error codes", () => {
    expect(ErrorCode.INVALID_PAYLOAD).toBe("INVALID_PAYLOAD");
    expect(ErrorCode.DUPLICATE_CODE).toBe("DUPLICATE_CODE");
    expect(ErrorCode.NOT_FOUND).toBe("NOT_FOUND");
    expect(ErrorCode.DB_WRITE_ERROR).toBe("DB_WRITE_ERROR");
    expect(ErrorCode.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
  });
});
