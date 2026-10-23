import { describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import authorizeOwner from "../../middlewares/authorize.middleware.js";
import authorizeTenant from "../../middlewares/authorize-tenant.middleware.js";

const makeRequest = (user?: Request["user"]): Request => ({ user }) as Request;
const response = {} as Response;

/**
 * Express 5's NextFunction overloads are not directly compatible with Vitest's
 * generic Mock<NextFunction> type. Mock the common error-first callback shape,
 * then cast only at the middleware boundary; this keeps mock.calls strongly
 * typed for assertions below.
 */
const createNextMock = () => vi.fn<(error?: unknown) => void>();
const asNextFunction = (next: ReturnType<typeof createNextMock>): NextFunction =>
    next as unknown as NextFunction;

const errorCode = (error: unknown): number | undefined =>
    typeof error === "object" && error !== null && "statusCode" in error
        ? Number((error as { statusCode: unknown }).statusCode)
        : undefined;

describe("Role authorization middleware", () => {
    it("rejects unauthenticated requests", () => {
        const next = createNextMock();
        authorizeOwner(makeRequest(), response, asNextFunction(next));
        expect(errorCode(next.mock.calls[0]?.[0])).toBe(401);
    });

    it("rejects tenant users from owner-only routes", () => {
        const next = createNextMock();
        authorizeOwner(makeRequest({
            _id: { toString: () => "tenant-user-id" },
            name: "Tenant",
            email: "tenant@example.com",
            role: "tenant",
            tenantId: { toString: () => "tenant-id" },
        }), response, asNextFunction(next));
        expect(errorCode(next.mock.calls[0]?.[0])).toBe(403);
    });

    it("allows owner users on owner-only routes", () => {
        const next = createNextMock();
        authorizeOwner(makeRequest({
            _id: { toString: () => "owner-user-id" },
            name: "Owner",
            email: "owner@example.com",
            role: "owner",
            tenantId: null,
        }), response, asNextFunction(next));
        expect(next).toHaveBeenCalledWith();
    });

    it("rejects tenant accounts that have not been linked to a tenant record", () => {
        const next = createNextMock();
        authorizeTenant(makeRequest({
            _id: { toString: () => "tenant-user-id" },
            name: "Tenant",
            email: "tenant@example.com",
            role: "tenant",
            tenantId: null,
        }), response, asNextFunction(next));
        expect(errorCode(next.mock.calls[0]?.[0])).toBe(403);
    });
});
