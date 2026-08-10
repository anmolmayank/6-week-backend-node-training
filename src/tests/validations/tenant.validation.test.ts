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
 * Validation Rules Covered
 * ------------------------
 *
 * Create Tenant
 * - Valid tenant payload.
 * - Required tenant name.
 * - Non-negative rent.
 *
 * Update Tenant
 * - Valid partial update.
 * - Valid complete update.
 * - Invalid tenant ID.
 * - Invalid tenant name.
 * - Invalid apartment number.
 * - Invalid monthly rent.
 * - Empty update payload.
 * - Rental agreement cannot be updated through the normal Tenant endpoint.
 *
 * ============================================================================
 */

import {
    describe,
    expect,
    it,
} from "vitest";

import {
    createTenantSchema,
    updateTenantSchema,
} from "../../validations/tenant.validation.js";

/**
 * ============================================================================
 * Tenant Validation
 * ============================================================================
 */

describe(
    "Tenant Validation",
    () => {
        /**
         * ====================================================================
         * createTenantSchema
         * ====================================================================
         */

        describe(
            "createTenantSchema",
            () => {
                /**
                 * ------------------------------------------------------------
                 * Valid Tenant
                 * ------------------------------------------------------------
                 */

                it(
                    "should accept valid tenant",
                    () => {
                        const payload = {
                            body: {
                                tenantName:
                                    "Rahul Sharma",
                                apartmentNumber:
                                    "A-101",
                                monthlyRent:
                                    25000,
                            },
                        };

                        expect(
                            () => {
                                createTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).not.toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Empty Tenant Name
                 * ------------------------------------------------------------
                 */

                it(
                    "should reject empty tenant name",
                    () => {
                        const payload = {
                            body: {
                                tenantName:
                                    "",
                                apartmentNumber:
                                    "A-101",
                                monthlyRent:
                                    25000,
                            },
                        };

                        expect(
                            () => {
                                createTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Negative Rent
                 * ------------------------------------------------------------
                 */

                it(
                    "should reject negative rent",
                    () => {
                        const payload = {
                            body: {
                                tenantName:
                                    "Rahul Sharma",
                                apartmentNumber:
                                    "A-101",
                                monthlyRent:
                                    -100,
                            },
                        };

                        expect(
                            () => {
                                createTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );
            },
        );

        /**
         * ====================================================================
         * updateTenantSchema
         * ====================================================================
         */

        describe(
            "updateTenantSchema",
            () => {
                /**
                 * ------------------------------------------------------------
                 * Valid Partial Update
                 * ------------------------------------------------------------
                 *
                 * PATCH allows only the fields being changed.
                 */

                it(
                    "should accept a valid partial update",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "507f1f77bcf86cd799439011",
                            },
                            body: {
                                monthlyRent:
                                    28000,
                            },
                        };

                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).not.toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Valid Complete Update
                 * ------------------------------------------------------------
                 */

                it(
                    "should accept all editable tenant fields",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "507f1f77bcf86cd799439011",
                            },
                            body: {
                                tenantName:
                                    "Rahul Sharma",
                                apartmentNumber:
                                    "A-102",
                                monthlyRent:
                                    30000,
                            },
                        };

                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).not.toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Invalid Tenant ID
                 * ------------------------------------------------------------
                 */

                it(
                    "should reject an invalid tenant ID",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "invalid-id",
                            },
                            body: {
                                monthlyRent:
                                    28000,
                            },
                        };

                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Negative Rent
                 * ------------------------------------------------------------
                 */

                it(
                    "should reject negative monthly rent",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "507f1f77bcf86cd799439011",
                            },
                            body: {
                                monthlyRent:
                                    -100,
                            },
                        };

                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Empty Tenant Name
                 * ------------------------------------------------------------
                 */

                it(
                    "should reject an empty tenant name",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "507f1f77bcf86cd799439011",
                            },
                            body: {
                                tenantName:
                                    "",
                            },
                        };

                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Tenant Name Too Long
                 * ------------------------------------------------------------
                 */

                it(
                    "should reject a tenant name longer than 100 characters",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "507f1f77bcf86cd799439011",
                            },
                            body: {
                                tenantName:
                                    "A".repeat(
                                        101,
                                    ),
                            },
                        };

                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Apartment Number Too Long
                 * ------------------------------------------------------------
                 */

                it(
                    "should reject an apartment number longer than 20 characters",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "507f1f77bcf86cd799439011",
                            },
                            body: {
                                apartmentNumber:
                                    "A".repeat(
                                        21,
                                    ),
                            },
                        };

                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Empty PATCH Body
                 * ------------------------------------------------------------
                 *
                 * An empty object should not be considered a valid update.
                 */

                it(
                    "should reject an empty update body",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "507f1f77bcf86cd799439011",
                            },
                            body: {},
                        };

                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );

                /**
                 * ------------------------------------------------------------
                 * Rental Agreement
                 * ------------------------------------------------------------
                 *
                 * Rental agreement management has its own endpoints.
                 *
                 * Therefore it must not be part of the normal Tenant
                 * update contract.
                 */

                it(
                    "should not allow rental agreement updates",
                    () => {
                        const payload = {
                            params: {
                                tenantId:
                                    "507f1f77bcf86cd799439011",
                            },
                            body: {
                                rentalAgreement: {
                                    originalName:
                                        "agreement.pdf",
                                },
                            },
                        };

                        /**
                         * Because Zod objects strip unknown fields by
                         * default, the rentalAgreement field is removed.
                         *
                         * That leaves an empty update body, which then fails
                         * the `.refine()` rule.
                         */
                        expect(
                            () => {
                                updateTenantSchema.parse(
                                    payload,
                                );
                            },
                        ).toThrow();
                    },
                );
            },
        );
    },
);