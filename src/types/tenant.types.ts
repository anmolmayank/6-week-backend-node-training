/**
 * ============================================================================
 * File: tenant.types.ts
 * Layer: Types
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines TypeScript types used across the Tenant feature.
 *
 * Responsibilities
 * ----------------
 * - Define tenant creation/update contracts.
 * - Keep business-layer types separate from Mongoose-specific types.
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * Update Tenant Data
 * ============================================================================
 *
 * Fields that are allowed to be modified through the normal Tenant Edit API.
 *
 * Rental agreement metadata is intentionally excluded because agreement
 * management has its own upload/delete workflow.
 */
export interface UpdateTenantData {
    /**
     * Tenant full name.
     */
    tenantName?: string;

    /**
     * Apartment number.
     */
    apartmentNumber?: string;

    /**
     * Monthly rent.
     */
    monthlyRent?: number;
}