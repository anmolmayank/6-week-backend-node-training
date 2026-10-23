# RBAC, Tenant Linking, and Maintenance Ticket Implementation

## Data model changes

### User

`User` now has:

- `role`: `owner` or `tenant` (new accounts default to `tenant`).
- `tenantId`: nullable ObjectId reference to `Tenant`.

A partial unique index prevents two user accounts from being linked to the same tenant record. The password hash remains excluded from ordinary queries.

### MaintenanceTicket

New MongoDB collection `maintenancetickets` stores:

- `tenantId` — tenant record reference.
- `tenantName` and `apartmentNumber` — snapshots retained for owner history if the tenant is deleted.
- `subject`, `description` — the private ticket details.
- `status` — `open`, `in_progress`, `resolved`, or `closed`.
- automatic `createdAt` and `updatedAt` timestamps.

## Login and identity flow

1. `POST /api/v1/auth/login` validates credentials and returns `data.accessToken` plus `data.user`.
2. `data.user` includes `_id`, `name`, `email`, `role`, and `tenantId`.
3. `GET /api/v1/auth/me` returns persisted identity data for session restoration.
4. Auth middleware verifies the JWT and reloads the user from MongoDB for every protected request. It does not rely on a client-supplied role.

## Migration

Run the migration against the configured database only after taking a backup:

```bash
npm run migrate:rbac -- --owner-email=existing-owner@example.com
```

The email must exist in the `User` collection. The migration fills missing role values with `tenant`, missing tenant associations with `null`, and promotes only the explicitly selected email to owner. It is not run during application startup.

## Owner account and tenant account linking

1. The owner account must be selected in the migration.
2. Public `POST /api/v1/users` always creates an unlinked tenant account. Client-supplied `role` and `tenantId` are not part of its request schema.
3. Owner creates a tenant record through `POST /api/v1/tenants`.
4. Owner lists accounts through `GET /api/v1/users` and links a tenant account using `PATCH /api/v1/users/:id`:

```json
{
  "role": "tenant",
  "tenantId": "<tenant-object-id>"
}
```

Linking verifies that the tenant exists and is not already linked to another user. Setting `tenantId: null` unlinks the account; assigning the owner role clears any tenant link.

## Endpoint access matrix

| Endpoint | Owner | Tenant |
|---|---:|---:|
| `GET /api/v1/tenants` | All tenants | Denied |
| `POST /api/v1/tenants` | Allowed | Denied |
| `PATCH /api/v1/tenants/:tenantId` | Allowed | Denied |
| `DELETE /api/v1/tenants/:tenantId` | Allowed | Denied |
| `GET /api/v1/tenants/me` | Denied | Own linked record |
| `GET /api/v1/tenants/me/agreement` | Denied | Own agreement download |
| `POST /api/v1/maintenance-tickets` | Denied | Create ticket for linked account |
| `GET /api/v1/maintenance-tickets/mine` | Denied | IDs and statuses only |
| `GET /api/v1/maintenance-tickets` | Full ticket details | Denied |
| `PATCH /api/v1/maintenance-tickets/:ticketId/status` | Allowed | Denied |
| `GET /api/v1/users` | Safe account metadata | Denied |
| `PATCH /api/v1/users/:id` | Role/account/tenant linking | Denied |

## Tenant ticket privacy

Tenant ticket creation requires only `subject` and `description`; the server derives the tenant ID, name, and apartment from the authenticated user's database association.

Tenant-facing ticket responses contain only:

```json
{
  "ticketId": "<ticket-id>",
  "status": "open"
}
```

The tenant `GET /mine` response is an array of those same minimal fields. It does not expose subject, description, tenant snapshot, or owner action details. Owner listing returns the details necessary to review the issue and update status.

## Tenant deletion behavior

`DELETE /api/v1/tenants/:tenantId` is owner-only. It removes the tenant document, clears the linked user's `tenantId`, and attempts to remove the local agreement file. Maintenance-ticket records remain, with tenant-name/apartment snapshots retained for historical owner review. Filesystem cleanup failures are logged because MongoDB deletion has already completed; they require operational follow-up.

## Verification

Added unit coverage includes:

- login role and tenant association response fields;
- public registration schema discarding client-provided role/tenant fields;
- ticket input validation and status enum validation;
- tenant ticket response projection excluding private description/subject fields.

The source was syntax-parsed in the packaging environment. Full TypeScript compilation and Vitest execution were not run here because `npm ci` could not fetch the npm registry (`EAI_AGAIN`). Run `npm ci` and `npm run check` locally before merging, then verify the OpenAPI UI at `/api-docs` and test each role using separate test accounts.
