import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/jwt.js";
import { httpStatus } from "../constants/httpStatus.js";
import * as userRepository from "../repositories/user.repository.js";

/** Authenticate by email/password and return a UI-safe identity plus JWT. */
export const login = async (loginData: {
    email: string;
    password: string;
}) => {
    const user = await userRepository.findByEmailWithPassword(loginData.email);

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
    }

    // Do not rely on request-supplied role/tenant data. Both values come from
    // the persisted user record and are returned for frontend route selection.
    const safeUser = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId ? user.tenantId.toString() : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    return {
        user: safeUser,
        accessToken: generateAccessToken(safeUser._id),
    };
};
