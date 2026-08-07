import { Types } from "mongoose";

export const mockUser = {
    _id: new Types.ObjectId(),

    name: "John Doe",

    email: "john@example.com",

    password: "hashed-password",

    createdAt: new Date(),

    updatedAt: new Date(),
};