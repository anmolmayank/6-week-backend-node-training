/**
 * ------------------------------------------------------------------
 * ApiError
 * ------------------------------------------------------------------
 *
 * Custom error class used across the application.
 *
 * Features:
 * - HTTP Status Code
 * - User-friendly error message
 * - Validation error details
 * - Operational error identification
 * ------------------------------------------------------------------
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);

    /**
     * HTTP status code
     */
    this.statusCode = statusCode;

    /**
     * Additional error details.
     * Mainly used for validation failures.
     */
    this.errors = errors;

    /**
     * Indicates whether this is an expected
     * operational error or an unexpected system error.
     */
    this.isOperational = true;

    /**
     * Removes constructor calls from the stack trace.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;