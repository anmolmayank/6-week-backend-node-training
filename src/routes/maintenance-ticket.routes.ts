import express from "express";
import * as ticketController from "../controllers/maintenance-ticket.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorizeOwner from "../middlewares/authorize.middleware.js";
import authorizeTenant from "../middlewares/authorize-tenant.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createMaintenanceTicketSchema,
    updateMaintenanceTicketStatusSchema,
} from "../validations/maintenance-ticket.validation.js";

const router = express.Router();

/** @openapi
 * /maintenance-tickets:
 *   post:
 *     tags: [Maintenance Tickets]
 *     summary: Create a maintenance ticket
 *     description: Creates a ticket for the tenant linked to the authenticated account. The response exposes only the ticket ID and status.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subject, description]
 *             properties:
 *               subject: { type: string, minLength: 1, maxLength: 120, example: Kitchen tap is leaking }
 *               description: { type: string, minLength: 1, maxLength: 2000, example: Water is leaking under the kitchen sink. }
 *     responses:
 *       "201": { description: Ticket created; only ticketId and status are returned. }
 *       "400": { description: Request validation failed. }
 *       "403": { description: Tenant account must be linked to a tenant record. }
 */
router.post("/", authenticate, authorizeTenant, validate(createMaintenanceTicketSchema), ticketController.createTicket);

/** @openapi
 * /maintenance-tickets/mine:
 *   get:
 *     tags: [Maintenance Tickets]
 *     summary: Get my maintenance ticket statuses
 *     description: Tenant response deliberately excludes subject, description, tenant details, and owner-only information.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       "200": { description: List containing only ticketId and status for the authenticated tenant. }
 *       "403": { description: Tenant account must be linked to a tenant record. }
 */
router.get("/mine", authenticate, authorizeTenant, ticketController.getMyTicketStatuses);

/** @openapi
 * /maintenance-tickets:
 *   get:
 *     tags: [Maintenance Tickets]
 *     summary: Get all maintenance tickets (owner only)
 *     description: Returns full ticket details and tenant snapshots for owner review.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       "200": { description: Ticket details returned. }
 *       "403": { description: Owner access required. }
 */
router.get("/", authenticate, authorizeOwner, ticketController.getAllTickets);

/** @openapi
 * /maintenance-tickets/{ticketId}/status:
 *   patch:
 *     tags: [Maintenance Tickets]
 *     summary: Update maintenance ticket status (owner only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema: { type: string, pattern: '^[a-fA-F0-9]{24}$' }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [open, in_progress, resolved, closed] }
 *     responses:
 *       "200": { description: Ticket status updated. }
 *       "400": { description: Validation failed. }
 *       "403": { description: Owner access required. }
 *       "404": { description: Ticket not found. }
 */
router.patch("/:ticketId/status", authenticate, authorizeOwner, validate(updateMaintenanceTicketStatusSchema), ticketController.updateTicketStatus);

export default router;
