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
│   ├── data/
│   │     users.js
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