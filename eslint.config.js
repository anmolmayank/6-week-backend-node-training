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
 * This project uses TypeScript 7.
 *
 * The currently available typescript-eslint release does not yet support
 * TypeScript 7, so ESLint is intentionally used only for JavaScript/general
 * code-quality analysis.
 *
 * TypeScript syntax and type checking are handled by `tsc`.
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
     * JavaScript configuration.
     * ------------------------------------------------------------------------
     *
     * Only `.js` files are included here.
     *
     * TypeScript files are intentionally excluded because the current
     * typescript-eslint release does not support TypeScript 7.
     */
    {
        files: [
            "src/**/*.js",
        ],

        languageOptions: {
            /**
             * Modern ECMAScript syntax.
             */
            ecmaVersion: "latest",

            /**
             * Project uses ES modules.
             */
            sourceType: "module",

            /**
             * Node.js globals.
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
             * Console is acceptable for the training backend.
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
             * Prefer object property shorthand.
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
             * Prevent undefined variables.
             */
            "no-undef": "error",

            /**
             * Prevent unused variables.
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