/**
 * ============================================================================
 * File: eslint.config.js
 * ============================================================================
 *
 * Purpose
 * -------
 * ESLint configuration for the Node.js backend.
 *
 * Important
 * ---------
 * TypeScript type checking is handled separately by TypeScript 7 (`tsc`).
 *
 * ESLint is responsible for general code-quality rules.
 *
 * TypeScript-specific linting through typescript-eslint is intentionally
 * not enabled because the currently released typescript-eslint version
 * does not yet support TypeScript 7.
 *
 * ============================================================================
 */

import js from "@eslint/js";
import globals from "globals";

export default [
    /**
     * ------------------------------------------------------------------------
     * Ignore generated files.
     * ------------------------------------------------------------------------
     */
    {
        ignores: [
            "dist/**",
            "coverage/**",
            "node_modules/**",
        ],
    },

    /**
     * ------------------------------------------------------------------------
     * ESLint recommended rules.
     * ------------------------------------------------------------------------
     */
    js.configs.recommended,

    /**
     * ------------------------------------------------------------------------
     * Backend configuration.
     * ------------------------------------------------------------------------
     */
    {
        files: [
            "src/**/*.js",
            "src/**/*.ts",
        ],

        languageOptions: {
            /**
             * Modern ECMAScript syntax.
             */
            ecmaVersion: "latest",

            /**
             * Your project uses ESM.
             */
            sourceType: "module",

            /**
             * Node.js globals such as:
             *
             * process
             * Buffer
             * __dirname
             * etc.
             */
            globals: {
                ...globals.node,
            },
        },

        rules: {
            /**
             * ================================================================
             * General Code Quality
             * ================================================================
             */

            /**
             * Backend applications commonly use console during development.
             *
             * Later we can replace this with a structured logger.
             */
            "no-console": "off",

            /**
             * Debugger statements should never reach production.
             */
            "no-debugger": "error",

            /**
             * Prefer const whenever reassignment isn't required.
             */
            "prefer-const": "error",

            /**
             * Prefer shorthand object properties.
             */
            "object-shorthand": "error",

            /**
             * Prevent unreachable code.
             */
            "no-unreachable": "error",

            /**
             * Prevent duplicate imports.
             */
            "no-duplicate-imports": "error",

            /**
             * ================================================================
             * Clean Code
             * ================================================================
             */

            /**
             * Prevent accidental use of variables that don't exist.
             */
            "no-undef": "error",

            /**
             * Prevent unused variables.
             *
             * Note:
             * TypeScript-specific unused-variable analysis is still handled
             * by TypeScript itself until TypeScript 7 support arrives in
             * typescript-eslint.
             */
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
        },
    },
];