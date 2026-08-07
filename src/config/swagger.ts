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
            description:
                "REST API documentation for the backend.",
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Development Server",
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
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },

            schemas: {
                LoginRequest: {
                    type: "object",
                    required: [
                        "email",
                        "password",
                    ],

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
                        success: {
                            type: "boolean",
                            example: true,
                        },

                        message: {
                            type: "string",
                            example: "Login successful.",
                        },

                        data: {
                            type: "object",

                            properties: {
                                token: {
                                    type: "string",
                                    example:
                                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
                            example:
                                "Invalid credentials.",
                        },
                    },
                },
            },
        },
    },

    /**
     * Source files containing Swagger annotations.
     */
    apis: [
        "./src/routes/*.ts",
    ],
};

/**
 * ============================================================================
 * Swagger Specification
 * ============================================================================
 */
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;