import { Types } from "mongoose";

export const mockUser = {
    _id: new Types.ObjectId(),

    name: "John Doe",

    email: "john@example.com",

    role: "owner" as const,

    tenantId: null,

    password: "hashed-password",

    createdAt: new Date(),

    updatedAt: new Date(),
};