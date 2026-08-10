/**
 * ============================================================================
 * File: notFound.middleware.ts
 * Layer: Middleware
 * ============================================================================
 *
 * Purpose
 * -------
 * Handles requests for routes that do not exist.
 *
 * Responsibilities
 * ----------------
 * - Create a standardized 404 error.
 * - Forward the error to the global error handler.
 *
 * ============================================================================
 */

import type { RequestHandler } from "express";

import { httpStatus } from "../constants/httpStatus.js";
import ApiError from "../utils/ApiError.js";

/**
 * ============================================================================
 * Not Found Middleware
 * ============================================================================
 */
const notFoundHandler: RequestHandler = (
    req,
    res,
    next,
) => {
    next(
        new ApiError(
            httpStatus.NOT_FOUND,
            `Route '${req.method} ${req.originalUrl}' not found`,
        ),
    );
};

export default notFoundHandler;