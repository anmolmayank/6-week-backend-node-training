# 6-week-backend-node-training
This is an 6 week backend trainging with node, express, and SQL

# Backend Foundation

A simple REST API built using **Node.js 24**, **Express 5**, and **ES Modules** to understand the fundamentals of backend development.

---

## Tech Stack

- Node.js 24.18.0
- Express 5
- ES Modules (ECMAScript Modules)

---

## Features

- Express Server Setup
- REST APIs
- Route Parameters
- Middleware
- Logger Middleware
- Request Validation
- Global Error Handling
- Custom API Error Class
- Standardized API Response
- In-Memory Data Store

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
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Run the application

```bash
npm run dev
```

The server starts on

```text
http://localhost:3000
```

---

## Available APIs

### Get All Users

**GET**

```http
/users
```

#### Success Response

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

### Get User By Id

**GET**

```http
/users/:id
```

Example

```http
/users/1
```

#### Success Response

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

#### Error Response

```json
{
    "success": false,
    "message": "User with id 100 not found"
}
```

---

### Create User

**POST**

```http
/users
```

Request Body

```json
{
    "name": "Anmol",
    "email": "anmol@example.com"
}
```

#### Success Response

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

#### Validation Error

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
Route
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

If any error occurs

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

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Current Limitations

- Uses an in-memory array as the data source.
- Data is lost whenever the application restarts.
- No database integration yet.

---

## Future Improvements

- To be added