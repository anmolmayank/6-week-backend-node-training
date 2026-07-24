# Backend Foundation

A RESTful API built using **Node.js 24.18.0**, **Express 5**, and **ES Modules** to understand the fundamentals of backend development and clean application architecture.

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
- In-Memory Data Store
- Layered Architecture (Routes → Controllers → Services)

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

## Next (Week 3)

Planned topics:

- Pagination
- Searching & Filtering
- Sorting
- Refresh Tokens
- Role-Based Access Control (RBAC)
- File Uploads
- Email Verification
- Password Reset
- API Documentation (Swagger/OpenAPI)
- Unit & Integration Testing