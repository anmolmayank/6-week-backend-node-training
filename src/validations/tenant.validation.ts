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
 *   {
 *       body: ...,
 *       params: ...,
 *       query: ...
 *   }
 *
 * ============================================================================
 */

import { z } from "zod";

import { objectIdSchema } from "./common.validation.js";

/**
 * ============================================================================
 * Tenant Field Schemas
 * ============================================================================
 *
 * These schemas contain the validation rules shared between Create and Update
 * operations.
 *
 * Keeping the rules in one place prevents Create and Update from drifting
 * apart over time.
 */

/**
 * Tenant name validation.
 */
const tenantNameSchema = z
    .string()
    .trim()
    .min(
        1,
        "Tenant name is required.",
    )
    .max(
        100,
        "Tenant name cannot exceed 100 characters.",
    );

/**
 * Apartment number validation.
 */
const apartmentNumberSchema = z
    .string()
    .trim()
    .min(
        1,
        "Apartment number is required.",
    )
    .max(
        20,
        "Apartment number cannot exceed 20 characters.",
    );

/**
 * Monthly rent validation.
 */
const monthlyRentSchema = z
    .number()
    .min(
        0,
        "Monthly rent cannot be negative.",
    );

/**
 * ============================================================================
 * Create Tenant Request Body
 * ============================================================================
 *
 * Validates the payload required to create a new tenant.
 *
 * Expected Request Body
 * ---------------------
 *
 * {
 *     "tenantName": "Rahul Sharma",
 *     "apartmentNumber": "A-101",
 *     "monthlyRent": 25000
 * }
 *
 * ============================================================================
 */

const createTenantBodySchema =
    z.object({
        /**
         * Full name of the tenant.
         */
        tenantName:
            tenantNameSchema,

        /**
         * Apartment number assigned to the tenant.
         */
        apartmentNumber:
            apartmentNumberSchema,

        /**
         * Monthly rent amount.
         */
        monthlyRent:
            monthlyRentSchema,
    });

/**
 * ============================================================================
 * Create Tenant Validation Schema
 * ============================================================================
 */

export const createTenantSchema =
    z.object({
        body:
            createTenantBodySchema,
    });

/**
 * ============================================================================
 * Update Tenant Request Body
 * ============================================================================
 *
 * PATCH semantics:
 *
 * - Every field is optional.
 * - If a field is supplied, it must still pass its validation rules.
 *
 * Example:
 *
 * {
 *     "monthlyRent": 28000
 * }
 *
 * This is valid because only the monthly rent is being changed.
 *
 * Rental agreement is intentionally NOT included.
 * Agreement management has separate endpoints.
 * ============================================================================
 */

const updateTenantBodySchema =
    z.object({
        /**
         * Updated tenant name.
         */
        tenantName:
            tenantNameSchema.optional(),

        /**
         * Updated apartment number.
         */
        apartmentNumber:
            apartmentNumberSchema.optional(),

        /**
         * Updated monthly rent.
         */
        monthlyRent:
            monthlyRentSchema.optional(),
    })
    /**
     * Prevent an empty PATCH request.
     *
     * Without this rule, the following would technically be valid:
     *
     * {}
     *
     * but it would not actually update anything.
     */
    .refine(
        (data) =>
            Object.keys(data).length > 0,
        {
            message:
                "At least one tenant field is required.",
        },
    );

/**
 * ============================================================================
 * Update Tenant Validation Schema
 * ============================================================================
 *
 * Route:
 *
 * PATCH /api/v1/tenants/:tenantId
 *
 * ============================================================================
 */

export const updateTenantSchema =
    z.object({
        /**
         * Tenant ID from the URL.
         */
        params: z.object({
            tenantId:
                objectIdSchema,
        }),

        /**
         * Editable tenant fields.
         */
        body:
            updateTenantBodySchema,
    });

/**
 * ============================================================================
 * Upload Rental Agreement Validation Schema
 * ============================================================================
 *
 * Route:
 *
 * POST /api/v1/tenants/:tenantId/agreement
 *
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
 *
 * GET /api/v1/tenants/:tenantId/agreement
 *
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
 *
 * DELETE /api/v1/tenants/:tenantId/agreement
 *
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
 *
 * Runtime validation and compile-time types are derived from the same
 * schemas.
 */

/**
 * Create Tenant request type.
 */
export type CreateTenantSchema =
    z.infer<
        typeof createTenantSchema
    >;

/**
 * Update Tenant request type.
 */
export type UpdateTenantSchema =
    z.infer<
        typeof updateTenantSchema
    >;

/**
 * Upload Agreement request type.
 */
export type UploadAgreementSchema =
    z.infer<
        typeof uploadAgreementSchema
    >;

/**
 * Download Agreement request type.
 */
export type DownloadAgreementSchema =
    z.infer<
        typeof downloadAgreementSchema
    >;

/**
 * Delete Agreement request type.
 */
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
 * 3. PATCH uses optional fields because a partial update is being performed.
 *
 * 4. The `.refine()` rule prevents an empty PATCH body.
 *
 * 5. Rental agreement fields are deliberately excluded from the normal
 *    Tenant update schema.
 *
 * 6. Type inference using z.infer ensures runtime validation and compile-time
 *    types remain synchronized.
 *
 * ============================================================================
 */

/** Validate the owner-only tenant deletion route parameter. */
export const deleteTenantSchema = z.object({
    params: z.object({ tenantId: objectIdSchema }),
});
