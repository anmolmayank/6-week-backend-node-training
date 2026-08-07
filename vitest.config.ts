import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        /**
         * Global APIs
         *
         * Enables:
         * describe()
         * it()
         * expect()
         * beforeEach()
         * afterEach()
         */
        globals: true,

        /**
         * Node.js environment
         *
         * Suitable for Express backend applications.
         */
        environment: "node",

        /**
         * Test file patterns.
         */
        include: [
            "src/tests/**/*.test.ts",
        ],

        /**
         * Reset mocks between tests.
         */
        clearMocks: true,

        /**
         * Coverage configuration.
         */
        coverage: {
            provider: "v8",

            reporter: [
                "text",
                "html",
            ],

            reportsDirectory: "./coverage",
        },
    },
});