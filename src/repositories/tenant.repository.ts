/**
 * ============================================================================
 * File: tenant.repository.ts
 * Layer: Repository
 * ============================================================================
 *
 * Purpose
 * -------
 * Encapsulates all Tenant database operations.
 *
 * Controllers and services should never communicate directly
 * with Mongoose.
 *
 * ============================================================================
 */

import TenantModel from "../models/tenant.model.js";

import type {
    RentalAgreement,
    Tenant,
} from "../models/tenant.model.js";

import type {
    UpdateTenantData,
} from "../types/tenant.types.js";

/**
 * ============================================================================
 * Create Tenant
 * ============================================================================
 *
 * Creates a new tenant.
 *
 * Rental agreement and timestamps are excluded because they are managed
 * separately by the application/database.
 */
export const createTenant = async (
    tenant: Omit<
        Tenant,
        | "rentalAgreement"
        | "createdAt"
        | "updatedAt"
    >,
) => {
    return TenantModel.create(
        tenant,
    );
};

/**
 * ============================================================================
 * Find All Tenants
 * ============================================================================
 *
 * Returns all tenants.
 *
 * `.lean()` returns plain JavaScript objects instead of hydrated
 * Mongoose documents.
 */
export const findAllTenants = async () => {
    return TenantModel
        .find()
        .lean();
};

/**
 * ============================================================================
 * Find Tenant By ID
 * ============================================================================
 *
 * Finds a tenant using its MongoDB ObjectId.
 */
export const findTenantById = async (
    tenantId: string,
) => {
    return TenantModel
        .findById(tenantId)
        .lean();
};

/**
 * ============================================================================
 * Update Tenant
 * ============================================================================
 *
 * Updates the normal editable Tenant fields.
 *
 * IMPORTANT
 * ---------
 * `UpdateTenantData` intentionally excludes:
 *
 * - rentalAgreement
 * - createdAt
 * - updatedAt
 *
 * Rental agreement changes are handled through dedicated repository methods.
 */
export const updateTenantById = async (
    tenantId: string,
    update: UpdateTenantData,
) => {
    return TenantModel.findByIdAndUpdate(
        tenantId,
        update,
        {
            /**
             * Return the updated tenant rather than the old document.
             */
            new: true,

            /**
             * Run Mongoose schema validation against the update.
             */
            runValidators: true,

            /**
             * Return a plain JavaScript object.
             */
            lean: true,
        },
    );
};

/**
 * ============================================================================
 * Upload Rental Agreement
 * ============================================================================
 *
 * Updates the tenant with uploaded rental agreement metadata.
 */
export const updateRentalAgreement = async (
    tenantId: string,
    rentalAgreement: RentalAgreement,
) => {
    return TenantModel.findByIdAndUpdate(
        tenantId,
        {
            rentalAgreement,
        },
        {
            new: true,
            runValidators: true,
        },
    );
};

/**
 * ============================================================================
 * Remove Rental Agreement
 * ============================================================================
 *
 * Removes rental agreement metadata from an existing tenant.
 */
export const removeRentalAgreement = async (
    tenantId: string,
) => {
    return TenantModel.findByIdAndUpdate(
        tenantId,
        {
            rentalAgreement: null,
        },
        {
            new: true,
            runValidators: true,
        },
    );
};

/**
 * ============================================================================
 * Learning Notes
 * ============================================================================
 *
 * Repository layer:
 *
 * - Communicates only with MongoDB/Mongoose.
 * - Does not contain business rules.
 * - Does not decide whether a tenant may be updated.
 * - Does not handle HTTP responses.
 *
 * Those responsibilities belong to the service/controller layers.
 *
 * ============================================================================
 */