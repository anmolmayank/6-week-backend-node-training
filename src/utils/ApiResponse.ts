/**
 * ============================================================================
 * File: ApiResponse.ts
 * Layer: Utility
 * ============================================================================
 *
 * Purpose
 * -------
 * Provides standardized API success responses.
 *
 * Responsibilities
 * ----------------
 * - Return consistent JSON response structure.
 * - Provide helper methods for common HTTP status codes.
 *
 * ============================================================================
 */

import type { Response } from "express";

import { httpStatus } from "../constants/httpStatus.js";

/**
 * ============================================================================
 * Standard API Success Response
 * ============================================================================
 */
export const success = <T>(
    res: Response,
    statusCode: number,
    data: T | null = null,
    message = "Success",
    meta: Record<string, unknown> = {},
): Response => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        meta,
    });
};

/**
 * ============================================================================
 * HTTP 200
 * ============================================================================
 */
export const ok = <T>(
    res: Response,
    data: T,
    message = "Success",
    meta: Record<string, unknown> = {},
): Response => {
    return success(
        res,
        httpStatus.OK,
        data,
        message,
        meta,
    );
};

/**
 * ============================================================================
 * HTTP 201
 * ============================================================================
 */
export const created = <T>(
    res: Response,
    data: T,
    message = "Created successfully",
): Response => {
    return success(
        res,
        httpStatus.CREATED,
        data,
        message,
    );
};

/**
 * ============================================================================
 * HTTP 204
 * ============================================================================
 */
export const noContent = (
    res: Response,
): Response => {
    return res
        .status(httpStatus.NO_CONTENT)
        .send();
};