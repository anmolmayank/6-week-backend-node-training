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
 * - Create upload directory if it does not exist.
 * - Generate unique filenames.
 * - Restrict allowed file types.
 * - Limit maximum upload size.
 *
 * Notes
 * -----
 * This file only configures Multer.
 * It does not contain any business logic.
 *
 * ============================================================================
 */

import fs from "node:fs";
import multer from "multer";
import path from "node:path";

/**
 * ============================================================================
 * Upload Configuration
 * ============================================================================
 */

/**
 * Directory where rental agreements will be stored.
 */
const UPLOAD_DIRECTORY = "uploads/rental-agreements";

/**
 * Maximum allowed upload size (10 MB).
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed MIME types.
 */
const ALLOWED_MIME_TYPES = new Set(["application/pdf"]);

/**
 * ============================================================================
 * Ensure Upload Directory Exists
 * ============================================================================
 *
 * Creates the upload directory recursively if it doesn't already exist.
 * This prevents Multer from failing when saving uploaded files.
 */
if (!fs.existsSync(UPLOAD_DIRECTORY)) {
    fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
}

/**
 * ============================================================================
 * Disk Storage Configuration
 * ============================================================================
 *
 * Files are stored on the local filesystem.
 */
const storage = multer.diskStorage({
    /**
     * Upload destination.
     */
    destination(req, file, callback) {
        callback(null, UPLOAD_DIRECTORY);
    },

    /**
     * Generate a unique filename while preserving
     * the original file extension.
     *
     * Example:
     * agreement.pdf
     *
     * becomes
     *
     * 1753708712345.pdf
     */
    filename(req, file, callback) {
        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = `${Date.now()}${fileExtension}`;

        callback(null, uniqueFileName);
    },
});

/**
 * ============================================================================
 * File Filter
 * ============================================================================
 *
 * Allows only PDF documents.
 */
const fileFilter = (req, file, callback) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        return callback(null, true);
    }

    callback(new Error("Only PDF files are allowed."));
};

/**
 * ============================================================================
 * Multer Instance
 * ============================================================================
 */
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
    },
});

export default upload;

/**
 * ============================================================================
 * Learning Notes
 * ============================================================================
 *
 * 1. Multer parses multipart/form-data requests.
 *
 * 2. Disk storage writes uploaded files to the local filesystem.
 *
 * 3. Unique filenames prevent accidental overwriting.
 *
 * 4. path.extname() preserves the original file extension.
 *
 * 5. File filtering provides an initial validation layer by checking the
 *    uploaded file's MIME type.
 *
 * 6. Upload size limits help protect the server from excessively
 *    large uploads.
 *
 * 7. The upload directory is automatically created during application
 *    startup if it doesn't already exist.
 *
 * ============================================================================
 */