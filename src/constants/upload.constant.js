/**
 * ============================================================================
 * File: upload.constants.js
 * Layer: Constants
 * ============================================================================
 *
 * Purpose
 * -------
 * Centralizes all upload-related configuration.
 *
 * Responsibilities
 * ----------------
 * - Upload directory
 * - Maximum upload size
 * - Allowed MIME types
 * - Multer multipart limits
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * Upload Directory
 * ============================================================================
 *
 * Directory where rental agreement PDFs are stored.
 */
export const UPLOAD_DIRECTORY =
    "uploads/rental-agreements";

/**
 * ============================================================================
 * Maximum Upload Size
 * ============================================================================
 *
 * Business Requirement
 * --------------------
 * Rental agreements are expected to be PDF documents
 * smaller than 5 MB.
 *
 * Security
 * --------
 * Restricts excessively large uploads that could
 * consume server memory or storage.
 */
/**
 * ============================================================================
 * File Size Constants
 * ============================================================================
 */

export const ONE_KB = 1024;

export const ONE_MB = 1024 * ONE_KB;

/**
 * ============================================================================
 * Upload Limits
 * ============================================================================
 */

export const MAX_FILE_SIZE = 10 * ONE_MB;
/**
 * ============================================================================
 * Allowed MIME Types
 * ============================================================================
 */
export const ALLOWED_MIME_TYPES =
    new Set([
        "application/pdf",
    ]);

/**
 * ============================================================================
 * Multer Limits
 * ============================================================================
 *
 * Security
 * --------
 * These limits reduce the attack surface of multipart
 * requests and help mitigate denial-of-service attacks.
 */
export const MULTER_LIMITS = {
    /**
     * Maximum uploaded file size.
     */
    fileSize: MAX_FILE_SIZE,

    /**
     * Only one uploaded file.
     */
    files: 1,

    /**
     * Only one text field.
     */
    fields: 1,

    /**
     * agreement + optional field
     */
    parts: 2,

    /**
     * Maximum multipart field name length.
     */
    fieldNameSize: 100,

    /**
     * Maximum text field size.
     */
    fieldSize: 1024,
};