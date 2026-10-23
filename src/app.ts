/**
 * ============================================================================
 * File: app.ts
 * Layer: Application
 * ============================================================================
 *
 * Purpose
 * -------
 * Configures the Express application.
 *
 * Responsibilities
 * ----------------
 * - Register global middleware.
 * - Configure CORS.
 * - Configure request parsing.
 * - Register Swagger.
 * - Register API routes.
 * - Register global error handlers.
 *
 * ============================================================================
 */

import express, {
    type Express,
} from "express";

import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";
import { env } from "./config/env.js";

import logger from "./middlewares/logger.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import userRoutes from "./routes/user.routes.js";
import activityLogRoutes from "./routes/activity-log.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import maintenanceTicketRoutes from "./routes/maintenance-ticket.routes.js";

const app: Express = express();
/**
 * Security:
 * Prevent Express from disclosing framework/version information
 * through the X-Powered-By response header.
 */
app.disable("x-powered-by");
/**
 * ============================================================================
 * Global Middleware
 * ============================================================================
 */

/**
 * Enable Cross-Origin Resource Sharing.
 */
app.use(
    cors({
        origin: env.clientUrl,
        credentials: true,
    }),
);

/**
 * Parse JSON request bodies.
 */
app.use(
    express.json({
        limit: "1mb",
    }),
);

/**
 * Parse URL encoded request bodies.
 */
app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb",
    }),
);

/**
 * Log incoming requests.
 */
app.use(logger);


/**
 * ============================================================================
 * Swagger
 * ============================================================================
 */
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec),
);

/**
 * ============================================================================
 * Health Check
 * ============================================================================
 */
app.get(
    "/health",
    (_req, res) => {
        res.json({
            success: true,
            status: "UP",
            service: "node-backend",
        });
    }
);

/**
 * ============================================================================
 * API Routes
 * ============================================================================
 */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/activity-logs", activityLogRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/maintenance-tickets", maintenanceTicketRoutes);

/**
 * ============================================================================
 * Error Handling
 * ============================================================================
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;