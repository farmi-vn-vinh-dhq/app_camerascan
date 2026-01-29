/** Application-specific error codes */
export const ErrorCode = {
  INVALID_PAYLOAD: "INVALID_PAYLOAD",
  DUPLICATE_CODE: "DUPLICATE_CODE",
  NOT_FOUND: "NOT_FOUND",
  DB_WRITE_ERROR: "DB_WRITE_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Structured error response shape matching API-Spec */
export interface ApiErrorResponse {
  error: string;
  code: ErrorCodeType;
}

/**
 * Custom application error with HTTP status and error code.
 * Used to propagate structured errors through the service layer.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: ErrorCodeType
  ) {
    super(message);
    this.name = "AppError";
  }

  toResponse(): ApiErrorResponse {
    return {
      error: this.message,
      code: this.code,
    };
  }
}
