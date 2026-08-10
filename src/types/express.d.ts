import "express";

interface AuthenticatedUser {
    _id: {
        toString(): string;
    };
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