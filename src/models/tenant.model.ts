/**
 * ============================================================================
 * File: tenant.model.ts
 * Layer: Model
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the MongoDB schema for Tenant documents.
 *
 * Responsibilities
 * ----------------
 * - Define the Tenant document structure.
 * - Define Rental Agreement metadata.
 * - Apply schema validation rules.
 * - Enable automatic timestamps.
 *
 * Notes
 * -----
 * Only metadata of uploaded rental agreements is stored in MongoDB.
 * Actual PDF files are stored on the local filesystem.
 *
 * ============================================================================
 */

import {
    model,
    Schema,
    type HydratedDocument,
} from "mongoose";

/**
 * ============================================================================
 * Rental Agreement
 * ============================================================================
 */
export interface RentalAgreement {
    /**
     * Original uploaded filename.
     */
    originalName: string;

    /**
     * Generated filename stored on disk.
     */
    storedName: string;

    /**
     * MIME type.
     */
    mimeType: string;

    /**
     * File size in bytes.
     */
    size: number;

    /**
     * Storage path.
     */
    path: string;

    /**
     * Upload timestamp.
     */
    uploadedAt: Date;
}

/**
 * ============================================================================
 * Tenant
 * ============================================================================
 */
export interface Tenant {
    /**
     * Tenant full name.
     */
    tenantName: string;

    /**
     * Apartment number.
     */
    apartmentNumber: string;

    /**
     * Monthly rent.
     */
    monthlyRent: number;

    /**
     * Rental agreement metadata.
     *
     * Null until an agreement is uploaded.
     */
    rentalAgreement: RentalAgreement | null;

    /**
     * Creation timestamp.
     */
    createdAt: Date;

    /**
     * Last update timestamp.
     */
    updatedAt: Date;
}

/**
 * Represents a hydrated Tenant document.
 */
export type TenantDocument =
    HydratedDocument<Tenant>;

/**
 * ============================================================================
 * Rental Agreement Schema
 * ============================================================================
 */
const rentalAgreementSchema =
    new Schema<RentalAgreement>(
        {
            originalName: {
                type: String,
                required: true,
                trim: true,
                maxlength: 255,
            },

            storedName: {
                type: String,
                required: true,
                trim: true,
                maxlength: 255,
            },

            mimeType: {
                type: String,
                required: true,
                trim: true,
                maxlength: 100,
            },

            size: {
                type: Number,
                required: true,
                min: 0,
            },

            path: {
                type: String,
                required: true,
                trim: true,
            },

            uploadedAt: {
                type: Date,
                default: Date.now,
            },
        },
        {
            _id: false,
        },
    );

/**
 * ============================================================================
 * Tenant Schema
 * ============================================================================
 */
const tenantSchema =
    new Schema<Tenant>(
        {
            tenantName: {
                type: String,
                required: true,
                trim: true,
                maxlength: 100,
            },

            apartmentNumber: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                maxlength: 20,
            },

            monthlyRent: {
                type: Number,
                required: true,
                min: 0,
            },

            rentalAgreement: {
                type: rentalAgreementSchema,
                default: null,
            },
        },
        {
            timestamps: true,
            versionKey: false,
        },
    );

/**
 * ============================================================================
 * Tenant Model
 * ============================================================================
 */
const TenantModel = model<Tenant>(
    "Tenant",
    tenantSchema,
);

export default TenantModel;

/**
 * ============================================================================
 * Learning Notes
 * ============================================================================
 *
 * 1. Embedded schemas are ideal for one-to-one relationships where the child
 *    document has no lifecycle independent of the parent.
 *
 * 2. The Rental Agreement is embedded because every agreement belongs to
 *    exactly one tenant.
 *
 * 3. Setting _id: false prevents Mongoose from generating an unnecessary
 *    ObjectId for the embedded document.
 *
 * 4. HydratedDocument<Tenant> represents a full Mongoose document with helper
 *    methods such as save(), populate(), validate(), etc.
 *
 * 5. The exported Tenant interface represents the business object, while
 *    TenantDocument represents the Mongoose document instance.
 *
 * ============================================================================
 */