/**
 * ============================================================================
 * Tenant Repository
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

/**
 * Creates a new tenant.
 */
export const createTenant = async (tenant) => {
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
export const findTenantById = async (tenantId) => {
    return TenantModel.findById(tenantId).lean();
};

/**
 * Generic tenant update.
 *
 * Used later for updating rental agreement.
 */
export const updateTenantById = async (tenantId, update) => {
    return TenantModel.findByIdAndUpdate(
        tenantId,
        update,
        {
            new: true,
            lean: true,
        }
    );
};

/**
 * ============================================================================
 * Upload Rental Agreement
 * ============================================================================
 *
 * Updates the tenant with uploaded rental agreement metadata.
 *
 * @param {string} tenantId
 * @param {Object} rentalAgreement
 *
 * @returns {Promise<Object>}
 */
export const updateRentalAgreement = async (
    tenantId,
    rentalAgreement
) => {
    return TenantModel.findByIdAndUpdate(
        tenantId,
        {
            rentalAgreement,
        },
        {
            new: true,
            runValidators: true,
        }
    );
};

/**
 * ============================================================================
 * Remove Rental Agreement
 * ============================================================================
 *
 * Removes the rental agreement metadata from an existing tenant.
 *
 * @param {string} tenantId
 *
 * @returns {Promise<Object|null>}
 * ============================================================================
 */
export const removeRentalAgreement = async (tenantId) => {
    return TenantModel.findByIdAndUpdate(
        tenantId,
        {
            rentalAgreement: null,
        },
        {
            new: true,
            runValidators: true,
        }
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