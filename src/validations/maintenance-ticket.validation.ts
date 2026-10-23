import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";
import { MAINTENANCE_TICKET_STATUSES } from "../constants/maintenance-ticket.js";

export const createMaintenanceTicketSchema = z.object({
    body: z.object({
        subject: z.string().trim().min(1).max(120),
        description: z.string().trim().min(1).max(2000),
    }),
});

export const updateMaintenanceTicketStatusSchema = z.object({
    params: z.object({ ticketId: objectIdSchema }),
    body: z.object({ status: z.enum(MAINTENANCE_TICKET_STATUSES) }),
});
