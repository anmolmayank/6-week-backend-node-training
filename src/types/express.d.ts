import "express";
import type { UserRole } from "../models/user.model.js";

interface AuthenticatedUser {
    _id: {
        toString(): string;
    };
    name: string;
    email: string;
    role: UserRole;
    tenantId: {
        toString(): string;
    } | string | null;
}

declare global {
    namespace Express {
        interface Request {
            validated: {
                body?: unknown;
                params?: unknown;
                query?: unknown;
            };
            user?: AuthenticatedUser;
        }
    }
}

export {};
