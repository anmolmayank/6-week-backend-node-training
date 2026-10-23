/** Restricts an endpoint to linked tenant accounts. */
import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";

const authorizeTenant = (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
        next(new ApiError(httpStatus.UNAUTHORIZED, "Authentication is required."));
        return;
    }

    if (req.user.role !== "tenant") {
        next(new ApiError(httpStatus.FORBIDDEN, "Tenant access is required."));
        return;
    }

    if (!req.user.tenantId) {
        next(new ApiError(httpStatus.FORBIDDEN, "This account is not linked to a tenant record yet."));
        return;
    }

    next();
};

export default authorizeTenant;
