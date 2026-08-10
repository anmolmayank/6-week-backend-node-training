/**
 * ============================================================================
 * Tenant Service
 * ============================================================================
 *
 * Purpose
 * -------
 * Implements business logic for Tenant operations.
 *
 * Responsibilities
 * ----------------
 * - Create tenants.
 * - Retrieve tenants.
 * - Update tenant details.
 * - Manage rental agreements.
 *
 * Important
 * ---------
 * Normal tenant updates and rental agreement operations are intentionally
 * kept separate.
 *
 * Tenant update:
 * - tenantName
 * - apartmentNumber
 * - monthlyRent
 *
 * Rental agreement operations:
 * - upload
 * - replace
 * - download
 * - delete
 *
 * ============================================================================
 */

import fs from "node:fs/promises";

import * as tenantRepository from "../repositories/tenant.repository.js";

import type {
    UpdateTenantData,
} from "../types/tenant.types.js";

import ApiError from "../utils/ApiError.js";

import { httpStatus } from "../constants/httpStatus.js";

/**
 * ============================================================================
 * Create Tenant
 * ============================================================================
 */

export const createTenant = async (
    tenantData: {
        tenantName: string;
        apartmentNumber: string;
        monthlyRent: number;
    },
) => {
    return tenantRepository.createTenant(
        tenantData,
    );
};

/**
 * ============================================================================
 * Get All Tenants
 * ============================================================================
 */

export const getAllTenants = async () => {
    return tenantRepository.findAllTenants();
};

/**
 * ============================================================================
 * Get Tenant By ID
 * ============================================================================
 */

export const getTenantById = async (
    tenantId: string,
) => {
    return tenantRepository.findTenantById(
        tenantId,
    );
};

/**
 * ============================================================================
 * Update Tenant
 * ============================================================================
 *
 * Updates the editable tenant information.
 *
 * Editable fields:
 * - tenantName
 * - apartmentNumber
 * - monthlyRent
 *
 * Rental agreement metadata is intentionally excluded.
 */
export const updateTenant = async (
    tenantId: string,
    updateData: UpdateTenantData,
) => {
    /**
     * ------------------------------------------------------------------------
     * Verify Tenant Exists
     * ------------------------------------------------------------------------
     *
     * We check existence at the service layer so that the API can return
     * a meaningful 404 response instead of silently returning null.
     */
    const tenant =
        await tenantRepository.findTenantById(
            tenantId,
        );

    if (!tenant) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Tenant not found.",
        );
    }

    /**
     * ------------------------------------------------------------------------
     * Update Tenant
     * ------------------------------------------------------------------------
     *
     * The repository is responsible only for the database operation.
     */
    return tenantRepository.updateTenantById(
        tenantId,
        updateData,
    );
};

/**
 * ============================================================================
 * Upload Rental Agreement
 * ============================================================================
 *
 * Uploads a rental agreement for an existing tenant.
 *
 * Responsibilities
 * ----------------
 * - Verify that the tenant exists.
 * - Delete the existing rental agreement if present.
 * - Prepare rental agreement metadata.
 * - Update the tenant with the new rental agreement.
 *
 * ============================================================================
 */

export const uploadAgreement = async (
    tenantId: string,
    file: Express.Multer.File,
) => {
    /**
     * Check if the tenant exists.
     */
    const tenant =
        await tenantRepository.findTenantById(
            tenantId,
        );

    if (!tenant) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Tenant not found.",
        );
    }

    /**
     * Delete the previous rental agreement if it exists.
     */
    if (tenant.rentalAgreement?.path) {
        try {
            await fs.access(
                tenant.rentalAgreement.path,
            );

            await fs.unlink(
                tenant.rentalAgreement.path,
            );
        } catch (error) {
            /**
             * Ignore missing files.
             *
             * The database can still be updated with the newly uploaded
             * agreement.
             */
            console.error(
                "Failed to delete previous rental agreement:",
                error,
            );
        }
    }

    /**
     * Prepare rental agreement metadata.
     */
    const rentalAgreement = {
        originalName:
            file.originalname,

        storedName:
            file.filename,

        mimeType:
            file.mimetype,

        size:
            file.size,

        path:
            file.path,

        uploadedAt:
            new Date(),
    };

    /**
     * Store the new agreement metadata.
     */
    return tenantRepository.updateRentalAgreement(
        tenantId,
        rentalAgreement,
    );
};

/**
 * ============================================================================
 * Download Rental Agreement
 * ============================================================================
 */

export const downloadAgreement = async (
    tenantId: string,
) => {
    /**
     * Check if the tenant exists.
     */
    const tenant =
        await tenantRepository.findTenantById(
            tenantId,
        );

    if (!tenant) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Tenant not found.",
        );
    }

    /**
     * Check if the tenant has an agreement.
     */
    if (!tenant.rentalAgreement?.path) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Rental agreement not found.",
        );
    }

    /**
     * Verify that the agreement file still exists.
     */
    try {
        await fs.access(
            tenant.rentalAgreement.path,
        );
    } catch {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Rental agreement file not found.",
        );
    }

    return tenant.rentalAgreement;
};

/**
 * ============================================================================
 * Delete Rental Agreement
 * ============================================================================
 */

export const deleteAgreement = async (
    tenantId: string,
) => {
    /**
     * Check if the tenant exists.
     */
    const tenant =
        await tenantRepository.findTenantById(
            tenantId,
        );

    if (!tenant) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Tenant not found.",
        );
    }

    /**
     * Check if the tenant has an agreement.
     */
    if (!tenant.rentalAgreement?.path) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Rental agreement not found.",
        );
    }

    /**
     * Delete the physical agreement file.
     */
    try {
        await fs.unlink(
            tenant.rentalAgreement.path,
        );
    } catch (error) {
        /**
         * Ignore missing files because the database metadata can still
         * be cleaned up.
         */
        if (
            (error as NodeJS.ErrnoException)
                .code !== "ENOENT"
        ) {
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Failed to delete the rental agreement file.",
            );
        }
    }

    /**
     * Remove agreement metadata from MongoDB.
     */
    return tenantRepository.removeRentalAgreement(
        tenantId,
    );
};