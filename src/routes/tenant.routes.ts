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

const router = express.Router();

/**
 * ============================================================================
 * Get All Tenants
 * ============================================================================
 *
 * GET /api/v1/tenants
 *
 * Returns all tenants.
 */

/**
 * @openapi
 * /tenants:
 *   get:
 *     tags:
 *       - Tenants
 *     summary: Get all tenants
 *     description: Retrieves all tenant records.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       "200":
 *         description: Tenants fetched successfully.
 *       "401":
 *         description: Authentication is missing or invalid.
 */
router.get("/", authenticate, tenantController.getAllTenants);

/**
 * ============================================================================
 * Create Tenant
 * ============================================================================
 *
 * POST /api/v1/tenants
 *
 * Creates a new tenant.
 */

/**
 * @openapi
 * /tenants:
 *   post:
 *     tags:
 *       - Tenants
 *     summary: Create a tenant
 *     description: Creates a tenant using the supplied tenant details.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantName
 *               - apartmentNumber
 *               - monthlyRent
 *             properties:
 *               tenantName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Rahul Sharma
 *               apartmentNumber:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 20
 *                 example: A-101
 *               monthlyRent:
 *                 type: number
 *                 minimum: 0
 *                 example: 25000
 *     responses:
 *       "201":
 *         description: Tenant created successfully.
 *       "400":
 *         description: Request validation failed.
 *       "401":
 *         description: Authentication is missing or invalid.
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

/**
 * @openapi
 * /tenants/{tenantId}:
 *   patch:
 *     tags:
 *       - Tenants
 *     summary: Update a tenant
 *     description: >
 *       Partially updates tenant information. At least one field must be
 *       supplied. Rental agreement metadata is managed separately.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         description: MongoDB ObjectId of the tenant.
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 689d58b7d6ef8d8c0b7d1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               tenantName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Rahul Sharma
 *               apartmentNumber:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 20
 *                 example: A-102
 *               monthlyRent:
 *                 type: number
 *                 minimum: 0
 *                 example: 28000
 *     responses:
 *       "200":
 *         description: Tenant updated successfully.
 *       "400":
 *         description: Invalid tenant ID or request validation failed.
 *       "401":
 *         description: Authentication is missing or invalid.
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

/**
 * @openapi
 * /tenants/{tenantId}/agreement:
 *   post:
 *     tags:
 *       - Rental Agreements
 *     summary: Upload a rental agreement
 *     description: >
 *       Uploads or replaces a tenant's rental agreement.
 *       Only one agreement file is accepted, with a maximum size of 10 MB.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         description: MongoDB ObjectId of the tenant.
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 689d58b7d6ef8d8c0b7d1234
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - agreement
 *             properties:
 *               agreement:
 *                 type: string
 *                 format: binary
 *                 description: Rental agreement PDF, maximum 10 MB.
 *     responses:
 *       "200":
 *         description: Rental agreement uploaded successfully.
 *       "400":
 *         description: >
 *           Invalid tenant ID, missing agreement PDF, invalid upload,
 *           or file exceeds the 10 MB limit.
 *       "401":
 *         description: Authentication is missing or invalid.
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

/**
 * @openapi
 * /tenants/{tenantId}/agreement:
 *   get:
 *     tags:
 *       - Rental Agreements
 *     summary: Download a rental agreement
 *     description: Downloads the agreement file associated with a tenant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         description: MongoDB ObjectId of the tenant.
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 689d58b7d6ef8d8c0b7d1234
 *     responses:
 *       "200":
 *         description: Rental agreement file downloaded successfully.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       "400":
 *         description: Invalid tenant ID.
 *       "401":
 *         description: Authentication is missing or invalid.
 *       "404":
 *         description: Tenant or rental agreement not found.
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

/**
 * @openapi
 * /tenants/{tenantId}/agreement:
 *   delete:
 *     tags:
 *       - Rental Agreements
 *     summary: Delete a rental agreement
 *     description: Deletes the agreement file and removes its metadata.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         description: MongoDB ObjectId of the tenant.
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         example: 689d58b7d6ef8d8c0b7d1234
 *     responses:
 *       "200":
 *         description: Rental agreement deleted successfully.
 *       "400":
 *         description: Invalid tenant ID.
 *       "401":
 *         description: Authentication is missing or invalid.
 *       "404":
 *         description: Tenant or rental agreement not found.
 */
router.delete(
  "/:tenantId/agreement",
  authenticate,
  validate(deleteAgreementSchema),
  tenantController.deleteAgreement,
);

export default router;
