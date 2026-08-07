/**
 * ============================================================================
 * File: upload.middleware.ts
 * Layer: Middleware
 * ============================================================================
 *
 * Purpose
 * -------
 * Handles Rental Agreement uploads using Multer.
 *
 * Responsibilities
 * ----------------
 * - Execute Multer.
 * - Handle Multer-specific errors.
 * - Ensure a file is uploaded.
 * - Pass the request to the next middleware/controller.
 *
 * ============================================================================
 */

import type {
    NextFunction,
    Request,
    Response,
} from "express";

import multer from "multer";

import upload from "../config/multer.js";
import ApiError from "../utils/ApiError.js";

/**
 * ============================================================================
 * Upload Rental Agreement Middleware
 * ============================================================================
 */
const uploadRentalAgreement = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    upload.single("agreement")(
        req,
        res,
        (error: unknown): void => {
            if (error instanceof multer.MulterError) {
                switch (error.code) {
                    case "LIMIT_FILE_SIZE":
                        next(
                            new ApiError(
                                400,
                                "Uploaded file exceeds the maximum allowed size of 10 MB.",
                            ),
                        );
                        return;

                    case "LIMIT_FILE_COUNT":
                        next(
                            new ApiError(
                                400,
                                "Only one rental agreement can be uploaded.",
                            ),
                        );
                        return;

                    default:
                        next(
                            new ApiError(
                                400,
                                error.message,
                            ),
                        );
                        return;
                }
            }

            if (error instanceof Error) {
                next(
                    new ApiError(
                        400,
                        error.message,
                    ),
                );
                return;
            }

            if (!req.file) {
                next(
                    new ApiError(
                        400,
                        "Rental agreement PDF is required.",
                    ),
                );
                return;
            }

            next();
        },
    );
};

export default uploadRentalAgreement;