/**
 * ============================================================================
 * File: httpStatus.ts
 * Layer: Constants
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines HTTP status codes used throughout the application.
 *
 * Responsibilities
 * ----------------
 * - Provide a centralized collection of HTTP status codes.
 * - Improve readability by replacing magic numbers.
 *
 * ============================================================================
 */

export const httpStatus = {
    /**
     * Success
     */
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    /**
     * Client Errors
     */
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,

    /**
     * Server Errors
     */
    INTERNAL_SERVER_ERROR: 500,
} as const;