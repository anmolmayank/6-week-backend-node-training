/** MongoDB model for tenant-submitted maintenance/query tickets. */
import { model, Schema, Types, type HydratedDocument } from "mongoose";
import {
    MAINTENANCE_TICKET_STATUSES,
    type MaintenanceTicketStatus,
} from "../constants/maintenance-ticket.js";

export { MAINTENANCE_TICKET_STATUSES, type MaintenanceTicketStatus } from "../constants/maintenance-ticket.js";

export interface MaintenanceTicket {
    tenantId: Types.ObjectId;
    tenantName: string;
    apartmentNumber: string;
    subject: string;
    description: string;
    status: MaintenanceTicketStatus;
    createdAt: Date;
    updatedAt: Date;
}
export type MaintenanceTicketDocument = HydratedDocument<MaintenanceTicket>;

const maintenanceTicketSchema = new Schema<MaintenanceTicket>(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
        // Snapshot keeps historical tickets understandable if a tenant record is removed.
        tenantName: { type: String, required: true, trim: true, maxlength: 100 },
        apartmentNumber: { type: String, required: true, trim: true, maxlength: 20 },
        subject: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
        description: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
        status: {
            type: String,
            enum: MAINTENANCE_TICKET_STATUSES,
            required: true,
            default: "open",
            index: true,
        },
    },
    { timestamps: true, versionKey: false },
);

maintenanceTicketSchema.index({ createdAt: -1 });
export default model<MaintenanceTicket>("MaintenanceTicket", maintenanceTicketSchema);
