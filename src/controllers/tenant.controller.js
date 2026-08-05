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

import * as tenantService from "../services/tenant.service.js";

import * as ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Creates a tenant.
 */
export const createTenant = catchAsync(async (req, res) => {
  const tenant = await tenantService.createTenant(req.validated.body);

  return ApiResponse.created(res, tenant, "Tenant created successfully.");
});

/**
 * Returns all tenants.
 */
export const getAllTenants = catchAsync(async (req, res) => {
  const tenants = await tenantService.getAllTenants();

  return ApiResponse.ok(res, tenants, "Tenants fetched successfully.");
});

/**
 * ============================================================================
 * Upload Rental Agreement
 * ============================================================================
 *
 * Uploads a rental agreement for an existing tenant.
 *
 * Responsibilities
 * ----------------
 * - Receive validated route parameters.
 * - Receive uploaded file.
 * - Delegate business logic to the service layer.
 * - Return a standardized success response.
 *
 * Route
 * -----
 * POST /api/v1/tenants/:tenantId/agreement
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 * ============================================================================
 */
export const uploadAgreement = catchAsync(async (req, res) => {
  const { tenantId } = req.validated.params;

  const updatedTenant = await tenantService.uploadAgreement(tenantId, req.file);

  return ApiResponse.ok(
    res,
    updatedTenant,
    "Rental agreement uploaded successfully.",
  );
});

/**
 * ============================================================================
 * Download Rental Agreement
 * ============================================================================
 *
 * Downloads the rental agreement for an existing tenant.
 *
 * Responsibilities
 * ----------------
 * - Receive validated route parameters.
 * - Delegate business logic to the service layer.
 * - Download the rental agreement.
 *
 * Route
 * -----
 * GET /api/v1/tenants/:tenantId/agreement
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 * ============================================================================
 */
export const downloadAgreement = catchAsync(async (req, res) => {
  const { tenantId } = req.validated.params;

  const agreement = await tenantService.downloadAgreement(tenantId);

  return res.download(agreement.path, agreement.originalName);
});

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
// export const removeRentalAgreement = async (tenantId) => {
//   return TenantModel.findByIdAndUpdate(
//     tenantId,
//     {
//       rentalAgreement: null,
//     },
//     {
//       new: true,
//       runValidators: true,
//     },
//   );
// };

/**
 * ============================================================================
 * Delete Rental Agreement
 * ============================================================================
 *
 * Deletes the rental agreement for an existing tenant.
 *
 * Responsibilities
 * ----------------
 * - Receive validated route parameters.
 * - Delegate business logic to the service layer.
 * - Return a success response.
 *
 * Route
 * -----
 * DELETE /api/v1/tenants/:tenantId/agreement
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 * ============================================================================
 */

export const deleteAgreement = catchAsync(async (req, res) => {
  const { tenantId } = req.validated.params;

  await tenantService.deleteAgreement(tenantId);

  return ApiResponse.ok(res, null, "Rental agreement deleted successfully.");
});
