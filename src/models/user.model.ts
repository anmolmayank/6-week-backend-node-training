/**
 * ============================================================================
 * File: user.model.ts
 * Layer: Model
 * ============================================================================
 *
 * Purpose
 * -------
 * Defines the User collection schema.
 *
 * Responsibilities
 * ----------------
 * - Store registered users.
 * - Enforce schema validation.
 * - Define MongoDB indexes.
 * - Configure Mongoose document options.
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
 * User
 * ============================================================================
 *
 * Represents a registered user.
 */
export interface User {
    /**
     * Full name.
     */
    name: string;

    /**
     * Email address.
     */
    email: string;

    /**
     * Password hash.
     */
    password: string;

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
 * Represents a hydrated User document.
 */
export type UserDocument =
    HydratedDocument<User>;

/**
 * ============================================================================
 * User Schema
 * ============================================================================
 */
const userSchema = new Schema<User>(
    {
        /**
         * Full name.
         */
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        /**
         * User email.
         */
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },

        /**
         * Password hash.
         *
         * Never store plain-text passwords.
         */
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
    },
    {
        /**
         * Automatically creates:
         * - createdAt
         * - updatedAt
         */
        timestamps: true,

        /**
         * Removes "__v".
         */
        versionKey: false,
    },
);

/**
 * ============================================================================
 * User Model
 * ============================================================================
 */
const UserModel = model<User>(
    "User",
    userSchema,
);

export default UserModel;