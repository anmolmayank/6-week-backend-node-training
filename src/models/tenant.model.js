/**
 * ============================================================================
 * Tenant Model
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the MongoDB schema for Tenant documents.
 *
 * Responsibilities
 * ----------------
 * - Defines Tenant structure.
 * - Defines Rental Agreement metadata.
 * - Applies database-level validations.
 * - Enables automatic timestamps.
 *
 * Notes
 * -----
 * - Only metadata of uploaded PDFs is stored in MongoDB.
 * - Actual PDF files are stored on the local file system.
 *
 * ============================================================================
 */

import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * ============================================================================
 * Rental Agreement Schema
 * ============================================================================
 *
 * Represents metadata of the uploaded rental agreement.
 *
 * The PDF itself is stored inside:
 *
 * uploads/agreements
 *
 * MongoDB stores only metadata.
 *
 * ============================================================================
 */
const RentalAgreementSchema = new Schema(
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
const TenantSchema = new Schema(
  {
    tenantName: {
      type: String,

      required: true,

      // Removes accidental leading/trailing spaces.
      trim: true,

      maxlength: 100,
    },

    apartmentNumber: {
      type: String,

      required: true,

      trim: true,

      // One apartment can have only one active tenant.
      unique: true,

      maxlength: 20,
    },

    /**
     * Monthly rent amount.
     */
    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Rental agreement metadata.
     *
     * Stores only file metadata.
     * The actual PDF is stored on the filesystem.
     */
    /**
     * Rental agreement metadata.
     *
     * Null until an agreement is uploaded.
     */
    rentalAgreement: {
      type: RentalAgreementSchema,
      default: null,
    },
  },
  {
    // Automatically manages createdAt & updatedAt.
    timestamps: true,
  },
);

const TenantModel = model("Tenant", TenantSchema);

export default TenantModel;

/**
 * ============================================================================
 * Learning Notes
 * ============================================================================
 *
 * 1. Why embedded schema?
 *    One tenant owns exactly one rental agreement.
 *
 * 2. Why _id:false?
 *    Embedded documents don't require separate identities.
 *
 * 3. Why timestamps?
 *    Mongoose automatically maintains createdAt & updatedAt.
 *
 * ============================================================================
 */
