/**
 * ============================================================================
 * File: error.middleware.ts
 * Layer: Middleware
 * ============================================================================
 *
 * Purpose
 * -------
 * Centralized error handling middleware.
 *
 * Responsibilities
 * ----------------
 * - Handle application errors.
 * - Handle validation errors.
 * - Handle business errors.
 * - Handle unexpected server errors.
 * - Return a standardized error response.
 *
 * ============================================================================
 */

import type { ErrorRequestHandler } from "express";

import { httpStatus } from "../constants/httpStatus.js";

/**
 * ============================================================================
 * Global Error Handler
 * ============================================================================
 */
const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next,
) => {
    const statusCode =
        typeof error?.statusCode === "number"
            ? error.statusCode
            : httpStatus.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        success: false,

        message:
            error?.message ??
            "Internal Server Error",

        errors:
            error?.errors ?? [],
    });
};

export default errorHandler;