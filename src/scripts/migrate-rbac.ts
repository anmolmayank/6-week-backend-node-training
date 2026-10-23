/**
 * One-time, repeatable migration for persisted user roles and tenant links.
 *
 * Usage:
 *   npm run migrate:rbac -- --owner-email=owner@example.com
 *
 * Requires an existing user account for the owner email. Legacy accounts
 * without a role are assigned the least-privileged `tenant` role, then the
 * explicitly selected existing account is promoted to `owner`. No passwords
 * or tenant documents are changed.
 */
import connectDB from "../config/db.js";
import UserModel from "../models/user.model.js";

const ownerEmailArgument = process.argv.find((arg) => arg.startsWith("--owner-email="));
const ownerEmail = ownerEmailArgument?.slice("--owner-email=".length).trim().toLowerCase();

if (!ownerEmail) {
    throw new Error(
        "Provide an existing owner account explicitly: npm run migrate:rbac -- --owner-email=owner@example.com",
    );
}

await connectDB();

try {
    const owner = await UserModel.findOne({ email: ownerEmail }).select("_id email").lean();
    if (!owner) {
        throw new Error(`No existing user was found for owner email '${ownerEmail}'. No RBAC migration was applied.`);
    }

    // Least privilege for legacy accounts whose role was not previously stored.
    await UserModel.collection.updateMany(
        { role: { $exists: false } },
        { $set: { role: "tenant" } },
    );
    await UserModel.collection.updateMany(
        { tenantId: { $exists: false } },
        { $set: { tenantId: null } },
    );

    await UserModel.collection.updateOne(
        { _id: owner._id },
        { $set: { role: "owner", tenantId: null } },
    );

    console.log("RBAC migration completed.");
    console.log("Legacy users without a role are tenants until an owner explicitly assigns roles/tenant links.");
    console.log(`Owner account configured: ${ownerEmail}`);
} finally {
    await UserModel.db.close();
}
