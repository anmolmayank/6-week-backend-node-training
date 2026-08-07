/**
 * ============================================================================
 * Tenant Service
 * ============================================================================
 *
 * Purpose
 * -------
 * Implements business logic for Tenant operations.
 *
 * ============================================================================
 */

import fs from "node:fs/promises";

import * as tenantRepository from "../repositories/tenant.repository.js";

import ApiError from "../utils/ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";

/**
 * Creates a tenant.
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
 * Returns all tenants.
 */
export const getAllTenants = async () => {
    return tenantRepository.findAllTenants();
};

/**
 * Returns a single tenant.
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
 * Upload Rental Agreement
 * ============================================================================
 *
 * Uploads a rental agreement for an existing tenant.
 *
 * Responsibilities
 * ----------------
 * - Verify that the tenant exists.
 * - Delete the existing rental agreement (if present).
 * - Prepare rental agreement metadata.
 * - Update the tenant with the new rental agreement.
 *
 * ============================================================================
 */
export const uploadAgreement = async (
    tenantId: string,
    file: Express.Multer.File,
) => {
    // Check if the tenant exists.
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

    // Delete the previous rental agreement if it exists.
    if (tenant.rentalAgreement?.path) {
        try {
            await fs.access(
                tenant.rentalAgreement.path,
            );

            await fs.unlink(
                tenant.rentalAgreement.path,
            );
        } catch (error) {
            // Ignore if the previous rental agreement does not exist.
            console.error(
                "Failed to delete previous rental agreement:",
                error,
            );
        }
    }

    // Prepare rental agreement metadata.
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

    // Update tenant with the new rental agreement.
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
    // Check if the tenant exists.
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

    // Check if the tenant has a rental agreement.
    if (!tenant.rentalAgreement?.path) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Rental agreement not found.",
        );
    }

    // Verify that the rental agreement file exists.
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
    // Check if the tenant exists.
    const tenant =
        await tenantRepository.findTenantById(
            tenantId,
        );

    if (!tenant) {
        throw new ApiError(
            404,
            "Tenant not found.",
        );
    }

    // Check if the tenant has a rental agreement.
    if (!tenant.rentalAgreement?.path) {
        throw new ApiError(
            404,
            "Rental agreement not found.",
        );
    }

    // Delete the rental agreement file.
    try {
        await fs.unlink(
            tenant.rentalAgreement.path,
        );
    } catch (error) {
        if (
            (error as NodeJS.ErrnoException)
                .code !== "ENOENT"
        ) {
            throw new ApiError(
                500,
                "Failed to delete the rental agreement file.",
            );
        }
    }

    // Remove the rental agreement metadata.
    return tenantRepository.removeRentalAgreement(
        tenantId,
    );
};