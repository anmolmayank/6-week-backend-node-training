import { Types } from "mongoose";
import MaintenanceTicketModel from "../models/maintenance-ticket.model.js";
import type { MaintenanceTicketStatus } from "../models/maintenance-ticket.model.js";

export const createTicket = (data: {
    tenantId: string;
    tenantName: string;
    apartmentNumber: string;
    subject: string;
    description: string;
}) => MaintenanceTicketModel.create({
    ...data,
    tenantId: new Types.ObjectId(data.tenantId),
});

/** Owner-only: includes issue details and tenant snapshot. */
export const findAllTickets = () =>
    MaintenanceTicketModel.find().sort({ createdAt: -1 }).lean();

/** Tenant-only: caller maps result to a strict status-only DTO. */
export const findTicketsByTenantId = (tenantId: string) =>
    MaintenanceTicketModel.find({ tenantId }).sort({ createdAt: -1 }).lean();

export const findTicketById = (ticketId: string) =>
    MaintenanceTicketModel.findById(ticketId).lean();

export const updateTicketStatus = (ticketId: string, status: MaintenanceTicketStatus) =>
    MaintenanceTicketModel.findByIdAndUpdate(
        ticketId,
        { status },
        { new: true, runValidators: true },
    ).lean();
