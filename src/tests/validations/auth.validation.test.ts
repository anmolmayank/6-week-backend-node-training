/**
 * ============================================================================
 * File: auth.validation.test.ts
 * Layer: Unit Test
 * ============================================================================
 *
 * Purpose
 * -------
 * Unit tests for Authentication Validation Schemas.
 *
 * Business Rules
 * --------------
 * - Email must be valid.
 * - Password is required.
 *
 * ============================================================================
 */

import { describe, expect, it } from "vitest";

import { loginSchema } from "../../validations/auth.validation.js";

describe("Authentication Validation", () => {
    describe("loginSchema", () => {
        /**
         * --------------------------------------------------------------
         * Should accept a valid login request.
         * --------------------------------------------------------------
         */
        it("should accept valid login payload", () => {
            const payload = {
                body: {
                    email: "john@example.com",
                    password: "Password@123",
                },
            };

            expect(() => {
                loginSchema.parse(payload);
            }).not.toThrow();
        });

        /**
         * --------------------------------------------------------------
         * Invalid email.
         * --------------------------------------------------------------
         */
        it("should reject invalid email", () => {
            const payload = {
                body: {
                    email: "invalid-email",
                    password: "Password@123",
                },
            };

            expect(() => {
                loginSchema.parse(payload);
            }).toThrow();
        });

        /**
         * --------------------------------------------------------------
         * Missing password.
         * --------------------------------------------------------------
         */
        it("should reject missing password", () => {
            const payload = {
                body: {
                    email: "john@example.com",
                },
            };

            expect(() => {
                loginSchema.parse(payload);
            }).toThrow();
        });
    });
});