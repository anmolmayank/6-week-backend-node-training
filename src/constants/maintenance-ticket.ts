/** Supported maintenance-ticket lifecycle states. */
export const MAINTENANCE_TICKET_STATUSES = [
    "open",
    "in_progress",
    "resolved",
    "closed",
] as const;

export type MaintenanceTicketStatus =
    (typeof MAINTENANCE_TICKET_STATUSES)[number];
