/**
 * ============================================================================
 * File: ApiError.ts
 * Layer: Utility
 * ============================================================================
 *
 * Purpose
 * -------
 * Represents a standardized application error.
 *
 * Responsibilities
 * ----------------
 * - Store HTTP status code.
 * - Store user-friendly error message.
 * - Store additional validation errors.
 * - Identify operational errors.
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * API Error
 * ============================================================================
 */
class ApiError extends Error {
    /**
     * HTTP status code.
     */
    public readonly statusCode: number;

    /**
     * Additional error details.
     *
     * Mainly used for validation failures.
     */
    public readonly errors: unknown[];

    /**
     * Indicates whether this is an expected
     * operational error.
     */
    public readonly isOperational: boolean;

    /**
     * ============================================================================
     * Constructor
     * ============================================================================
     */
    constructor(
        statusCode: number,
        message: string,
        errors: unknown[] = [],
    ) {
        super(message);

        this.name = "ApiError";

        this.statusCode = statusCode;

        this.errors = errors;

        this.isOperational = true;

        /**
         * Removes constructor calls from
         * the stack trace.
         */
        Error.captureStackTrace(
            this,
            this.constructor,
        );
    }
}

export default ApiError;