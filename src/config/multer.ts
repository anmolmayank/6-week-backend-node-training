/**
 * ============================================================================
 * File: multer.ts
 * Layer: Configuration
 * ============================================================================
 *
 * Purpose
 * -------
 * Configures Multer for handling Rental Agreement uploads.
 *
 * Responsibilities
 * ----------------
 * - Configure disk storage.
 * - Create upload directory.
 * - Generate unique filenames.
 * - Validate uploaded files.
 * - Configure multipart limits.
 *
 * ============================================================================
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import multer from "multer";

import {
    ALLOWED_MIME_TYPES,
    MULTER_LIMITS,
    UPLOAD_DIRECTORY,
} from "../constants/upload.constants.js";

import type {
    FileFilterCallback,
    StorageEngine,
} from "multer";
import type {
    Request,
} from "express";

/**
 * ============================================================================
 * Ensure Upload Directory Exists
 * ============================================================================
 */
if (!fs.existsSync(UPLOAD_DIRECTORY)) {
    fs.mkdirSync(
        UPLOAD_DIRECTORY,
        {
            recursive: true,
        }
    );
}

/**
 * ============================================================================
 * Disk Storage
 * ============================================================================
 */
const storage: StorageEngine = multer.diskStorage({
    /**
     * Upload destination.
     */
    destination(
        req: Request,
        file: Express.Multer.File,
        callback,
    ): void {
        callback(
            null,
            UPLOAD_DIRECTORY,
        );
    },

    /**
     * Generate a unique filename.
     */
    filename(
        req: Request,
        file: Express.Multer.File,
        callback,
    ): void {
        const extension = path.extname(
            file.originalname,
        );

        const uniqueFilename =
            `${crypto.randomUUID()}${extension}`;

        callback(
            null,
            uniqueFilename,
        );
    },
});

/**
 * ============================================================================
 * File Filter
 * ============================================================================
 */
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
): void => {
    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    const isPdfExtension =
        extension === ".pdf";

    const isPdfMime =
        ALLOWED_MIME_TYPES.has(
            file.mimetype,
        );

    if (
        isPdfExtension &&
        isPdfMime
    ) {
        callback(
            null,
            true,
        );

        return;
    }

    callback(
        new Error(
            "Rental agreement must be uploaded as a PDF document.",
        ),
    );
};

/**
 * ============================================================================
 * Multer Instance
 * ============================================================================
 */
const upload = multer({
    storage,

    fileFilter,

    limits: MULTER_LIMITS,
});

export default upload;