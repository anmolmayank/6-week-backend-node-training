/**
 * ============================================================================
 * File: multer.js
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
import multer from "multer";
import path from "node:path";

import {
    ALLOWED_MIME_TYPES,
    MULTER_LIMITS,
    UPLOAD_DIRECTORY,
} from "../constants/upload.constants.js";

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
const storage = multer.diskStorage({
    /**
     * Destination folder.
     */
    destination(req, file, callback) {
        callback(
            null,
            UPLOAD_DIRECTORY
        );
    },

    /**
     * Generate a unique filename.
     */
    filename(req, file, callback) {
        const extension =
            path.extname(file.originalname);

        const uniqueFilename =
            `${crypto.randomUUID()}${extension}`;

        callback(
            null,
            uniqueFilename
        );
    },
});

/**
 * ============================================================================
 * File Filter
 * ============================================================================
 *
 * Security
 * --------
 * Validates both the MIME type and file extension.
 *
 * NOTE
 * ----
 * MIME type can be spoofed by the client.
 * For production systems, file signature ("magic bytes")
 * validation is also recommended.
 */
const fileFilter = (
    req,
    file,
    callback
) => {
    const extension =
        path
            .extname(file.originalname)
            .toLowerCase();

    const isPdfExtension =
        extension === ".pdf";

    const isPdfMime =
        ALLOWED_MIME_TYPES.has(
            file.mimetype
        );

    if (
        isPdfExtension &&
        isPdfMime
    ) {
        return callback(
            null,
            true
        );
    }

    callback(
        new Error(
            "Rental agreement must be uploaded as a PDF document."
        )
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

/**
 * ============================================================================
 * Learning Notes
 * ============================================================================
 *
 * 1. Multer parses multipart/form-data requests.
 *
 * 2. Uploaded PDFs are stored on the local filesystem.
 *
 * 3. UUID filenames eliminate filename collisions.
 *
 * 4. Upload limits reduce the attack surface against
 *    malicious multipart requests.
 *
 * 5. File validation checks both MIME type and file extension.
 *
 * 6. In production, validating file signatures ("magic bytes")
 *    provides stronger protection against spoofed uploads.
 *
 * ============================================================================
 */