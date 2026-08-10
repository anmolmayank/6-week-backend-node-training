/**
 * ============================================================================
 * File: auth.middleware.ts
 * Layer: Middleware
 * ============================================================================
 *
 * Purpose
 * -------
 * Authenticates incoming requests using JWT.
 *
 * Responsibilities
 * ----------------
 * - Read Authorization header.
 * - Validate Bearer token.
 * - Verify JWT.
 * - Load authenticated user.
 * - Attach authenticated user to req.user.
 *
 * ============================================================================
 */

import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { httpStatus } from "../constants/httpStatus.js";

import * as userRepository from "../repositories/user.repository.js";

import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyAccessToken } from "../utils/jwt.js";

/**
 * ============================================================================
 * Authentication Middleware
 * ============================================================================
 */
const authenticate = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
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

        const accessToken =
            authorization.split(" ")[1];

        const decodedToken =
            verifyAccessToken(accessToken);

        const authenticatedUser =
            await userRepository.findById(
                decodedToken.userId,
            );

        if (!authenticatedUser) {
            throw new ApiError(
                httpStatus.UNAUTHORIZED,
                "User no longer exists.",
            );
        }

        req.user = authenticatedUser;

        next();
    },
);

export default authenticate;