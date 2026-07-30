/**
 * ============================================================================
 * Tenant Routes
 * ============================================================================
 */

import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import uploadRentalAgreement from "../middlewares/upload.middleware.js";
import * as tenantController from "../controllers/tenant.controller.js";

import {
    createTenantSchema,
    downloadAgreementSchema,
    uploadAgreementSchema,
    deleteAgreementSchema

} from "../validations/tenant.validation.js";

const router = express.Router();

/**
 * Returns all tenants.
 */
router.get(
    "/",
    authenticate,
    tenantController.getAllTenants
);

/**
 * Creates a tenant.
 */
router.post(
    "/",
    authenticate,
    validate(createTenantSchema),
    tenantController.createTenant
);

/**
 * ============================================================================
 * Upload Rental Agreement
 * ============================================================================
 *
 * Uploads a rental agreement for an existing tenant.
 */
router.post(
    "/:tenantId/agreement",
    authenticate,
    uploadRentalAgreement,
    validate(uploadAgreementSchema),
    tenantController.uploadAgreement
);


/**
 * ============================================================================
 * Download Rental Agreement
 * ============================================================================
 *
 * Downloads the rental agreement for an existing tenant.
 */
router.get(
    "/:tenantId/agreement",
    authenticate,
    validate(downloadAgreementSchema),
    tenantController.downloadAgreement
);

/**
 * ============================================================================
 * Delete Rental Agreement
 * ============================================================================
 *
 * Deletes the rental agreement for an existing tenant.
 */
router.delete(
    "/:tenantId/agreement",
    authenticate,
    validate(deleteAgreementSchema),
    tenantController.deleteAgreement
);

export default router;