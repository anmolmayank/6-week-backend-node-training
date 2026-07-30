/**
 * ============================================================================
 * File: upload.middleware.js
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

import multer from "multer";

import upload from "../config/multer.js";
import ApiError from "../utils/ApiError.js";

/**
 * ============================================================================
 * Upload Rental Agreement Middleware
 * ============================================================================
 */
const uploadRentalAgreement = (req, res, next) => {
    upload.single("agreement")(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            switch (error.code) {
                case "LIMIT_FILE_SIZE":
                    return next(
                        new ApiError(
                            400,
                            "Uploaded file exceeds the maximum allowed size of 10 MB."
                        )
                    );

                case "LIMIT_FILE_COUNT":
                    return next(
                        new ApiError(
                            400,
                            "Only one rental agreement can be uploaded."
                        )
                    );

                default:
                    return next(
                        new ApiError(
                            400,
                            error.message
                        )
                    );
            }
        }

        if (error) {
            return next(
                new ApiError(
                    400,
                    error.message
                )
            );
        }

        if (!req.file) {
            return next(
                new ApiError(
                    400,
                    "Rental agreement PDF is required."
                )
            );
        }

        next();
    });
};

export default uploadRentalAgreement;