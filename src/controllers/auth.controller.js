import * as authService from "../services/auth.service.js";

import * as ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * ------------------------------------------------------------------
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 * ------------------------------------------------------------------
 *
 * Authenticates a user using their email and password.
 *
 * On successful authentication, returns:
 * - Authenticated user details
 * - JWT access token
 * ------------------------------------------------------------------
 */
export const login = catchAsync(async (req, res) => {
  /**
   * Retrieve validated request body.
   */
  const { body } = req.validated;

  /**
   * Authenticate the user.
   */
  const result = await authService.login(body);

  /**
   * Return authenticated user and access token.
   */
  return ApiResponse.ok(
    res,
    result,
    "Login successful."
  );
});