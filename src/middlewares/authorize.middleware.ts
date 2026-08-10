/**
 * ============================================================================
 * File: authorize.middleware.ts
 * Layer: Middleware
 * ============================================================================
 *
 * Purpose
 * -------
 * Ensures users can access only their own resources.
 *
 * Responsibilities
 * ----------------
 * - Compare authenticated user id.
 * - Compare requested resource id.
 * - Reject unauthorized access.
 *
 * ============================================================================
 */

import type {
    NextFunction,
    Request,
    Response,
} from "express";

import ApiError from "../utils/ApiError.js";

import { httpStatus } from "../constants/httpStatus.js";

/**
 * ============================================================================
 * Authorization Middleware
 * ============================================================================
 */
const authorizeOwner = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Authentication is required.",
        );
    }

    const { id } = req.params;

    if (
        authenticatedUser._id.toString() !== id
    ) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorized to perform this action.",
        );
    }

    next();
};

export default authorizeOwner;