# Property Management Backend

Node.js 24 + Express 5 + TypeScript + MongoDB backend for a property-management application. The API includes JWT authentication, owner/tenant role-based access, tenant and rental-agreement management, maintenance tickets, and a local AI chat integration through FastAPI and Ollama.

> The React frontend is maintained in a separate repository. The frontend is not allowed to enforce permissions by itself: Node.js validates identity and role on every protected API request.

## Contents

- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Environment configuration](#environment-configuration)
- [Install and run](#install-and-run)
- [Roles and account linking](#roles-and-account-linking)
- [API reference](#api-reference)
- [Maintenance tickets](#maintenance-tickets)
- [AI chatbot and activity logs](#ai-chatbot-and-activity-logs)
- [Validation and error responses](#validation-and-error-responses)
- [Tests and checks](#tests-and-checks)
- [Security and operational notes](#security-and-operational-notes)

## Architecture

```text
React application
       |
       | Bearer JWT / JSON / multipart file upload
       v
Node.js + Express API (port 3000)
   |         |                |
   |         |                +-- Maintenance Ticket model / repository
   |         +-- Tenant / User models, services, repositories
   |
   +-- Chat service HTTP client
               |
               v
       FastAPI AI microservice (port 8001)
               |                 \
               v                  v
           Ollama            MongoDB activity logs
        (port 11434)
```

Node uses a layered structure: **Routes → Middleware → Controllers → Services → Repositories → Models**. FastAPI is a separate service; the React app calls Node, not FastAPI or Ollama directly.

## Technology stack

| Area | Technology |
|---|---|
| Runtime/API | Node.js 24, Express 5, TypeScript, ES modules |
| Persistence | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| File uploads | Multer; local PDF storage |
| API documentation | Swagger UI / OpenAPI |
| Tests | Vitest |
| AI service | Python 3.11, FastAPI, Uvicorn |
| Local model runtime | Ollama; configured default `qwen3:1.7b` |

## Prerequisites

- Node.js and npm versions compatible with `package.json` / `package-lock.json`.
- Access to the configured MongoDB database.
- Python 3.11 and the packages in `ai-microservice/requirements.txt` if running AI features.
- Ollama with the configured model downloaded if generating local model responses.

## Environment configuration

### Node API

Copy `.env.example` to `.env` and replace placeholders locally. Do not commit `.env` or send its contents in chat/screenshots.

Required Node variables:

| Variable | Purpose |
|---|---|
| `PORT` | Express port; typically `3000` |
| `CLIENT_URL` | Allowed frontend origin for CORS |
| `NODE_ENV` | Runtime environment |
| `DB_USERNAME`, `DB_PASSWORD`, `DB_CLUSTER`, `DB_NAME` | MongoDB Atlas connection parts |
| `JWT_SECRET` | Secret used to sign access tokens; use a long random value |
| `JWT_EXPIRES_IN` | Token lifetime such as `1h` |
| `FASTAPI_BASE_URL` | FastAPI URL, typically `http://127.0.0.1:8001` |

### FastAPI service

Create `ai-microservice/.env` locally. The service requires `MONGODB_URI`; it also supports `MONGODB_DATABASE`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `PORT`, and `NODE_API_BASE_URL`. Defaults are documented in `ai-microservice/app/config.py`.

## Install and run

Install Node dependencies:

```bash
npm ci
```

Start the Node API:

```bash
npm run dev
```

Useful local URLs:

- Health: `http://127.0.0.1:3000/health`
- Swagger UI: `http://127.0.0.1:3000/api-docs`
- API base path: `http://127.0.0.1:3000/api/v1`

To run the complete AI stack, start Ollama, then FastAPI, then Node, then the React frontend. FastAPI's docs are at `http://127.0.0.1:8001/docs`.

## Roles and account linking

The application supports two roles:

- **`owner`** — manages tenants, agreements, user accounts, and all maintenance tickets.
- **`tenant`** — can read only the linked tenant profile and own agreement; can create tickets and see only their ticket IDs/statuses.

A user record stores `role` and `tenantId`. `tenantId` is a MongoDB ObjectId reference to a tenant record. A tenant record can be linked to at most one user account. A registered tenant user with `tenantId: null` cannot call tenant-scoped APIs until an owner links the account.

### Apply the RBAC migration

**Take a MongoDB backup first.** The migration is an explicit one-time step; it is not automatically run by the server. It requires the email address of the account that should become the owner:

```bash
npm run migrate:rbac -- --owner-email=existing-owner@example.com
```

The selected email must already exist in the User collection. The migration assigns `tenant` to legacy records whose role is missing, initializes missing `tenantId` values to `null`, then promotes the selected account to `owner`. It does not alter passwords or tenant records.

New registrations always become unlinked tenant accounts. Role and tenant ID are not accepted as public registration inputs.

### Owner links a tenant login

1. Create the tenant record using `POST /api/v1/tenants`.
2. Register the user through `POST /api/v1/users`, or locate an existing account via `GET /api/v1/users`.
3. As an owner, link the login using `PATCH /api/v1/users/:id`:

```json
{
  "role": "tenant",
  "tenantId": "<existing-tenant-object-id>"
}
```

Set `tenantId` to `null` to unlink an account. Setting `role` to `owner` automatically clears the tenant association. `GET /api/v1/auth/me` returns the persisted user identity, role, and tenant association for frontend route selection.

## API reference

All routes below are mounted below `/api/v1`. Swagger UI at `/api-docs` is the interactive reference for schemas and response details.

### Authentication and user accounts

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Validate credentials and return JWT + user identity |
| `GET` | `/auth/me` | Authenticated | Return current identity, role, and `tenantId` |
| `POST` | `/users` | Public | Register a user as an unlinked tenant account |
| `GET` | `/users` | Owner | List safe account metadata for owner management |
| `GET` | `/users/:id` | Owner | Read user account metadata |
| `PATCH` | `/users/:id` | Owner | Update name/email, role, and tenant association |
| `DELETE` | `/users/:id` | Owner | Remove a login account |

The login success payload contains `data.accessToken` and `data.user`, where `data.user` includes `_id`, `name`, `email`, `role`, `tenantId`, `createdAt`, and `updatedAt`. Password hashes are never returned.

### Tenant and rental agreements

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/tenants` | Owner | List all tenants |
| `POST` | `/tenants` | Owner | Create a tenant record |
| `PATCH` | `/tenants/:tenantId` | Owner | Update tenant name, apartment number, or rent |
| `DELETE` | `/tenants/:tenantId` | Owner | Delete a tenant, unlink the login account, and attempt agreement-file cleanup |
| `POST` | `/tenants/:tenantId/agreement` | Owner | Upload or replace the agreement PDF using multipart field `agreement` |
| `GET` | `/tenants/:tenantId/agreement` | Owner | Download a tenant agreement |
| `DELETE` | `/tenants/:tenantId/agreement` | Owner | Remove the tenant agreement |
| `GET` | `/tenants/me` | Linked tenant | Read only the authenticated user's linked tenant profile |
| `GET` | `/tenants/me/agreement` | Linked tenant | Download only the authenticated user's agreement |

Tenant profile responses omit internal filesystem paths and generated storage names. The tenant-specific endpoints derive the tenant identity from the authenticated account rather than accepting a tenant ID from the browser.

Tenant deletion also clears `tenantId` from the associated login account. The user account remains a tenant account but is unlinked. Maintenance tickets retain tenant name/apartment snapshots for historical owner review. Agreement file cleanup failures are logged so they can be remediated; deletion is not a filesystem transaction.

### Maintenance tickets

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/maintenance-tickets` | Linked tenant | Create a ticket with `subject` and `description` |
| `GET` | `/maintenance-tickets/mine` | Linked tenant | Get own ticket IDs and statuses only |
| `GET` | `/maintenance-tickets` | Owner | List complete tickets and tenant snapshots |
| `PATCH` | `/maintenance-tickets/:ticketId/status` | Owner | Change ticket status |

Ticket statuses are `open`, `in_progress`, `resolved`, and `closed`. Tenant-facing responses intentionally expose only `ticketId` and `status`; ticket subject/description, tenant details, and owner-only data are not returned by the tenant ticket-list or create response. Ticket creation derives the tenant ID, name, and apartment number from the authenticated user's stored relationship.

### Chat and activity logs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/chat` | Authenticated | Forward a chat request to FastAPI, which uses Ollama |
| `POST` | `/activity-logs` | Owner | Create an activity log via FastAPI |
| `GET` | `/activity-logs` | Owner | Query activity logs with pagination |
| `GET` | `/activity-logs/:activityId` | Owner | Retrieve one activity log |

The local chat request uses `POST /api/v1/chat` with a validated `message` payload. The standard success response contains `data.message` and `data.provider` (for example, `ollama`). The FastAPI activity-log collection defaults are documented by its own `/docs` page and settings; MongoDB activity-log persistence is handled by the Python microservice.

## Validation and error responses

Request payloads and path parameters are validated with Zod before controller execution. Standard success responses use this envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

Errors use `success: false`, a message, and an `errors` array. Relevant status codes include `400` for invalid requests, `401` for missing/invalid authentication, `403` for insufficient role/tenant association, `404` for missing records, and `409` for duplicate account/link conflicts.

## Tests and checks

The package scripts include:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run check
```

`npm run check` runs type-checking, linting, and the Vitest suite. Run these from the backend repository after installing dependencies and applying the intended local environment configuration.

## Security and operational notes

- The API re-reads the user record during authentication, so the persisted role and tenant association are authoritative; clients cannot elevate themselves with JWT or request-body fields.
- UI visibility is not authorization. Protected route middleware is required on the backend.
- Keep JWT secrets, MongoDB passwords, `.env` files, local agreement files, `node_modules`, and Python `.venv` out of the source archive/repository.
- The FastAPI and Ollama services should remain on localhost or behind suitable authentication/network controls; do not expose internal service ports publicly without protection.
- Refresh tokens, cloud file storage, pagination on tenant lists, and integration/E2E test coverage remain possible follow-up work.
