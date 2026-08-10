/**
 * ============================================================================
 * File: auth.ts
 * Layer: Constants
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines authentication-related constants used throughout the application.
 *
 * Responsibilities
 * ----------------
 * - Centralize authentication configuration.
 * - Eliminate magic numbers.
 * - Improve maintainability.
 *
 * ============================================================================
 */

export const authConfig = {
    /**
     * bcrypt Cost Factor
     *
     * Higher value:
     * - More secure.
     * - Slower password hashing.
     *
     * 10 provides a good balance between
     * security and performance.
     */
    PASSWORD_SALT_ROUNDS: 10,
} as const;