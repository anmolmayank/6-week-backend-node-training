/**
 * ============================================================================
 * Tenant Routes
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines HTTP routes for Tenant operations.
 *
 * Responsibilities
 * ----------------
 * - Authenticate Tenant requests.
 * - Validate request parameters/body.
 * - Delegate requests to Tenant controllers.
 *
 * Business logic remains in the Service layer.
 *
 * ============================================================================
 */

import express from "express";

import * as tenantController from "../controllers/tenant.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import uploadRentalAgreement from "../middlewares/upload.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    createTenantSchema,
    deleteAgreementSchema,
    downloadAgreementSchema,
    updateTenantSchema,
    uploadAgreementSchema,
} from "../validations/tenant.validation.js";

const router =
    express.Router();

/**
 * ============================================================================
 * Get All Tenants
 * ============================================================================
 *
 * GET /api/v1/tenants
 *
 * Returns all tenants.
 */
router.get(
    "/",
    authenticate,
    tenantController.getAllTenants,
);

/**
 * ============================================================================
 * Create Tenant
 * ============================================================================
 *
 * POST /api/v1/tenants
 *
 * Creates a new tenant.
 */
router.post(
    "/",
    authenticate,
    validate(createTenantSchema),
    tenantController.createTenant,
);

/**
 * ============================================================================
 * Update Tenant
 * ============================================================================
 *
 * PATCH /api/v1/tenants/:tenantId
 *
 * Updates the editable tenant information:
 *
 * - tenantName
 * - apartmentNumber
 * - monthlyRent
 *
 * Rental agreement management remains separate.
 */
router.patch(
    "/:tenantId",
    authenticate,
    validate(updateTenantSchema),
    tenantController.updateTenant,
);

/**
 * ============================================================================
 * Upload Rental Agreement
 * ============================================================================
 *
 * POST /api/v1/tenants/:tenantId/agreement
 *
 * Uploads or replaces a rental agreement.
 */
router.post(
    "/:tenantId/agreement",
    authenticate,
    uploadRentalAgreement,
    validate(uploadAgreementSchema),
    tenantController.uploadAgreement,
);

/**
 * ============================================================================
 * Download Rental Agreement
 * ============================================================================
 *
 * GET /api/v1/tenants/:tenantId/agreement
 *
 * Downloads the rental agreement.
 */
router.get(
    "/:tenantId/agreement",
    authenticate,
    validate(downloadAgreementSchema),
    tenantController.downloadAgreement,
);

/**
 * ============================================================================
 * Delete Rental Agreement
 * ============================================================================
 *
 * DELETE /api/v1/tenants/:tenantId/agreement
 *
 * Deletes the rental agreement.
 */
router.delete(
    "/:tenantId/agreement",
    authenticate,
    validate(deleteAgreementSchema),
    tenantController.deleteAgreement,
);

export default router;