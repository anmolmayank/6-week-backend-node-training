/**
 * ============================================================================
 * File: swagger.ts
 * Layer: Configuration
 * ============================================================================
 *
 * Purpose
 * -------
 * Configures the OpenAPI (Swagger) specification.
 *
 * Responsibilities
 * ----------------
 * - Define OpenAPI metadata.
 * - Register API documentation.
 * - Generate Swagger specification.
 *
 * ============================================================================
 */

import swaggerJsdoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

/**
 * ============================================================================
 * Swagger Configuration
 * ============================================================================
 */
const options: Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Node 6 Week Training API",
      version: "1.0.0",
      description: "REST API documentation for the backend.",
    },

    servers: [
      {
        // Resolve API requests against the current browser origin.
        // This avoids localhost vs. 127.0.0.1 hostname mismatches.
        url: "/api/v1",
        description: "Node.js versioned API base path",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication APIs",
      },
      {
        name: "Tenants",
        description: "Tenant Management APIs",
      },
      {
        name: "Users",
        description: "User account and tenant-account association APIs",
      },
      {
        name: "Activity Logs",
        description: "Activity Log management APIs",
      },
      {
        name: "Chat",
        description: "Local AI chatbot APIs",
      },
      {
        name: "Tenant Portal",
        description: "Tenant-scoped self-service APIs",
      },
      {
        name: "Maintenance Tickets",
        description: "Tenant ticket creation and owner-only ticket management",
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "password"],

          properties: {
            email: {
              type: "string",
              example: "admin@propertynest.com",
            },
            password: {
              type: "string",
              example: "Password@123",
            },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful." },
            data: {
              type: "object",
              properties: {
                accessToken: { type: "string", description: "JWT access token." },
                user: {
                  type: "object",
                  required: ["_id", "name", "email", "role", "tenantId"],
                  properties: {
                    _id: { type: "string", example: "689d58b7d6ef8d8c0b7d1234" },
                    name: { type: "string", example: "Rahul Sharma" },
                    email: { type: "string", format: "email", example: "tenant@example.com" },
                    role: { type: "string", enum: ["owner", "tenant"] },
                    tenantId: { type: "string", nullable: true, example: null },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },

        ErrorResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Invalid credentials.",
            },
          },
        },
      },
    },
  },

  /**
   * Source files containing Swagger annotations.
   */
  apis: ["./src/routes/*.ts"],
};

/**
 * ============================================================================
 * Swagger Specification
 * ============================================================================
 */
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
