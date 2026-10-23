/** Enforces owner-only access. Resource ownership checks belong in services. */
import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";

const authorizeOwner = (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
        next(new ApiError(httpStatus.UNAUTHORIZED, "Authentication is required."));
        return;
    }

    if (req.user.role !== "owner") {
        next(new ApiError(httpStatus.FORBIDDEN, "Owner access is required."));
        return;
    }

    next();
};

export default authorizeOwner;
