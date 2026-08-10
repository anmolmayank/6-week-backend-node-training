/**
 * ============================================================================
 * File: validate.middleware.ts
 * Layer: Middleware
 * ============================================================================
 *
 * Purpose
 * -------
 * Validates incoming request data using a supplied Zod schema.
 *
 * Responsibilities
 * ----------------
 * - Validate request body.
 * - Validate route parameters.
 * - Validate query parameters.
 * - Attach validated data to req.validated.
 *
 * ============================================================================
 */

import type {
    NextFunction,
    Request,
    Response,
} from "express";

import {
    type ZodType,
    ZodError,
} from "zod";

import ApiError from "../utils/ApiError.js";

import { httpStatus } from "../constants/httpStatus.js";

/**
 * ============================================================================
 * Validation Middleware
 * ============================================================================
 */
const validate =
    <
        T extends {
            body?: unknown;
            params?: unknown;
            query?: unknown;
        },
    >(
        schema: ZodType<T>,
    ) =>
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            /**
             * Validate request.
             */
            const validatedData =
                await schema.parseAsync({
                    body: req.body,
                    params: req.params,
                    query: req.query,
                });

            /**
             * Store validated request.
             */
            req.validated = validatedData;

            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const formattedErrors =
                    error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    }));

                next(
                    new ApiError(
                        httpStatus.BAD_REQUEST,
                        "Validation failed.",
                        formattedErrors,
                    ),
                );

                return;
            }

            next(error);
        }
    };

export default validate;