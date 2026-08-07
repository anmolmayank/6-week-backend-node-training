/**
 * ============================================================================
 * File: tenant.validation.test.ts
 * Layer: Unit Test
 * ============================================================================
 *
 * Purpose
 * -------
 * Unit tests for Tenant Validation Schemas.
 *
 * ============================================================================
 */

import { describe, expect, it } from "vitest";

import {
    createTenantSchema,
} from "../../validations/tenant.validation.js";

describe("Tenant Validation", () => {
    describe("createTenantSchema", () => {
        it("should accept valid tenant", () => {
            const payload = {
                body: {
                    tenantName: "Rahul Sharma",
                    apartmentNumber: "A-101",
                    monthlyRent: 25000,
                },
            };

            expect(() => {
                createTenantSchema.parse(payload);
            }).not.toThrow();
        });

        it("should reject empty tenant name", () => {
            const payload = {
                body: {
                    tenantName: "",
                    apartmentNumber: "A-101",
                    monthlyRent: 25000,
                },
            };

            expect(() => {
                createTenantSchema.parse(payload);
            }).toThrow();
        });

        it("should reject negative rent", () => {
            const payload = {
                body: {
                    tenantName: "Rahul Sharma",
                    apartmentNumber: "A-101",
                    monthlyRent: -100,
                },
            };

            expect(() => {
                createTenantSchema.parse(payload);
            }).toThrow();
        });
    });
});