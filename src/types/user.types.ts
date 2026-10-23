/** Domain-level user types shared by services and controllers. */
import type { UserRole } from "../models/user.model.js";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
