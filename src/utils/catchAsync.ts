/**
 * ============================================================================
 * File: catchAsync.ts
 * Layer: Utility
 * ============================================================================
 *
 * Purpose
 * -------
 * Wraps asynchronous Express route handlers and automatically forwards
 * rejected promises to the global error handler.
 *
 * Responsibilities
 * ----------------
 * - Execute async route handlers.
 * - Catch rejected promises.
 * - Forward errors to Express using next().
 *
 * ============================================================================
 */

import type {
    NextFunction,
    Request,
    Response,
    RequestHandler,
} from "express";

/**
 * ============================================================================
 * Async Request Handler
 * ============================================================================
 *
 * Represents an asynchronous Express route handler.
 */
type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<unknown>;

/**
 * ============================================================================
 * Catch Async
 * ============================================================================
 */
const catchAsync = (
    handler: AsyncRequestHandler,
): RequestHandler => {
    return (
        req,
        res,
        next,
    ): void => {
        Promise.resolve(
            handler(
                req,
                res,
                next,
            ),
        ).catch(next);
    };
};

export default catchAsync;