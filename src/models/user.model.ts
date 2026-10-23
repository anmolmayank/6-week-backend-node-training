/**
 * ============================================================================
 * File: user.model.ts
 * Layer: Model
 * ============================================================================
 * Defines user identity, authentication, role, and optional tenant association.
 * Password hashes are excluded from normal queries.
 * ============================================================================
 */

import {
    model,
    Schema,
    Types,
    type HydratedDocument,
} from "mongoose";

export const USER_ROLES = ["owner", "tenant"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    tenantId: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: USER_ROLES,
            required: true,
            // Public registration must never grant owner privileges.
            default: "tenant",
            index: true,
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant",
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// A tenant record can be linked to at most one login account. Null/unlinked
// accounts are excluded from this unique index.
userSchema.index(
    { tenantId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            tenantId: { $type: "objectId" },
        },
    },
);

const UserModel = model<User>("User", userSchema);
export default UserModel;
