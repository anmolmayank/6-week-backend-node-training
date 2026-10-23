/**
 * ============================================================================
 * File: user.service.test.ts
 * Layer: Unit Test
 * ============================================================================
 *
 * Purpose
 * -------
 * Unit tests for the User Service.
 *
 * Why Service Tests?
 * ------------------
 * Services contain business logic.
 *
 * We mock the Repository layer so that:
 *
 *  - No MongoDB connection is required.
 *  - Tests execute very quickly.
 *  - Only business rules are verified.
 *
 * ============================================================================
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { Types } from "mongoose";
import { mockUser } from "../fixtures/user.fixture.js";

import * as userRepository from "../../repositories/user.repository.js";
import * as userService from "../../services/user.service.js";

describe("User Service", () => {
  /**
   * ------------------------------------------------------------------
   * Reset all mocks before every test.
   * ------------------------------------------------------------------
   */
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * ==================================================================
   * getUserById()
   * ==================================================================
   */
  describe("getUserById()", () => {
    /**
     * --------------------------------------------------------------
     * Should return a user when the supplied id exists.
     * --------------------------------------------------------------
     */
    it("should return user when user exists", async () => {
      /**
       * ----------------------------------------------------------
       * Arrange
       * ----------------------------------------------------------
       *
       * Prepare fake repository response.
       */
      const mockUser = {
        _id: new Types.ObjectId(),
        name: "John Doe",
        email: "john@example.com",
        role: "owner" as const,
        tenantId: null,
        password: "hashed-password",
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0, // refactoring needed
      };

      /**
       * Replace repository implementation.
       *
       * No MongoDB call will be executed.
       */
      const repositorySpy = vi
        .spyOn(userRepository, "findById")
        .mockResolvedValue(mockUser);

      /**
       * ----------------------------------------------------------
       * Act
       * ----------------------------------------------------------
       */
      const result = await userService.getUserById(mockUser._id.toString());

      /**
       * ----------------------------------------------------------
       * Assert
       * ----------------------------------------------------------
       */

      /**
       * The service returns safe identity metadata, not the password hash.
       */
      expect(result).toEqual({
        _id: mockUser._id.toString(),
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        tenantId: null,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(result).not.toHaveProperty("password");

      /**
       * Repository should be called exactly once.
       */
      expect(repositorySpy).toHaveBeenCalledOnce();

      /**
       * Repository should receive correct id.
       */
      expect(repositorySpy).toHaveBeenCalledWith(mockUser._id.toString());
    });

    /**
     * --------------------------------------------------------------
     * Should throw NOT_FOUND when user doesn't exist.
     * --------------------------------------------------------------
     */
    it("should throw ApiError when user is not found", async () => {
      /**
       * ----------------------------------------------------------
       * Arrange
       * ----------------------------------------------------------
       */

      vi.spyOn(userRepository, "findById").mockResolvedValue(null);

      /**
       * ----------------------------------------------------------
       * Act + Assert
       * ----------------------------------------------------------
       */

      await expect(
        userService.getUserById("689d58b7d6ef8d8c0b7d1234"),
      ).rejects.toThrow("User with id '689d58b7d6ef8d8c0b7d1234' not found.");

      /**
       * Verify repository interaction.
       */
      expect(userRepository.findById).toHaveBeenCalledOnce();
    });
  });
});
