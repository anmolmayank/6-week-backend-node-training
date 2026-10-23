import { beforeEach, describe, expect, it, vi } from "vitest";
import * as tenantRepository from "../../repositories/tenant.repository.js";
import * as ticketRepository from "../../repositories/maintenance-ticket.repository.js";
import * as ticketService from "../../services/maintenance-ticket.service.js";

describe("Maintenance Ticket Service", () => {
    beforeEach(() => vi.restoreAllMocks());

    it("creates a tenant ticket using the persisted tenant identity and returns only its ID/status", async () => {
        vi.spyOn(tenantRepository, "findTenantById").mockResolvedValue({
            tenantName: "Priya Singh",
            apartmentNumber: "A-102",
        } as never);
        const createSpy = vi.spyOn(ticketRepository, "createTicket").mockResolvedValue({
            _id: { toString: () => "ticket-id" },
            status: "open",
            subject: "Private subject",
            description: "Private description",
        } as never);

        const result = await ticketService.createTenantTicket("tenant-id", {
            subject: "Tap leak",
            description: "The kitchen tap leaks.",
        });

        expect(createSpy).toHaveBeenCalledWith({
            tenantId: "tenant-id",
            tenantName: "Priya Singh",
            apartmentNumber: "A-102",
            subject: "Tap leak",
            description: "The kitchen tap leaks.",
        });
        expect(result).toEqual({ ticketId: "ticket-id", status: "open" });
        expect(result).not.toHaveProperty("description");
        expect(result).not.toHaveProperty("subject");
    });

    it("returns only ticket IDs and statuses for the tenant ticket-list API", async () => {
        vi.spyOn(ticketRepository, "findTicketsByTenantId").mockResolvedValue([
            {
                _id: { toString: () => "ticket-1" },
                status: "in_progress",
                subject: "Private subject",
                description: "Private description",
                tenantName: "Priya Singh",
            },
        ] as never);

        const result = await ticketService.getMyTicketStatuses("tenant-id");
        expect(result).toEqual([{ ticketId: "ticket-1", status: "in_progress" }]);
        expect(result[0]).not.toHaveProperty("description");
        expect(result[0]).not.toHaveProperty("subject");
        expect(result[0]).not.toHaveProperty("tenantName");
    });
});
