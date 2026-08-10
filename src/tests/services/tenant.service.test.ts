/**
 * ============================================================================
 * File: tenant.service.test.ts
 * Layer: Unit Test
 * ============================================================================
 *
 * Purpose
 * -------
 * Unit tests for Tenant Service.
 *
 * Business Rules
 * --------------
 *
 * 1. Tenant must exist before updating.
 * 2. Tenant details can be updated.
 * 3. Rental agreement is managed separately.
 * 4. Previous rental agreement should be deleted before uploading a new one.
 * 5. Download only if agreement exists.
 * 6. Delete both file and metadata.
 *
 * Testing Strategy
 * ----------------
 *
 * - Mock Repository layer.
 * - Mock Node.js File System.
 * - Verify business logic only.
 *
 * ============================================================================
 */

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import fs from "node:fs/promises";

import * as tenantRepository from "../../repositories/tenant.repository.js";
import * as tenantService from "../../services/tenant.service.js";

/**
 * ============================================================================
 * Tenant Service
 * ============================================================================
 */

describe("Tenant Service", () => {
    /**
     * ------------------------------------------------------------------------
     * Reset mocks before every test.
     * ------------------------------------------------------------------------
     */
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    /**
     * ========================================================================
     * updateTenant()
     * ========================================================================
     */

    describe("updateTenant()", () => {
        /**
         * --------------------------------------------------------------------
         * Successful update
         * --------------------------------------------------------------------
         */

        it(
            "should update tenant successfully",
            async () => {
                /**
                 * ------------------------------------------------------------
                 * Arrange
                 * ------------------------------------------------------------
                 */

                const existingTenant = {
                    _id: "tenant-id",
                    tenantName: "Rahul Sharma",
                    apartmentNumber: "A-101",
                    monthlyRent: 25000,
                    rentalAgreement: null,
                } as any;

                const updateData = {
                    tenantName:
                        "Rahul Sharma Updated",
                    monthlyRent: 28000,
                };

                /**
                 * Mock tenant existence check.
                 */
                const findTenantSpy =
                    vi.spyOn(
                        tenantRepository,
                        "findTenantById",
                    ).mockResolvedValue(
                        existingTenant,
                    );

                /**
                 * Mock repository update.
                 */
                const repositorySpy =
                    vi.spyOn(
                        tenantRepository,
                        "updateTenantById",
                    ).mockResolvedValue({
                        ...existingTenant,
                        ...updateData,
                    } as any);

                /**
                 * ------------------------------------------------------------
                 * Act
                 * ------------------------------------------------------------
                 */

                const result =
                    await tenantService.updateTenant(
                        "tenant-id",
                        updateData,
                    );

                /**
                 * ------------------------------------------------------------
                 * Assert
                 * ------------------------------------------------------------
                 */

                /**
                 * Tenant existence should be checked first.
                 */
                expect(
                    findTenantSpy,
                ).toHaveBeenCalledOnce();

                expect(
                    findTenantSpy,
                ).toHaveBeenCalledWith(
                    "tenant-id",
                );

                /**
                 * Repository should receive the exact update payload.
                 */
                expect(
                    repositorySpy,
                ).toHaveBeenCalledOnce();

                expect(
                    repositorySpy,
                ).toHaveBeenCalledWith(
                    "tenant-id",
                    updateData,
                );

                /**
                 * Updated tenant should be returned.
                 */
                expect(result).toEqual({
                    ...existingTenant,
                    ...updateData,
                });
            },
        );

        /**
         * --------------------------------------------------------------------
         * Tenant does not exist
         * --------------------------------------------------------------------
         */

        it(
            "should throw when tenant does not exist",
            async () => {
                /**
                 * Tenant lookup returns null.
                 */
                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue(null);

                /**
                 * Repository update must never be called because the
                 * service should stop when the tenant does not exist.
                 */
                const repositorySpy =
                    vi.spyOn(
                        tenantRepository,
                        "updateTenantById",
                    );

                /**
                 * ------------------------------------------------------------
                 * Act + Assert
                 * ------------------------------------------------------------
                 */

                await expect(
                    tenantService.updateTenant(
                        "tenant-id",
                        {
                            monthlyRent: 30000,
                        },
                    ),
                ).rejects.toThrow(
                    "Tenant not found.",
                );

                /**
                 * Confirm no database update was attempted.
                 */
                expect(
                    repositorySpy,
                ).not.toHaveBeenCalled();
            },
        );

        /**
         * --------------------------------------------------------------------
         * Partial update
         * --------------------------------------------------------------------
         *
         * PATCH allows only the fields being changed to be supplied.
         */

        it(
            "should support partial tenant updates",
            async () => {
                const existingTenant = {
                    _id: "tenant-id",
                    tenantName: "Rahul Sharma",
                    apartmentNumber: "A-101",
                    monthlyRent: 25000,
                    rentalAgreement: null,
                } as any;

                const updateData = {
                    monthlyRent: 30000,
                };

                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue(
                    existingTenant,
                );

                const repositorySpy =
                    vi.spyOn(
                        tenantRepository,
                        "updateTenantById",
                    ).mockResolvedValue({
                        ...existingTenant,
                        ...updateData,
                    } as any);

                const result =
                    await tenantService.updateTenant(
                        "tenant-id",
                        updateData,
                    );

                /**
                 * Only the supplied field should be passed to the repository.
                 */
                expect(
                    repositorySpy,
                ).toHaveBeenCalledWith(
                    "tenant-id",
                    {
                        monthlyRent: 30000,
                    },
                );

                expect(
                    result?.monthlyRent,
                ).toBe(30000);
            },
        );
    });

    /**
     * ========================================================================
     * uploadAgreement()
     * ========================================================================
     */

    describe("uploadAgreement()", () => {
        it(
            "should upload rental agreement successfully",
            async () => {
                /**
                 * ------------------------------------------------------------
                 * Arrange
                 * ------------------------------------------------------------
                 */

                const tenant = {
                    _id: "tenant-id",
                    tenantName: "Rahul Sharma",
                    apartmentNumber: "A-101",
                    monthlyRent: 25000,
                    rentalAgreement: null,
                } as any;

                const uploadedFile = {
                    originalname:
                        "agreement.pdf",
                    filename:
                        "agreement-123.pdf",
                    mimetype:
                        "application/pdf",
                    size: 10240,
                    path:
                        "uploads/agreement-123.pdf",
                } as Express.Multer.File;

                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue(
                    tenant,
                );

                const repositorySpy =
                    vi.spyOn(
                        tenantRepository,
                        "updateRentalAgreement",
                    ).mockResolvedValue({
                        ...tenant,
                        rentalAgreement: {
                            path:
                                uploadedFile.path,
                        },
                    } as any);

                /**
                 * ------------------------------------------------------------
                 * Act
                 * ------------------------------------------------------------
                 */

                const result =
                    await tenantService.uploadAgreement(
                        "tenant-id",
                        uploadedFile,
                    );

                /**
                 * ------------------------------------------------------------
                 * Assert
                 * ------------------------------------------------------------
                 */

                expect(
                    repositorySpy,
                ).toHaveBeenCalledOnce();

                expect(
                    result!.rentalAgreement!.path,
                ).toBe(
                    "uploads/agreement-123.pdf",
                );
            },
        );

        /**
         * --------------------------------------------------------------
         * Tenant does not exist.
         * --------------------------------------------------------------
         */

        it(
            "should throw when tenant does not exist",
            async () => {
                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue(null);

                await expect(
                    tenantService.uploadAgreement(
                        "tenant-id",
                        {} as Express.Multer.File,
                    ),
                ).rejects.toThrow(
                    "Tenant not found.",
                );
            },
        );

        /**
         * --------------------------------------------------------------
         * Previous agreement should be deleted.
         * --------------------------------------------------------------
         */

        it(
            "should delete previous agreement before uploading new one",
            async () => {
                const tenant = {
                    rentalAgreement: {
                        path:
                            "uploads/old.pdf",
                    },
                } as any;

                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue(
                    tenant,
                );

                const accessSpy =
                    vi.spyOn(
                        fs,
                        "access",
                    ).mockResolvedValue(
                        undefined,
                    );

                const unlinkSpy =
                    vi.spyOn(
                        fs,
                        "unlink",
                    ).mockResolvedValue(
                        undefined,
                    );

                vi.spyOn(
                    tenantRepository,
                    "updateRentalAgreement",
                ).mockResolvedValue(
                    {} as any,
                );

                await tenantService.uploadAgreement(
                    "tenant-id",
                    {
                        originalname:
                            "new.pdf",
                        filename:
                            "new.pdf",
                        mimetype:
                            "application/pdf",
                        size: 100,
                        path:
                            "uploads/new.pdf",
                    } as Express.Multer.File,
                );

                expect(
                    accessSpy,
                ).toHaveBeenCalledWith(
                    "uploads/old.pdf",
                );

                expect(
                    unlinkSpy,
                ).toHaveBeenCalledWith(
                    "uploads/old.pdf",
                );
            },
        );
    });

    /**
     * ========================================================================
     * downloadAgreement()
     * ========================================================================
     */

    describe("downloadAgreement()", () => {
        it(
            "should return agreement metadata",
            async () => {
                const agreement = {
                    path:
                        "uploads/file.pdf",
                    originalName:
                        "agreement.pdf",
                };

                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue({
                    rentalAgreement:
                        agreement,
                } as any);

                vi.spyOn(
                    fs,
                    "access",
                ).mockResolvedValue(
                    undefined,
                );

                const result =
                    await tenantService.downloadAgreement(
                        "tenant-id",
                    );

                expect(result).toEqual(
                    agreement,
                );
            },
        );

        it(
            "should throw when agreement does not exist",
            async () => {
                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue({
                    rentalAgreement:
                        null,
                } as any);

                await expect(
                    tenantService.downloadAgreement(
                        "tenant-id",
                    ),
                ).rejects.toThrow(
                    "Rental agreement not found.",
                );
            },
        );
    });

    /**
     * ========================================================================
     * deleteAgreement()
     * ========================================================================
     */

    describe("deleteAgreement()", () => {
        it(
            "should delete agreement successfully",
            async () => {
                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue({
                    rentalAgreement: {
                        path:
                            "uploads/file.pdf",
                    },
                } as any);

                const unlinkSpy =
                    vi.spyOn(
                        fs,
                        "unlink",
                    ).mockResolvedValue(
                        undefined,
                    );

                const repositorySpy =
                    vi.spyOn(
                        tenantRepository,
                        "removeRentalAgreement",
                    ).mockResolvedValue(
                        {} as any,
                    );

                await tenantService.deleteAgreement(
                    "tenant-id",
                );

                expect(
                    unlinkSpy,
                ).toHaveBeenCalledOnce();

                expect(
                    repositorySpy,
                ).toHaveBeenCalledOnce();
            },
        );

        it(
            "should ignore ENOENT while deleting",
            async () => {
                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue({
                    rentalAgreement: {
                        path:
                            "uploads/file.pdf",
                    },
                } as any);

                vi.spyOn(
                    fs,
                    "unlink",
                ).mockRejectedValue({
                    code: "ENOENT",
                });

                const repositorySpy =
                    vi.spyOn(
                        tenantRepository,
                        "removeRentalAgreement",
                    ).mockResolvedValue(
                        {} as any,
                    );

                await tenantService.deleteAgreement(
                    "tenant-id",
                );

                expect(
                    repositorySpy,
                ).toHaveBeenCalledOnce();
            },
        );

        it(
            "should throw when tenant does not exist",
            async () => {
                vi.spyOn(
                    tenantRepository,
                    "findTenantById",
                ).mockResolvedValue(null);

                await expect(
                    tenantService.deleteAgreement(
                        "tenant-id",
                    ),
                ).rejects.toThrow(
                    "Tenant not found.",
                );
            },
        );
    });
});