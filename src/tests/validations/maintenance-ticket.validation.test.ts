import { describe, expect, it } from "vitest";
import { createMaintenanceTicketSchema, updateMaintenanceTicketStatusSchema } from "../../validations/maintenance-ticket.validation.js";

describe("Maintenance ticket validation", () => {
    it("accepts a valid tenant ticket request", () => {
        expect(() => createMaintenanceTicketSchema.parse({
            body: { subject: "Kitchen tap", description: "The tap is leaking." },
        })).not.toThrow();
    });

    it("rejects empty or oversized ticket details", () => {
        expect(() => createMaintenanceTicketSchema.parse({
            body: { subject: " ", description: "A valid-looking but empty subject." },
        })).toThrow();
        expect(() => createMaintenanceTicketSchema.parse({
            body: { subject: "Issue", description: "x".repeat(2001) },
        })).toThrow();
    });

    it("accepts only the supported ticket status values", () => {
        expect(() => updateMaintenanceTicketStatusSchema.parse({
            params: { ticketId: "689d58b7d6ef8d8c0b7d1234" },
            body: { status: "in_progress" },
        })).not.toThrow();
        expect(() => updateMaintenanceTicketStatusSchema.parse({
            params: { ticketId: "689d58b7d6ef8d8c0b7d1234" },
            body: { status: "pending" },
        })).toThrow();
    });
});
