/**
 * ============================================================================
 * File: tenant.seed.js
 * ============================================================================
 *
 * Purpose
 * -------
 * Populates the database with sample tenant records for development.
 *
 * Usage
 * -----
 * npm run seed:tenants
 *
 * ============================================================================
 */

import connectDB from "../config/db.js";
import TenantModel from "../models/tenant.model.js";

const tenants = [
    {
        tenantName: "Rahul Sharma",
        apartmentNumber: "A-101",
        monthlyRent: 25000,
    },
    {
        tenantName: "Priya Singh",
        apartmentNumber: "A-102",
        monthlyRent: 27000,
    },
    {
        tenantName: "Aman Verma",
        apartmentNumber: "A-103",
        monthlyRent: 26000,
    },
    {
        tenantName: "Sneha Patel",
        apartmentNumber: "B-201",
        monthlyRent: 32000,
    },
    {
        tenantName: "Arjun Nair",
        apartmentNumber: "B-202",
        monthlyRent: 31000,
    },
    {
        tenantName: "Neha Gupta",
        apartmentNumber: "B-203",
        monthlyRent: 29000,
    },
    {
        tenantName: "Rohit Das",
        apartmentNumber: "C-301",
        monthlyRent: 35000,
    },
    {
        tenantName: "Pooja Mishra",
        apartmentNumber: "C-302",
        monthlyRent: 34000,
    },
    {
        tenantName: "Vikram Rao",
        apartmentNumber: "C-303",
        monthlyRent: 33000,
    },
    {
        tenantName: "Anjali Mehta",
        apartmentNumber: "D-401",
        monthlyRent: 40000,
    },
];

const seedTenants = async () => {
    try {
        await connectDB();

        console.log("Connected to MongoDB.");

        await TenantModel.deleteMany();

        console.log("Existing tenants removed.");

        await TenantModel.insertMany(tenants);

        console.log("Tenant data seeded successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed tenant data.");

        console.error(error);

        process.exit(1);
    }
};

await seedTenants();