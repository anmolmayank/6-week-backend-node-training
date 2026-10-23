/**
 * ============================================================================
 * File: user.repository.ts
 * Layer: Repository
 * ============================================================================
 *
 * Purpose
 * -------
 * Encapsulates all User database operations.
 *
 * Controllers and services should never communicate directly
 * with Mongoose.
 *
 * ============================================================================
 */

import UserModel from "../models/user.model.js";

import type { User } from "../models/user.model.js";

/**
 * ------------------------------------------------------------------
 * Fetch all users
 *
 * .lean() returns plain JavaScript objects instead of Mongoose
 * documents, improving read performance.
 * ------------------------------------------------------------------
 */
export const findAll = () => {
    return UserModel.find().lean();
};

/**
 * ------------------------------------------------------------------
 * Find user by MongoDB ObjectId
 * ------------------------------------------------------------------
 */
export const findById = (
    id: string,
) => {
    return UserModel.findById(id).lean();
};

/**
 * ------------------------------------------------------------------
 * Find User By Email
 * ------------------------------------------------------------------
 *
 * Used for checking whether an email already exists
 * during user registration.
 *
 * Password is excluded because of `select: false`.
 * ------------------------------------------------------------------
 */
export const findByEmail = (
    email: string,
) => {
    return UserModel.findOne({
        email,
    }).lean();
};

/**
 * ------------------------------------------------------------------
 * Create User
 * ------------------------------------------------------------------
 *
 * Creates a new user in the database.
 *
 * Note:
 * - Model.create() returns a Mongoose Document.
 * - We convert it to a plain JavaScript object so that
 *   every repository method returns the same type.
 *
 * This keeps the repository API consistent and avoids
 * leaking Mongoose-specific objects into the service layer.
 * ------------------------------------------------------------------
 */
export const create = async (
    userData: Omit<
    User,
    "createdAt" | "updatedAt"
>
) => {
    const createdUser =
        await UserModel.create(
            userData,
        );

    return createdUser.toObject();
};

/**
 * ------------------------------------------------------------------
 * Update User
 * ------------------------------------------------------------------
 *
 * Updates the supplied fields and returns the updated document.
 * ------------------------------------------------------------------
 */
export const updateById = (
    userId: string,
    updateData: Partial<User>,
) => {
    return UserModel.findByIdAndUpdate(
        userId,
        updateData,
        {
            new: true,
            runValidators: true,
        },
    ).lean();
};

/**
 * ------------------------------------------------------------------
 * Delete User
 * ------------------------------------------------------------------
 *
 * Deletes a user and returns the deleted document.
 * ------------------------------------------------------------------
 */
export const deleteById = (
    userId: string,
) => {
    return UserModel.findByIdAndDelete(
        userId,
    ).lean();
};

/**
 * ------------------------------------------------------------------
 * Find User By Email With Password
 * ------------------------------------------------------------------
 *
 * Used ONLY during authentication.
 *
 * The password field is excluded by default
 * (`select: false` in the schema), so we
 * explicitly include it here.
 * ------------------------------------------------------------------
 */
export const findByEmailWithPassword = (
    email: string,
) => {
    return UserModel.findOne({
        email,
    })
        .select("+password")
        .lean();
};

/** Find the login account currently linked to a tenant record. */
export const findByTenantId = (tenantId: string) => {
    return UserModel.findOne({ tenantId }).lean();
};

/** Clear the account's tenant link when a tenant record is deleted. */
export const clearTenantAssociation = (tenantId: string) => {
    return UserModel.updateMany(
        { tenantId },
        { $set: { tenantId: null } },
        { runValidators: true },
    );
};
