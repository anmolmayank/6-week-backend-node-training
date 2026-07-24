import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyAccessToken } from "../utils/jwt.js";

import { httpStatus } from "../constants/httpStatus.js";

import * as userRepository from "../repositories/user.repository.js";

/**
 * ------------------------------------------------------------------
 * Authentication Middleware
 * ------------------------------------------------------------------
 *
 * Responsibilities:
 *
 * 1. Read Authorization header.
 * 2. Validate Bearer token.
 * 3. Verify JWT.
 * 4. Fetch authenticated user.
 * 5. Attach user to req.user.
 * ------------------------------------------------------------------
 */
const authenticate = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Authentication token is required.",
    );
  }

  if (!authorization.startsWith("Bearer ")) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid authorization header format.",
    );
  }

  const accessToken = authorization.split(" ")[1];

  /**
   * ------------------------------------------------------------
   * Development Log
   * ------------------------------------------------------------
   */
  console.log("\n=========== JWT Received ===========");
  console.log(accessToken);
  console.log("====================================\n");

  const decodedToken = verifyAccessToken(accessToken);

  const authenticatedUser = await userRepository.findById(decodedToken.userId);

  if (!authenticatedUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User no longer exists.");
  }

  req.user = authenticatedUser;

  next();
});

export default authenticate;
