/**
 * ============================================================================
 * Tenant Controller
 * ============================================================================
 *
 * Purpose
 * -------
 * Handles HTTP requests and responses for Tenant operations.
 *
 * Responsibilities
 * ----------------
 * - Receive validated HTTP requests.
 * - Call the appropriate Tenant service.
 * - Return standardized API responses.
 *
 * Business logic belongs to the Service layer.
 * Database operations belong to the Repository layer.
 *
 * ============================================================================
 */

import type {
    Request,
    Response,
} from "express";

import * as tenantService from "../services/tenant.service.js";

import * as ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";
import catchAsync from "../utils/catchAsync.js";
import type {
    UpdateTenantData,
} from "../types/tenant.types.js";

/**
 * ============================================================================
 * Create Tenant
 * ============================================================================
 *
 * POST /api/v1/tenants
 *
 * Creates a new tenant.
 */
export const createTenant = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        /**
         * Retrieve the request body populated by the validation middleware.
         */
        const { body } =
            req.validated;

        /**
         * Create the tenant through the service layer.
         */
        const tenant =
            await tenantService.createTenant(
                body as {
                    tenantName: string;
                    apartmentNumber: string;
                    monthlyRent: number;
                },
            );

        /**
         * Return the newly created tenant.
         */
        return ApiResponse.created(
            res,
            tenant,
            "Tenant created successfully.",
        );
    },
);

/**
 * ============================================================================
 * Get All Tenants
 * ============================================================================
 *
 * GET /api/v1/tenants
 *
 * Returns all tenant records.
 */
export const getAllTenants = catchAsync(
    async (
        _req: Request,
        res: Response,
    ) => {
        /**
         * Fetch tenants through the service layer.
         */
        const tenants =
            await tenantService.getAllTenants();

        /**
         * Return the tenant collection.
         */
        return ApiResponse.ok(
            res,
            tenants,
            "Tenants fetched successfully.",
        );
    },
);

/**
 * ============================================================================
 * Update Tenant
 * ============================================================================
 *
 * PATCH /api/v1/tenants/:tenantId
 *
 * Updates the editable tenant information.
 *
 * Editable fields:
 *
 * - tenantName
 * - apartmentNumber
 * - monthlyRent
 *
 * Rental agreement metadata is deliberately excluded because it has its
 * own upload/delete workflow.
 */
export const updateTenant = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        /**
         * Retrieve validated route parameters.
         */
        const { tenantId } =
            req.validated.params as {
                tenantId: string;
            };

        /**
         * Retrieve validated request body.
         */
        const { body } =
            req.validated;

        /**
         * Update the tenant through the service layer.
         */
        const updatedTenant =
            await tenantService.updateTenant(
                tenantId,
                body as UpdateTenantData,
            );

        /**
         * Return the updated tenant.
         */
        return ApiResponse.ok(
            res,
            updatedTenant,
            "Tenant updated successfully.",
        );
    },
);

/**
 * ============================================================================
 * Upload Rental Agreement
 * ============================================================================
 *
 * POST /api/v1/tenants/:tenantId/agreement
 *
 * Uploads a rental agreement for an existing tenant.
 */
export const uploadAgreement = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        /**
         * Retrieve the validated tenant ID.
         */
        const { tenantId } =
            req.validated.params as {
                tenantId: string;
            };

        /**
         * Upload the agreement through the service layer.
         */
        const updatedTenant =
            await tenantService.uploadAgreement(
                tenantId,
                req.file as Express.Multer.File,
            );

        /**
         * Return the updated tenant.
         */
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
 *
 * GET /api/v1/tenants/:tenantId/agreement
 *
 * Downloads the tenant's rental agreement.
 */
export const downloadAgreement = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        /**
         * Retrieve the validated tenant ID.
         */
        const { tenantId } =
            req.validated.params as {
                tenantId: string;
            };

        /**
         * Retrieve agreement metadata through the service.
         */
        const agreement =
            await tenantService.downloadAgreement(
                tenantId,
            );

        /**
         * Send the physical file to the client.
         */
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
 *
 * DELETE /api/v1/tenants/:tenantId/agreement
 *
 * Deletes the physical agreement file and removes its metadata.
 */
export const deleteAgreement = catchAsync(
    async (
        req: Request,
        res: Response,
    ) => {
        /**
         * Retrieve the validated tenant ID.
         */
        const { tenantId } =
            req.validated.params as {
                tenantId: string;
            };

        /**
         * Delete the agreement through the service layer.
         */
        await tenantService.deleteAgreement(
            tenantId,
        );

        /**
         * Return a standardized success response.
         */
        return ApiResponse.ok(
            res,
            null,
            "Rental agreement deleted successfully.",
        );
    },
);

/** GET /api/v1/tenants/me — tenant can only retrieve the linked record. */
export const getMyTenant = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId?.toString();
    if (!tenantId) {
        throw new ApiError(httpStatus.FORBIDDEN, "This account is not linked to a tenant record.");
    }

    const tenant = await tenantService.getTenantProfileForUser(tenantId);
    return ApiResponse.ok(res, tenant, "Tenant profile fetched successfully.");
});

/** GET /api/v1/tenants/me/agreement — download only the authenticated tenant's agreement. */
export const downloadMyAgreement = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId?.toString();
    if (!tenantId) {
        throw new ApiError(httpStatus.FORBIDDEN, "This account is not linked to a tenant record.");
    }

    const agreement = await tenantService.downloadAgreement(tenantId);
    return res.download(agreement.path, agreement.originalName);
});

/** DELETE /api/v1/tenants/:tenantId — owner-only tenant deletion. */
export const deleteTenant = catchAsync(async (req: Request, res: Response) => {
    const { tenantId } = req.validated.params as { tenantId: string };
    await tenantService.deleteTenant(tenantId);
    return ApiResponse.ok(res, null, "Tenant deleted successfully.");
});
