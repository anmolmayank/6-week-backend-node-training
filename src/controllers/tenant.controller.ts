import type {
    Request,
    Response,
} from "express";

import * as tenantService from "../services/tenant.service.js";

import * as ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * ============================================================================
 * Tenant Controller
 * ============================================================================
 *
 * Purpose
 * -------
 * Handles HTTP requests and responses.
 *
 * ============================================================================
 */

/**
 * Creates a tenant.
 */
export const createTenant = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        const { body } =
            req.validated;

        const tenant =
            await tenantService.createTenant(
                body as {
                    tenantName: string;
                    apartmentNumber: string;
                    monthlyRent: number;
                },
            );

        return ApiResponse.created(
            res,
            tenant,
            "Tenant created successfully.",
        );
    },
);

/**
 * Returns all tenants.
 */
export const getAllTenants = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        const tenants =
            await tenantService.getAllTenants();

        return ApiResponse.ok(
            res,
            tenants,
            "Tenants fetched successfully.",
        );
    },
);

/**
 * ============================================================================
 * Upload Rental Agreement
 * ============================================================================
 *
 * Uploads a rental agreement for an existing tenant.
 * ============================================================================
 */
export const uploadAgreement = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        const { tenantId } =
            req.validated.params as {
                tenantId: string;
            };

        const updatedTenant =
            await tenantService.uploadAgreement(
                tenantId,
                req.file as Express.Multer.File,
            );

        return ApiResponse.ok(
            res,
            updatedTenant,
            "Rental agreement uploaded successfully.",
        );
    },
);

/**
 * ============================================================================
 * Download Rental Agreement
 * ============================================================================
 */
export const downloadAgreement = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        const { tenantId } =
            req.validated.params as {
                tenantId: string;
            };

        const agreement =
            await tenantService.downloadAgreement(
                tenantId,
            );

        return res.download(
            agreement.path,
            agreement.originalName,
        );
    },
);

/**
 * ============================================================================
 * Delete Rental Agreement
 * ============================================================================
 */
export const deleteAgreement = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        const { tenantId } =
            req.validated.params as {
                tenantId: string;
            };

        await tenantService.deleteAgreement(
            tenantId,
        );

        return ApiResponse.ok(
            res,
            null,
            "Rental agreement deleted successfully.",
        );
    },
);