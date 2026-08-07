/**
 * ============================================================================
 * File: server.ts
 * Layer: Application Bootstrap
 * ============================================================================
 *
 * Purpose
 * -------
 * Application entry point.
 *
 * Responsibilities
 * ----------------
 * - Establish database connection.
 * - Start the Express server.
 * - Handle startup failures.
 *
 * ============================================================================
 */

import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

/**
 * ============================================================================
 * Start Server
 * ============================================================================
 */
const startServer = async (): Promise<void> => {
    try {
        /**
         * Establish MongoDB connection.
         */
        await connectDB();

        /**
         * Start HTTP server.
         */
        app.listen(env.port, () => {
            console.log(
                [
                    "",
                    "========================================",
                    "🚀 Backend Server Started Successfully",
                    "========================================",
                    `Environment : ${env.nodeEnv}`,
                    `Port        : ${env.port}`,
                    `URL         : http://localhost:${env.port}`,
                    "========================================",
                    "",
                ].join("\n")
            );
        });
    } catch (error) {
        console.error(
            "Failed to start the application.",
            error
        );

        process.exit(1);
    }
};

/**
 * ============================================================================
 * Application Startup
 * ============================================================================
 */
await startServer();