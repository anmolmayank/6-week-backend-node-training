/**
 * ============================================================================
 * File: user.ts
 * Layer: Domain Types
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the User domain model used throughout the application.
 *
 * Why?
 * ----
 * This interface decouples the Service, Controller and Repository
 * layers from Mongoose-specific types.
 *
 * Notes
 * -----
 * - Repository returns this type.
 * - Services consume this type.
 * - Controllers consume this type.
 * - Only the Model layer knows about Mongoose.
 *
 * ============================================================================
 */

export interface User {
    /**
     * MongoDB document identifier.
     */
    _id: string;

    /**
     * Full name.
     */
    name: string;

    /**
     * User email.
     */
    email: string;

    /**
     * Password hash.
     */
    password: string;

    /**
     * Document creation time.
     */
    createdAt: Date;

    /**
     * Last update time.
     */
    updatedAt: Date;
}