import bcrypt from "bcrypt";
import { Types } from "mongoose";
import * as tenantRepository from "../repositories/tenant.repository.js";
import type { User, UserRole } from "../models/user.model.js";

import { authConfig } from "../constants/auth.js";
import { httpStatus } from "../constants/httpStatus.js";

import * as userRepository from "../repositories/user.repository.js";

import ApiError from "../utils/ApiError.js";

/**
 * ------------------------------------------------------------------
 * Get all users
 * ------------------------------------------------------------------
 */
export const getUsers = async () => {
    const users = await userRepository.findAll();
    return users.map((user) => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId ? user.tenantId.toString() : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }));
};

/**
 * ------------------------------------------------------------------
 * Get a user by id
 *
 * Business Rule:
 * - User must exist.
 * ------------------------------------------------------------------
 */
export const getUserById = async (
    id: string,
) => {
    const user =
        await userRepository.findById(id);

    if (!user) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            `User with id '${id}' not found.`,
        );
    }

    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId ? user.tenantId.toString() : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

/**
 * ------------------------------------------------------------------
 * Create User
 * ------------------------------------------------------------------
 *
 * Business Rules:
 * - Email must be unique.
 * - Passwords are hashed before persistence.
 * - Passwords are never exposed in API responses.
 * ------------------------------------------------------------------
 */
export const createUser = async (
    userData: {
        name: string;
        email: string;
        password: string;
    },
) => {
    /**
     * Check if the email already exists.
     */
    const existingUser =
        await userRepository.findByEmail(
            userData.email,
        );

    if (existingUser) {
        throw new ApiError(
            httpStatus.CONFLICT,
            "Email already exists.",
        );
    }

    /**
     * Hash the password before storing it.
     */
    const hashedPassword =
        await bcrypt.hash(
            userData.password,
            authConfig.PASSWORD_SALT_ROUNDS,
        );

    const newUser = {
        ...userData,
        password: hashedPassword,
        // Public registration always creates an unlinked tenant account.
        // Role promotion is an owner-only operation.
        role: "tenant" as const,
        tenantId: null,
    };

    /**
     * Save the user.
     */
    const createdUser =
        await userRepository.create(
            newUser,
        );

    /**
     * Remove the password before returning.
     */
    const {
        password: _password,
        ...safeUser
    } = createdUser;

    return {
        ...safeUser,
        _id: String(safeUser._id),
        tenantId: safeUser.tenantId ? String(safeUser.tenantId) : null,
    };
};

/**
 * ------------------------------------------------------------------
 * Update User
 * ------------------------------------------------------------------
 *
 * Business Rules:
 * - User must exist.
 * - Password cannot be updated using this endpoint.
 *
 * Password updates should only happen through a dedicated
 * Change Password API where:
 *
 * 1. Current password is verified.
 * 2. New password is validated.
 * 3. New password is hashed.
 *
 * This prevents accidentally storing plain-text passwords.
 * ------------------------------------------------------------------
 */
export const updateUser = async (
    userId: string,
    updateData: {
        name?: string;
        email?: string;
        role?: UserRole;
        tenantId?: string | null;
    },
) => {
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
    }

    const update: Partial<User> = {};
    if (updateData.name !== undefined) update.name = updateData.name;

    if (updateData.email !== undefined && updateData.email !== existingUser.email) {
        const userWithEmail = await userRepository.findByEmail(updateData.email);
        if (userWithEmail && userWithEmail._id.toString() !== userId) {
            throw new ApiError(httpStatus.CONFLICT, "Email already exists.");
        }
        update.email = updateData.email;
    }

    if (updateData.role !== undefined) update.role = updateData.role;

    // Promote/demote operations always clear an obsolete tenant association.
    if (updateData.role === "owner") {
        update.tenantId = null;
    } else if (
        updateData.role === "tenant" &&
        existingUser.role === "owner" &&
        updateData.tenantId === undefined
    ) {
        // Demoting an owner creates an unlinked tenant account. The owner can
        // explicitly link it to a tenant record in a subsequent update.
        update.tenantId = null;
    } else if (updateData.tenantId !== undefined) {
        if (updateData.tenantId === null) {
            update.tenantId = null;
        } else {
            if ((updateData.role ?? existingUser.role) !== "tenant") {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    "Only tenant accounts can be linked to a tenant record.",
                );
            }

            const tenant = await tenantRepository.findTenantById(updateData.tenantId);
            if (!tenant) {
                throw new ApiError(httpStatus.NOT_FOUND, "Tenant record not found.");
            }

            const linkedUser = await userRepository.findByTenantId(updateData.tenantId);
            if (linkedUser && linkedUser._id.toString() !== userId) {
                throw new ApiError(
                    httpStatus.CONFLICT,
                    "This tenant record is already linked to another user account.",
                );
            }

            update.tenantId = new Types.ObjectId(updateData.tenantId);
        }
    }

    const updatedUser = await userRepository.updateById(
        userId,
        update,
    );

    if (!updatedUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
    }

    const {
        password: _password,
        _id,
        tenantId,
        ...safeUser
    } = updatedUser;
    return {
        ...safeUser,
        _id: _id.toString(),
        tenantId: tenantId ? tenantId.toString() : null,
    };
};

/**
 * ------------------------------------------------------------------
 * Delete User
 * ------------------------------------------------------------------
 *
 * Business Rules:
 * - User must exist.
 * ------------------------------------------------------------------
 */
export const deleteUser = async (
    userId: string,
) => {
    const deletedUser =
        await userRepository.deleteById(
            userId,
        );

    if (!deletedUser) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "User not found.",
        );
    }

    return {
        _id: deletedUser._id.toString(),
        name: deletedUser.name,
        email: deletedUser.email,
        role: deletedUser.role,
        tenantId: deletedUser.tenantId ? deletedUser.tenantId.toString() : null,
        createdAt: deletedUser.createdAt,
        updatedAt: deletedUser.updatedAt,
    };
};