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

/**
 * Creates a new tenant.
 */
export const createTenant = async (
    tenant: Omit<
        Tenant,
        "rentalAgreement" | "createdAt" | "updatedAt"
    >,
) => {
    return TenantModel.create(tenant);
};

/**
 * Returns all tenants.
 */
export const findAllTenants = async () => {
    return TenantModel.find().lean();
};

/**
 * Finds tenant by MongoDB ObjectId.
 */
export const findTenantById = async (
    tenantId: string,
) => {
    return TenantModel.findById(tenantId).lean();
};

/**
 * Generic tenant update.
 *
 * Used later for updating rental agreement.
 */
export const updateTenantById = async (
    tenantId: string,
    update: Partial<Tenant>,
) => {
    return TenantModel.findByIdAndUpdate(
        tenantId,
        update,
        {
            new: true,
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
 * Removes the rental agreement metadata from an existing tenant.
 * ============================================================================
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
 * Repository layer should ONLY communicate with MongoDB.
 *
 * Business logic belongs inside services.
 *
 * ============================================================================
 */