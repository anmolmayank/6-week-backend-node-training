/**
 * ============================================================================
 * File: user.validation.test.ts
 * Layer: Unit Test
 * ============================================================================
 *
 * Purpose
 * -------
 * Unit tests for User Validation Schemas.
 *
 * ============================================================================
 */

import { describe, expect, it } from "vitest";

import {
    createUserSchema,
} from "../../validations/user.validation.js";

describe("User Validation", () => {
    describe("createUserSchema", () => {
        it("should accept valid user", () => {
            const payload = {
                body: {
                    name: "John Doe",
                    email: "john@example.com",
                    password: "Password@123",
                },
            };

            expect(() => {
                createUserSchema.parse(payload);
            }).not.toThrow();
        });

        it("should reject invalid email", () => {
            const payload = {
                body: {
                    name: "John Doe",
                    email: "abc",
                    password: "Password@123",
                },
            };

            expect(() => {
                createUserSchema.parse(payload);
            }).toThrow();
        });

        it("should reject short password", () => {
            const payload = {
                body: {
                    name: "John Doe",
                    email: "john@example.com",
                    password: "123",
                },
            };

            expect(() => {
                createUserSchema.parse(payload);
            }).toThrow();
        });

        it("should not accept client-selected owner roles during public registration", () => {
            const payload = {
                body: {
                    name: "New Tenant",
                    email: "new-tenant@example.com",
                    password: "Password@123",
                    role: "owner",
                    tenantId: "689d58b7d6ef8d8c0b7d1234",
                },
            };

            const parsed = createUserSchema.parse(payload);
            expect(parsed.body).not.toHaveProperty("role");
            expect(parsed.body).not.toHaveProperty("tenantId");
        });

        it("should reject missing name", () => {
            const payload = {
                body: {
                    email: "john@example.com",
                    password: "Password@123",
                },
            };

            expect(() => {
                createUserSchema.parse(payload);
            }).toThrow();
        });
    });
});