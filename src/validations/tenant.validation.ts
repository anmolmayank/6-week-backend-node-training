/**
 * ============================================================================
 * File: tenant.validation.ts
 * Layer: Validation
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines Zod schemas for validating Tenant API requests.
 *
 * Responsibilities
 * ----------------
 * - Validate incoming request payloads.
 * - Ensure only valid data reaches the Controller layer.
 * - Prevent invalid requests from entering the application.
 *
 * Notes
 * -----
 * - This file only validates API requests.
 * - Database-level validation is still handled by Mongoose.
 * - Validation schemas follow the same structure used across the project:
 *
 * {
 *   body: ...,
 *   params: ...,
 *   query: ...
 * }
 *
 * ============================================================================
 */

import { z } from "zod";

import { objectIdSchema } from "./common.validation.js";

/**
 * ============================================================================
 * Create Tenant Request Body
 * ============================================================================
 *
 * Validates the payload required to create a new tenant.
 *
 * Expected Request Body
 * ---------------------
 * {
 *   "tenantName": "Rahul Sharma",
 *   "apartmentNumber": "A-101",
 *   "monthlyRent": 25000
 * }
 * ============================================================================
 */
const createTenantBodySchema = z.object({
    /**
     * Full name of the tenant.
     */
    tenantName: z
        .string()
        .trim()
        .min(1, "Tenant name is required.")
        .max(
            100,
            "Tenant name cannot exceed 100 characters.",
        ),

    /**
     * Apartment number assigned to the tenant.
     *
     * Example:
     * A-101
     */
    apartmentNumber: z
        .string()
        .trim()
        .min(
            1,
            "Apartment number is required.",
        )
        .max(
            20,
            "Apartment number cannot exceed 20 characters.",
        ),

    /**
     * Monthly rent amount.
     *
     * Must be zero or greater.
     */
    monthlyRent: z
        .number()
        .min(
            0,
            "Monthly rent cannot be negative.",
        ),
});

/**
 * ============================================================================
 * Create Tenant Validation Schema
 * ============================================================================
 */
export const createTenantSchema =
    z.object({
        body: createTenantBodySchema,
    });

/**
 * ============================================================================
 * Upload Rental Agreement Validation Schema
 * ============================================================================
 *
 * Route:
 * POST /api/v1/tenants/:tenantId/agreement
 * ============================================================================
 */
export const uploadAgreementSchema =
    z.object({
        params: z.object({
            tenantId:
                objectIdSchema,
        }),
    });

/**
 * ============================================================================
 * Download Rental Agreement Validation Schema
 * ============================================================================
 *
 * Route:
 * GET /api/v1/tenants/:tenantId/agreement
 * ============================================================================
 */
export const downloadAgreementSchema =
    z.object({
        params: z.object({
            tenantId:
                objectIdSchema,
        }),
    });

/**
 * ============================================================================
 * Delete Rental Agreement Validation Schema
 * ============================================================================
 *
 * Route:
 * DELETE /api/v1/tenants/:tenantId/agreement
 * ============================================================================
 */
export const deleteAgreementSchema =
    z.object({
        params: z.object({
            tenantId:
                objectIdSchema,
        }),
    });

/**
 * ============================================================================
 * Type Inference
 * ============================================================================
 */

export type CreateTenantSchema =
    z.infer<
        typeof createTenantSchema
    >;

export type UploadAgreementSchema =
    z.infer<
        typeof uploadAgreementSchema
    >;

export type DownloadAgreementSchema =
    z.infer<
        typeof downloadAgreementSchema
    >;

export type DeleteAgreementSchema =
    z.infer<
        typeof deleteAgreementSchema
    >;

/**
 * ============================================================================
 * Learning Notes
 * ============================================================================
 *
 * 1. Zod validates API requests before they reach the Controller layer.
 *
 * 2. Mongoose validation is still required because data can enter the
 *    database from sources other than the API.
 *
 * 3. Validation schemas are organized into:
 *    - body
 *    - params
 *    - query
 *
 *    This keeps the validation middleware generic and reusable.
 *
 * 4. Type inference using z.infer ensures runtime validation and
 *    compile-time types always remain synchronized.
 *
 * ============================================================================
 */