import bcrypt from "bcrypt";

import { authConfig } from "../constants/auth.js";
import { httpStatus } from "../constants/httpStatus.js";

import * as userRepository from "../repositories/user.repository.js";

import ApiError from "../utils/ApiError.js";

/**
 * ------------------------------------------------------------------
 * Get all users
 * ------------------------------------------------------------------
 */
export const getUsers = () => {
    return userRepository.findAll();
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

    return user;
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
        password,
        ...safeUser
    } = createdUser;

    return safeUser;
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
    updateData: Record<string, unknown>,
) => {
    /**
     * Password updates are not allowed here.
     */
    if ("password" in updateData) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Password cannot be updated using this endpoint.",
        );
    }

    /**
     * Update user.
     */
    const updatedUser =
        await userRepository.updateById(
            userId,
            updateData,
        );

    /**
     * Ensure the user exists.
     */
    if (!updatedUser) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "User not found.",
        );
    }

    return updatedUser;
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

    return deletedUser;
};