export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    const captureStackTrace = (
      Error as ErrorConstructor & {
        captureStackTrace?: (target: object) => void;
      }
    ).captureStackTrace;

    captureStackTrace?.(this);
  }
}


// Not Found Error
export class NotFoundError extends ApiError {
    constructor(message = "Resource not found") {
        super(404, message);
    }
}

// Validation Error
export class ValidationError extends ApiError {
    constructor(message = "Validation failed", details?: any) {
        super(400, message, true, details);
    }
}

// Unauthorized Error
export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized access") {
        super(401, message);
    }
}

// Forbidden Error
export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden access") {
        super(403, message);
    }
}

// Database Error
export class DatabaseError extends ApiError {
    constructor(message = "Database error", details?: any) {
        super(500, message, true, details);
    }
}

// Internal Server Error
export class InternalServerError extends ApiError {
    constructor(message = "Internal server error", details?: any) {
        super(500, message, true, details);
    }
}

// Rate Limit Exceeded Error
export class RateLimitError extends ApiError {
    constructor(message = "Rate limit exceeded") {
        super(429, message);
    }
}