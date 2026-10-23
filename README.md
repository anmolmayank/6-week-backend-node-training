# Backend Foundation

A RESTful API built using **Node.js 24.18.0**, **Express 5**, **TypeScript**, **MongoDB**, **Mongoose**, and **ES Modules** to understand backend fundamentals, clean architecture, authentication, validation, file handling, and testing.

---

## Tech Stack

- Node.js 24.18.0 (LTS)
- Express 5
- ES Modules (ECMAScript Modules)

---

## Features

- RESTful APIs
- API Versioning (`/api/v1`)
- Express Router
- Route Parameters
- Middleware
- Request Validation
- Request Logging
- Global Error Handling
- Custom API Error Class
- Standardized API Responses
- MongoDB and Mongoose
- JWT Authentication
- Password hashing with bcrypt
- Zod request validation
- Repository pattern
- Tenant management
- Rental agreement file upload/download/delete
- Multer file handling
- Layered Architecture (Routes → Controllers → Services → Repositories → Models)
- Unit testing with Vitest

---

## Project Structure

```text
backend-foundation/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── constants/
│   │     httpStatus.js
│   │
│   ├── controllers/
│   │     user.controller.js
│   │
│   ├── mockData/
│   │     usersData.js
│   │
│   ├── middlewares/
│   │     error.middleware.js
│   │     logger.middleware.js
│   │     notFound.middleware.js
│   │     validate.middleware.js
│   │
│   ├── routes/
│   │     user.routes.js
│   │
│   ├── services/
│   │     user.service.js
│   │
│   └── utils/
│         ApiError.js
│         response.js
│
├── package.json
├── .gitignore
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Install dependencies

```bash
npm install
```

### Run the application

```bash
npm run dev
```

The server will start on

```text
http://localhost:3000
```

---

# Base URL

All APIs are versioned.

```text
http://localhost:3000/api/v1
```

---

# Available APIs

## 1. Get All Users

**GET**

```http
/api/v1/users
```

### Success Response

```json
{
    "success": true,
    "message": "Users fetched successfully",
    "data": [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        }
    ]
}
```

---

## 2. Get User By Id

**GET**

```http
/api/v1/users/:id
```

Example

```http
/api/v1/users/1
```

### Success Response

```json
{
    "success": true,
    "message": "User fetched successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

### Error Response

```json
{
    "success": false,
    "message": "User with id 100 not found"
}
```

---

## 3. Create User

**POST**

```http
/api/v1/users
```

### Request Body

```json
{
    "name": "Anmol",
    "email": "anmol@example.com"
}
```

### Success Response

```json
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "id": 3,
        "name": "Anmol",
        "email": "anmol@example.com"
    }
}
```

### Validation Error

```json
{
    "success": false,
    "message": "Email is required"
}
```

---

## Request Lifecycle

```text
Client
   │
   ▼
Express Server
   │
   ▼
Logger Middleware
   │
   ▼
API Router (/api/v1)
   │
   ▼
User Router (/users)
   │
   ▼
Validation Middleware
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
In-Memory Data
   │
   ▼
Response Utility
   │
   ▼
Client
```

If an error occurs

```text
Controller / Service
        │
        ▼
    ApiError
        │
        ▼
Error Middleware
        │
        ▼
JSON Response
```

---

## HTTP Status Codes

| Status | Description |
|---------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Current Limitations

- Uses an in-memory data store.
- Data is lost whenever the server restarts.
- No persistent database integration.
- No authentication or authorization.

---

## Future Enhancements

- Environment Variables (.env)
- DB Connection
- JWT Authentication
- Authorization & Role-Based Access
- Update & Delete APIs
- Pagination
- Filtering & Sorting

---

## Learning Objectives week 1

This project demonstrates:

- Node.js 24 with ES Modules
- Express 5 fundamentals
- REST API development
- API Versioning
- Express Routing
- Middleware Pipeline
- Route Parameters
- Request Validation
- Centralized Error Handling
- Layered Architecture

# Week 2 - User Management & Authentication

## Objective

Build a production-style User Management and Authentication module using **Node.js**, **Express**, **MongoDB**, and **JWT**, while following a clean layered architecture.

---

# Topics Covered

## 1. Layered Architecture

Implemented a clear separation of responsibilities:

```text
Routes
    ↓
Middleware
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Models
    ↓
MongoDB
```

Each layer is responsible for only one concern.

---

## 2. User CRUD APIs

Implemented RESTful APIs for user management.

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/users` | Create User |
| GET | `/api/v1/users` | Get All Users *(Protected)* |
| GET | `/api/v1/users/:id` | Get User by Id *(Protected + Owner Only)* |
| PATCH | `/api/v1/users/:id` | Update User *(Protected + Owner Only)* |
| DELETE | `/api/v1/users/:id` | Delete User *(Protected + Owner Only)* |

---

## 3. Request Validation

Implemented request validation using **Zod**.

Validated:

- Request Body
- URL Parameters
- Query Parameters

Validation is handled before the controller executes.

Validated data is exposed through:

```javascript
req.validated
```

instead of mutating Express request properties.

---

## 4. Global Error Handling

Implemented centralized error handling using:

- ApiError
- catchAsync
- Error Middleware

All errors return a consistent response format.

---

## 5. API Response Standardization

Implemented a reusable ApiResponse utility.

Example:

```javascript
ApiResponse.ok(...)
ApiResponse.created(...)
ApiResponse.success(...)
```

Every endpoint now follows a consistent response structure.

---

## 6. Repository Pattern

Database access is isolated inside repositories.

Responsibilities include:

- Create User
- Find User
- Find Users
- Update User
- Delete User

Repositories return plain JavaScript objects using:

```javascript
.lean()
```

or

```javascript
.toObject()
```

---

## 7. Password Security

Implemented secure password storage using **bcrypt**.

Features:

- Password hashing
- Salt rounds configuration
- Password comparison during login

Passwords are never returned in API responses.

---

## 8. JWT Authentication

Implemented JWT-based authentication.

Features:

- Generate Access Token
- Verify Access Token
- Token Expiration
- JWT Secret using Environment Variables

JWT Payload:

```json
{
    "userId": "<Mongo ObjectId>"
}
```

---

## 9. Authentication Middleware

Implemented middleware to protect APIs.

Authentication flow:

```text
Read Authorization Header
        ↓
Validate Bearer Format
        ↓
Extract Token
        ↓
Verify JWT
        ↓
Find User
        ↓
Attach req.user
        ↓
next()
```

Protected endpoints require:

```http
Authorization: Bearer <JWT>
```

---

## 10. Authorization Middleware

Implemented owner-based authorization.

Current rule:

A user can only access, update or delete their own profile.

Comparison:

```javascript
req.user._id === req.params.id
```

---

## 11. Login API

Implemented login endpoint.

### Endpoint

```http
POST /api/v1/auth/login
```

Login Flow:

```text
Email
    ↓
Find User
    ↓
Compare Password
    ↓
Generate JWT
    ↓
Return Access Token
```

---

## 12. Security Practices

Implemented:

- Password hashing
- JWT Authentication
- Protected APIs
- Owner Authorization
- Environment Variables
- No password exposure
- Generic authentication error messages
- Validation before business logic

---

# Project Structure

```text
src
├── config
│   ├── db.js
│   └── env.js
│
├── constants
│   ├── auth.js
│   └── httpStatus.js
│
├── controllers
│   ├── auth.controller.js
│   └── user.controller.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── authorize.middleware.js
│   ├── error.middleware.js
│   ├── logger.middleware.js
│   ├── notFound.middleware.js
│   └── validate.middleware.js
│
├── models
│   └── user.model.js
│
├── repositories
│   └── user.repository.js
│
├── routes
│   ├── auth.routes.js
│   └── user.routes.js
│
├── services
│   ├── auth.service.js
│   └── user.service.js
│
├── utils
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── catchAsync.js
│   └── jwt.js
│
└── validations
    ├── auth.validation.js
    ├── common.validation.js
    └── user.validation.js
```

---

# APIs Tested

Successfully tested:

- User Registration
- Duplicate Registration
- Login
- JWT Generation
- JWT Verification
- Protected Routes
- Owner Authorization
- Invalid Token
- Missing Token
- Invalid ObjectId
- Update User
- Delete User

---

# Key Learnings

- Clean Layered Architecture
- Separation of Concerns
- Repository Pattern
- Request Validation
- Global Error Handling
- Async Error Handling
- Password Hashing
- JWT Authentication
- Authentication vs Authorization
- Protected APIs
- Owner-Based Authorization
- Environment Variables
- REST API Design
- HTTP Status Codes
- Security Best Practices

---

# Week 2 Status

**Completed Successfully**

✔ User CRUD APIs

✔ Validation Middleware

✔ Repository Pattern

✔ Authentication

✔ Authorization

✔ JWT

✔ Password Hashing

✔ Global Error Handling

✔ Protected Routes

✔ Login API

---

# Week 3 - Tenant Management & File Handling

## Objective

Build a real-world Tenant Management module backed by MongoDB, including rental agreement file management.

## Topics Covered

### Tenant Management

- Tenant model
- Tenant repository
- Tenant service
- Tenant controller
- Tenant routes
- Tenant creation
- Tenant listing
- Tenant retrieval
- Tenant update
- Partial updates using PATCH

### Rental Agreement Management

- Multer
- Multipart form-data
- PDF upload
- File metadata
- Filesystem storage
- Agreement replacement
- Agreement download
- Agreement deletion
- Missing file handling

### Validation

- Create Tenant schema
- Update Tenant schema
- Tenant ObjectId validation
- Partial update validation
- Empty PATCH body validation

### Testing

- Tenant service unit tests
- Tenant validation tests
- Repository mocking
- Filesystem mocking

## Tenant APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/tenants` | Get all tenants |
| POST | `/api/v1/tenants` | Create tenant |
| PATCH | `/api/v1/tenants/:tenantId` | Update tenant |
| POST | `/api/v1/tenants/:tenantId/agreement` | Upload/replace agreement |
| GET | `/api/v1/tenants/:tenantId/agreement` | Download agreement |
| DELETE | `/api/v1/tenants/:tenantId/agreement` | Delete agreement |

### Status

**In Progress**

The tenant backend, rental agreement APIs, validation, and unit tests have been implemented. The frontend workflow is still being completed.

---

# Current Learning Status

```text
Week 1
Backend Fundamentals
        │
        ▼
   COMPLETED
        │
        ▼
Week 2
User Management & Authentication
        │
        ▼
   COMPLETED
        │
        ▼
Week 3
Tenant Management & File Handling
        │
        ▼
   IN PROGRESS
```

---

# Key Learnings

The project currently demonstrates:

- Node.js backend development
- Express 5
- TypeScript
- ES Modules
- REST API design
- API versioning
- Layered architecture
- Separation of concerns
- Repository Pattern
- MongoDB
- Mongoose
- Schema design
- Embedded schemas
- Request validation
- Zod
- JWT authentication
- Authentication vs Authorization
- Password hashing
- bcrypt
- File uploads
- Multer
- Filesystem operations
- Standardized API responses
- Centralized error handling
- Async error handling
- Unit testing
- Mocking
- Vitest
- ESLint
- TypeScript compilation
- Swagger/OpenAPI

---

# Current Limitations

- Rental agreement files currently use local filesystem storage.
- No cloud object storage integration yet.
- No refresh token mechanism yet.
- No role-based access control yet.
- No pagination yet.
- No advanced filtering or sorting yet.
- Integration/E2E API testing is not yet fully implemented.

---

# Future Enhancements

Planned improvements include:

- Refresh Tokens
- Role-Based Access Control (RBAC)
- Pagination
- Searching
- Filtering
- Sorting
- Cloud file storage
- File cleanup and storage abstraction
- Integration testing
- API/E2E testing
- Rate limiting
- Security headers
- Production logging
- Docker
- CI/CD
- Deployment
- API performance optimization

---

# Project Status

### Backend Foundation

**Completed**

### User Management & Authentication

**Completed**

### Tenant Management Backend

**Implemented**

### Rental Agreement Management

**Implemented**

### Tenant Management Frontend

**In Progress**

---

# Learning Goal

The overall goal of this project is to progress from a basic Express application to a maintainable, testable, production-oriented backend architecture.

The project emphasizes not just making APIs work, but understanding:

```text
Why the code is structured this way
        ↓
Where business logic belongs
        ↓
How requests flow through the application
        ↓
How to validate and secure APIs
        ↓
How to test business logic independently
        ↓
How the architecture can scale
```
# Backend Foundation

A learning and development backend built with **Node.js**, **Express**, and **MongoDB**, with JWT-based authentication, request validation, tenant management, rental-agreement file handling, and a local AI chatbot integration.

The AI integration runs as a separate **FastAPI** microservice and uses **Ollama** to generate responses with a locally hosted language model. The AI microservice also persists activity logs in MongoDB.

> **Repository note:** This README describes the Node.js backend and its adjacent `ai-microservice/` integration. The React frontend is maintained in a separate repository.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Run locally](#run-locally)
- [API overview](#api-overview)
- [AI chatbot integration](#ai-chatbot-integration)
- [Activity logs](#activity-logs)
- [Testing and verification](#testing-and-verification)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Project status](#project-status)

## Features

### Backend foundation

- Versioned REST API under `/api/v1`
- Express routers and middleware
- Layered application structure using routes, controllers, services, repositories, and models where applicable
- Standardized API responses and centralized error handling
- Request logging and Zod-based request validation
- MongoDB persistence using Mongoose
- User authentication with JWTs and password hashing with `bcrypt`
- Tenant-management APIs
- Rental-agreement upload, download, and deletion support using Multer
- Automated tests using Vitest

### AI and activity logging

- Node.js chat endpoint at `POST /api/v1/chat`
- FastAPI AI microservice
- Local language-model inference through Ollama
- Configurable Ollama model; the documented default is `qwen3:1.7b`
- Activity-log persistence in MongoDB from the AI microservice
- Health endpoint and interactive API documentation for the FastAPI service

## Technology stack

| Area | Technology |
| --- | --- |
| Node.js API | Node.js 24.18.0, Express 5, JavaScript ES modules |
| Database and persistence | MongoDB, Mongoose; MongoDB Atlas is used by the AI microservice configuration |
| Authentication and validation | JWT, `bcrypt`, Zod |
| File handling | Multer |
| Testing | Vitest |
| AI service | Python 3.11, FastAPI, Uvicorn |
| Local model runtime | Ollama |
| Frontend integration | React and Vite in a separate repository |

## Architecture

The application is split into the Node.js API and a Python AI microservice. Ollama runs separately and provides the local model runtime.

```text
React frontend
    |
    | HTTP / JSON
    v
Node.js + Express API (port 3000)
    |
    | Chat request forwarded to AI service
    v
FastAPI AI microservice (port 8001)
    |                         \
    | model request            \ activity-log persistence
    v                           v
Ollama (port 11434)          MongoDB
    |
    v
Local language model
```

For the chatbot, the normal request path is:

1. The frontend sends a chat request to the Node.js API.
2. Node.js forwards the request to the FastAPI service.
3. FastAPI calls the configured Ollama model.
4. The generated response is returned through Node.js to the frontend.
5. Activity data is persisted by the AI service where configured.

## Prerequisites

Install or configure the following before running the integrated application:

- Node.js **24.18.0** and npm
- Python **3.11** for the AI microservice
- Ollama with the configured model downloaded
- Access to the configured MongoDB database
- The React frontend repository, if you want to test the complete UI flow

The commands below use the local development ports configured for this project. If your `.env` files override them, use the configured values instead.

## Configuration

Keep environment-specific configuration in local `.env` files. Do not commit real credentials or connection strings.

### Node.js backend

1. Create or update the backend `.env` file using the variables required by the project's environment/configuration module.
2. Verify the server port and MongoDB connection settings.
3. Verify the configured FastAPI base URL points to the running AI microservice (normally `http://127.0.0.1:8001`).

Use the repository's existing `env.js` or environment example as the source of truth for exact Node.js variable names.

### FastAPI AI microservice

The microservice reads configuration from `ai-microservice/.env`. The current project configuration requires `MONGODB_URI` and uses these documented defaults:

| Setting | Default / expected value |
| --- | --- |
| Service port | `8001` |
| Ollama base URL | `http://127.0.0.1:11434` |
| Ollama model | `qwen3:1.7b` |
| MongoDB database | `node_training_activity` |
| MongoDB collection for activity logs | `activity_logs` |

These defaults may be overridden by environment settings. Do not put secrets in this README, source control, screenshots, or logs.

### Frontend

Configure the frontend's API base URL to point to the Node.js API. A typical local value is:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

The frontend is in a separate repository. Restart Vite after changing its environment variables.

## Run locally

Start each long-running service in a separate terminal. Use the following order so each dependency is ready before the service that calls it.

### 1. Start Ollama

Open the Ollama application if it is not already running, then check the installed version and local models:

```bash
ollama --version
ollama list
curl http://127.0.0.1:11434/api/tags
```

If the configured model is `qwen3:1.7b` and it is not installed, download it:

```bash
ollama pull qwen3:1.7b
```

### 2. Start the FastAPI AI microservice

From the backend repository root:

```bash
cd ai-microservice
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

The project entry point is `app/main.py`, and the FastAPI application object is `app`, so use `app.main:app`.

Verify the service:

```bash
curl http://127.0.0.1:8001/health
```

Open interactive API documentation at <http://127.0.0.1:8001/docs>.

If the `.venv` directory does not exist, create it with Python 3.11 and install the dependencies listed by the microservice project:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Run the dependency-install step only if `requirements.txt` exists in `ai-microservice/`.

### 3. Start the Node.js backend

Open another terminal at the backend repository root:

```bash
npm install
npm run dev
```

The Node.js API is expected to listen on `http://127.0.0.1:3000` in local development. If dependencies are already installed, `npm install` does not need to be repeated every time.

### 4. Start the React frontend

In the frontend repository, run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Sign in before testing the floating chatbot widget if the frontend requires an authenticated session.

## API overview

### Node.js API

The base URL for versioned Node.js endpoints is:

```text
http://localhost:3000/api/v1
```

| Resource | Route | Notes |
| --- | --- | --- |
| Authentication | `/auth` | Includes the login flow at `POST /auth/login` |
| Users | `/users` | User-management routes; see the backend route definitions for supported methods |
| Tenants | `/tenants` | Tenant-management routes |
| Chat | `/chat` | `POST /api/v1/chat` forwards a request to the AI service |

The exact request schema and supported methods for user, tenant, and file operations are defined by the current route validators and controllers. Refer to those definitions before relying on an example not shown here.

### Chat endpoint

**Request**

```http
POST /api/v1/chat
Content-Type: application/json
```

The request body must match the chat schema implemented by the backend. A typical message payload is shown below; confirm the field names against the current route validator if the schema has changed.

```json
{
  "message": "Explain the difference between a route and a controller."
}
```

**Successful response**

```json
{
  "success": true,
  "message": "Chat response generated successfully",
  "data": {
    "message": "A route maps an HTTP method and path to request handling; a controller handles the request and creates the response.",
    "provider": "ollama"
  },
  "meta": {}
}
```

The generated text varies by prompt and model. The response above illustrates the response shape, not a guaranteed model answer.

### FastAPI endpoints and docs

- Health check: `GET http://127.0.0.1:8001/health`
- Interactive API documentation: <http://127.0.0.1:8001/docs>
- OpenAPI schema: <http://127.0.0.1:8001/openapi.json>

Use FastAPI's interactive docs to find the exact activity-log paths, methods, request schemas, and response schemas exposed by the currently running service. This README does not assume a route path that has not been verified.

## AI chatbot integration

The Node.js API is the frontend-facing entry point. The model is run locally by Ollama; the React application does not need to connect directly to Ollama.

```text
React -> Node.js /api/v1/chat -> FastAPI -> Ollama -> configured model
```

The default model documented for this setup is `qwen3:1.7b`. To change models, first ensure the model is available in Ollama, then update the microservice's model configuration or environment override and restart FastAPI.

The chatbot widget's visibility in the frontend is a user-interface behavior, not an authorization boundary. The Node.js API must continue to validate and authorize protected requests on the server.

## Activity logs

The FastAPI microservice includes an activity-log implementation organized into router, service, and repository modules. The documented persistence defaults are:

- Database: `node_training_activity`
- Collection: `activity_logs`
- Fields in the create model: `user_id`, `action`, and `description`
- Response data also includes an identifier and creation timestamp

The create-model constraints currently documented in the project are: `user_id` and `action` are 1–100 characters, while `description` is 1–500 characters.

To inspect or exercise the activity-log APIs, start FastAPI and use <http://127.0.0.1:8001/docs>. This is the source of truth for the route paths and HTTP methods in the running version. Confirm that MongoDB is reachable and that the service's database configuration is correct if logs are not being persisted.

## Testing and verification

Run the test scripts defined in the backend's `package.json`. This project has used Vitest for backend tests; use the script name in the current `package.json` rather than assuming a particular test command.

For an end-to-end chatbot check, verify each service in order:

```bash
# Ollama responds and lists available local models
curl http://127.0.0.1:11434/api/tags

# FastAPI health check
curl http://127.0.0.1:8001/health
```

Then confirm that:

1. The Node.js backend starts successfully on its configured port.
2. The frontend points to the Node.js API base URL.
3. The authenticated chatbot widget is visible in the frontend, if authentication is required.
4. A chat request to `POST /api/v1/chat` returns a response with `data.provider` set to `ollama` when the local model provider is used.
5. Activity-log entries are persisted when the relevant logging flow is exercised.

## Troubleshooting

| Symptom | Checks |
| --- | --- |
| `ollama` API is unavailable | Ensure the Ollama application/service is running and check `curl http://127.0.0.1:11434/api/tags`. |
| Configured model is missing | Run `ollama list`; install the configured model if necessary and check the model setting. |
| `source .venv/bin/activate` fails | Run the command from `ai-microservice/` and confirm `.venv/bin/activate` exists. |
| `uvicorn` is not found | Activate the microservice virtual environment and confirm its dependencies are installed. |
| FastAPI fails during startup | Check `ai-microservice/.env`, especially `MONGODB_URI`, MongoDB network access, and the startup log. |
| Node.js chat request fails | Confirm Node and FastAPI are running and that the Node configuration points to the correct FastAPI base URL. |
| Frontend cannot reach Node.js | Check `VITE_API_BASE_URL`, the Node.js port, browser Network/Console output, and CORS configuration. |
| Chat widget does not appear | Sign in, verify a valid access token is stored, and inspect the frontend route and widget mounting logic. |
| Activity logs are missing | Use FastAPI `/docs` to confirm the relevant endpoint and request, then verify MongoDB connectivity and the configured database/collection. |

## Security notes

- Never commit `.env` files, MongoDB connection strings, JWT secrets, access tokens, or other credentials.
- Do not log access tokens or full chat prompts/responses when they may contain sensitive information.
- Treat the frontend's authenticated-session check as a display concern only. Enforce authentication and authorization at the API layer.
- Keep the FastAPI and Ollama services bound to local interfaces during local development unless you have intentionally configured and secured remote access.

## Project status

| Area | Current documented capability |
| --- | --- |
| Backend foundation | Versioned Express API, middleware, validation, and standardized responses |
| Authentication | JWT-based login and password hashing |
| Tenant management | Tenant API implementation |
| Rental agreements | Upload, download, and delete flow |
| AI integration | Node chat endpoint connected to a FastAPI microservice and local Ollama model |
| Activity logs | FastAPI router/service/repository implementation with MongoDB persistence |
| Frontend chatbot | Floating widget integration is part of the frontend workstream |

This project is also used as a learning exercise in API design, layered architecture, validation, authentication, file handling, testing, local AI integration, and service-to-service communication.
