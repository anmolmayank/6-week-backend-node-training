/**
 * ============================================================================
 * File: logger.middleware.ts
 * Layer: Middleware
 * ============================================================================
 *
 * Purpose
 * -------
 * Logs incoming HTTP requests.
 *
 * Responsibilities
 * ----------------
 * - Log request timestamp.
 * - Log HTTP method.
 * - Log request URL.
 * - Pass control to the next middleware.
 *
 * ============================================================================
 */

import type {
    NextFunction,
    Request,
    Response,
} from "express";

/**
 * ============================================================================
 * Request Logger Middleware
 * ============================================================================
 */
const logger = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.log("===================================");

    console.log(
        "Time :",
        new Date().toISOString(),
    );

    console.log(
        "Method :",
        req.method,
    );

    console.log(
        "URL :",
        req.originalUrl,
    );

    console.log("===================================");

    /**
     * Calling next() passes control to the
     * next middleware in the request pipeline.
     */
    next();
};

export default logger;