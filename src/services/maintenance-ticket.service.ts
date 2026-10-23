import * as tenantRepository from "../repositories/tenant.repository.js";
import * as ticketRepository from "../repositories/maintenance-ticket.repository.js";
import type { MaintenanceTicketStatus } from "../models/maintenance-ticket.model.js";
import ApiError from "../utils/ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";

export const createTenantTicket = async (
    tenantId: string,
    data: { subject: string; description: string },
) => {
    const tenant = await tenantRepository.findTenantById(tenantId);
    if (!tenant) {
        throw new ApiError(httpStatus.NOT_FOUND, "Tenant record not found.");
    }

    const ticket = await ticketRepository.createTicket({
        tenantId,
        tenantName: tenant.tenantName,
        apartmentNumber: tenant.apartmentNumber,
        subject: data.subject,
        description: data.description,
    });

    // Never echo a tenant's private description in the tenant-facing response.
    return { ticketId: ticket._id.toString(), status: ticket.status };
};

export const getMyTicketStatuses = async (tenantId: string) => {
    const tickets = await ticketRepository.findTicketsByTenantId(tenantId);
    // Intentionally return only identifiers needed to distinguish tickets and status.
    return tickets.map((ticket) => ({
        ticketId: ticket._id.toString(),
        status: ticket.status,
    }));
};

export const getAllTicketsForOwner = () => ticketRepository.findAllTickets();

export const updateTicketStatus = async (
    ticketId: string,
    status: MaintenanceTicketStatus,
) => {
    const ticket = await ticketRepository.updateTicketStatus(ticketId, status);
    if (!ticket) {
        throw new ApiError(httpStatus.NOT_FOUND, "Maintenance ticket not found.");
    }
    return {
        ticketId: ticket._id.toString(),
        status: ticket.status,
        updatedAt: ticket.updatedAt,
    };
};
