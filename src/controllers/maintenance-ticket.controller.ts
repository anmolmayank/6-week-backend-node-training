import type { Request, Response } from "express";
import * as ticketService from "../services/maintenance-ticket.service.js";
import * as ApiResponse from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";

export const createTicket = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId?.toString();
    if (!tenantId) throw new ApiError(httpStatus.FORBIDDEN, "This account is not linked to a tenant record.");
    const { body } = req.validated;
    const ticket = await ticketService.createTenantTicket(tenantId, body as { subject: string; description: string });
    return ApiResponse.created(res, ticket, "Maintenance ticket created successfully.");
});

export const getMyTicketStatuses = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId?.toString();
    if (!tenantId) throw new ApiError(httpStatus.FORBIDDEN, "This account is not linked to a tenant record.");
    const tickets = await ticketService.getMyTicketStatuses(tenantId);
    return ApiResponse.ok(res, tickets, "Maintenance ticket statuses fetched successfully.");
});

export const getAllTickets = catchAsync(async (_req: Request, res: Response) => {
    const tickets = await ticketService.getAllTicketsForOwner();
    return ApiResponse.ok(res, tickets, "Maintenance tickets fetched successfully.");
});

export const updateTicketStatus = catchAsync(async (req: Request, res: Response) => {
    const { ticketId } = req.validated.params as { ticketId: string };
    const { body } = req.validated;
    const updatedTicket = await ticketService.updateTicketStatus(
        ticketId,
        (body as { status: "open" | "in_progress" | "resolved" | "closed" }).status,
    );
    return ApiResponse.ok(res, updatedTicket, "Maintenance ticket status updated successfully.");
});
