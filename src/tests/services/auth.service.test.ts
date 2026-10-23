/**
 * ============================================================================
 * File: auth.service.test.ts
 * Layer: Unit Test
 * ============================================================================
 *
 * Purpose
 * -------
 * Unit tests for Authentication Service.
 *
 * Business Rules
 * --------------
 * 1. User must exist.
 * 2. Password must match.
 * 3. Generate JWT after successful authentication.
 * 4. Password must never be exposed in the response.
 *
 * Testing Strategy
 * ----------------
 * - Mock Repository layer.
 * - Mock bcrypt password verification.
 * - Mock JWT generation.
 * - Verify only Authentication Service business logic.
 *
 * ============================================================================
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

import * as authService from "../../services/auth.service.js";
import * as userRepository from "../../repositories/user.repository.js";
import * as jwtUtils from "../../utils/jwt.js";

describe("Authentication Service", () => {
    /**
     * ------------------------------------------------------------------
     * Restore all spies before every test.
     * ------------------------------------------------------------------
     */
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    /**
     * ==================================================================
     * login()
     * ==================================================================
     */
    describe("login()", () => {
        /**
         * --------------------------------------------------------------
         * Should authenticate a valid user.
         * --------------------------------------------------------------
         */
        it("should login successfully", async () => {
            /**
             * ----------------------------------------------------------
             * Arrange
             * ----------------------------------------------------------
             */

            const mockUser = {
                _id: new Types.ObjectId(),
                name: "John Doe",
                email: "john@example.com",
                role: "owner",
                tenantId: null,
                password: "hashed-password",
                createdAt: new Date(),
                updatedAt: new Date(),
                __v: 0,
            } as any;

            const repositorySpy = vi
                .spyOn(
                    userRepository,
                    "findByEmailWithPassword",
                )
                .mockResolvedValue(mockUser);

            const compareSpy = vi
                .spyOn(
                    bcrypt,
                    "compare",
                )
                .mockResolvedValue(true as never);

            const tokenSpy = vi
                .spyOn(
                    jwtUtils,
                    "generateAccessToken",
                )
                .mockReturnValue("mock-access-token");

            /**
             * ----------------------------------------------------------
             * Act
             * ----------------------------------------------------------
             */

            const result = await authService.login({
                email: "john@example.com",
                password: "Password@123",
            });

            /**
             * ----------------------------------------------------------
             * Assert
             * ----------------------------------------------------------
             */

            /**
             * JWT should be generated.
             */
            expect(result.accessToken)
                .toBe("mock-access-token");

            /**
             * Password must never be returned.
             */
            expect(result.user)
                .not.toHaveProperty("password");
            expect(result.user.role).toBe("owner");
            expect(result.user.tenantId).toBeNull();

            /**
             * Repository should be called once.
             */
            expect(repositorySpy)
                .toHaveBeenCalledOnce();

            /**
             * Password verification should execute.
             */
            expect(compareSpy)
                .toHaveBeenCalledWith(
                    "Password@123",
                    "hashed-password",
                );

            /**
             * JWT should be generated using user id.
             */
            expect(tokenSpy)
                .toHaveBeenCalledWith(
                    mockUser._id.toString(),
                );
        });

        /**
         * --------------------------------------------------------------
         * Should reject login when email is not registered.
         * --------------------------------------------------------------
         */
        it("should throw when email is not registered", async () => {
            /**
             * ----------------------------------------------------------
             * Arrange
             * ----------------------------------------------------------
             */

            vi.spyOn(
                userRepository,
                "findByEmailWithPassword",
            ).mockResolvedValue(null);

            const compareSpy = vi.spyOn(
                bcrypt,
                "compare",
            );

            const tokenSpy = vi.spyOn(
                jwtUtils,
                "generateAccessToken",
            );

            /**
             * ----------------------------------------------------------
             * Act + Assert
             * ----------------------------------------------------------
             */

            await expect(
                authService.login({
                    email: "unknown@example.com",
                    password: "Password@123",
                }),
            ).rejects.toThrow(
                "Invalid email or password.",
            );

            /**
             * Password verification should never execute.
             */
            expect(compareSpy)
                .not.toHaveBeenCalled();

            /**
             * JWT generation should never execute.
             */
            expect(tokenSpy)
                .not.toHaveBeenCalled();
        });

        /**
         * --------------------------------------------------------------
         * Should reject login when password is incorrect.
         * --------------------------------------------------------------
         */
        it("should throw when password is incorrect", async () => {
            /**
             * ----------------------------------------------------------
             * Arrange
             * ----------------------------------------------------------
             */

            const mockUser = {
                _id: new Types.ObjectId(),
                name: "John Doe",
                email: "john@example.com",
                password: "hashed-password",
                createdAt: new Date(),
                updatedAt: new Date(),
                __v: 0,
            } as any;

            vi.spyOn(
                userRepository,
                "findByEmailWithPassword",
            ).mockResolvedValue(mockUser);

            const compareSpy = vi
                .spyOn(
                    bcrypt,
                    "compare",
                )
                .mockResolvedValue(false as never);

            const tokenSpy = vi.spyOn(
                jwtUtils,
                "generateAccessToken",
            );

            /**
             * ----------------------------------------------------------
             * Act + Assert
             * ----------------------------------------------------------
             */

            await expect(
                authService.login({
                    email: "john@example.com",
                    password: "WrongPassword",
                }),
            ).rejects.toThrow(
                "Invalid email or password.",
            );

            /**
             * Password verification should execute.
             */
            expect(compareSpy)
                .toHaveBeenCalledOnce();

            /**
             * JWT should never be generated.
             */
            expect(tokenSpy)
                .not.toHaveBeenCalled();
        });
    });
});