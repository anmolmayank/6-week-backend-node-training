/**
 * ============================================================================
 * File: upload.constant.ts
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

import type { Options } from "multer";

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

/**
 * Maximum upload size (10 MB).
 */
export const MAX_FILE_SIZE =
    10 * ONE_MB;

/**
 * ============================================================================
 * Allowed MIME Types
 * ============================================================================
 */
export const ALLOWED_MIME_TYPES: ReadonlySet<string> =
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
export const MULTER_LIMITS: Options["limits"] = {
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
     * agreement + optional field.
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
} as const;