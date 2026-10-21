
"""
============================================================================
Application Entry Point — FastAPI Microservice
============================================================================

Purpose:
    Configure the FastAPI application, register API endpoints, and manage
    application startup and shutdown.

Responsibilities:
    1. Create and configure the FastAPI application.
    2. Verify MongoDB connectivity during startup.
    3. Close the MongoDB client during shutdown.
    4. Expose health-check, chat, and integration endpoints.

Architecture:
    HTTP Request
        |
        v
    FastAPI Endpoint
        |
        +--> Client / Schema validation
        |
        +--> Service layer
        |
        +--> Database or external API client

Important:
    - Keep business logic out of this file.
    - Keep database queries in database/repository modules.
    - Keep external HTTP communication in client modules.
    - Never expose secrets in API responses.
============================================================================
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI

from app.clients.node_api_client import get_node_health
from app.config import settings
from app.database import (
    database,
    check_database_connection,
    close_database_connection,
)
from app.schemas import ChatRequest
from app.chat_service import generate_mock_response
from datetime import datetime, timezone
from app.routers.activity_logs import router as activity_logs_router


# ============================================================================
# Application Lifecycle
# ============================================================================
# FastAPI's lifespan context manager handles resources that must be initialized
# when the application starts and released when it shuts down.
#
# Startup:
#     Verify that MongoDB is reachable.
#
# Shutdown:
#     Close the MongoDB client to release its resources.
#
# If the MongoDB ping fails, startup will fail. This is intentional for this
# version because the Activity Log service depends on MongoDB.
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Avoid an unused-argument warning while keeping the standard lifespan
    # signature required by FastAPI.
    _ = app

    try:
        await check_database_connection()
        print("MongoDB connection check succeeded.")

        yield

    finally:
        # Run cleanup even if application startup or shutdown raises an error.
        await close_database_connection()
        print("MongoDB Connection Closed")


# ============================================================================
# FastAPI Application Configuration
# ============================================================================

app = FastAPI(
    title="Node.js Backend Training — Python Microservice",
    description=(
        "A training microservice for learning Python, FastAPI, "
        "MongoDB integration, HTTP communication, and AI integration."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Register the Activity Log endpoints with the main application.
app.include_router(activity_logs_router)


# ============================================================================
# Health Check
# ============================================================================
# Endpoint:
#     GET /health
#
# Purpose:
#     Confirm that the FastAPI application is responding.
#
# Note:
#     This checks application availability only. It does not independently
#     verify MongoDB on every request. MongoDB is checked during startup.
# ============================================================================

@app.get(
    "/health",
    tags=["Health"],
    summary="Check service health",
)
async def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": settings.service_name,
        "environment": settings.environment,
    }


# ============================================================================
# Chat Endpoint — Mock AI Response
# ============================================================================
# Endpoint:
#     POST /api/v1/chat
#
# Purpose:
#     Accept a validated chat message and return a mock response.
#
# Current implementation:
#     No LLM provider is called. There is no AI API usage cost.
#
# Future implementation:
#     Replace the mock service with an actual LLM service while preserving
#     the API contract where practical.
# ============================================================================

@app.post(
    "/api/v1/chat",
    tags=["Chat"],
    summary="Send a message to the mock chat service",
)
async def chat(request: ChatRequest) -> dict[str, str]:
    response = generate_mock_response(request.message)

    return {
        "message": response,
        "provider": "mock",
    }


# ============================================================================
# Node.js Backend Integration
# ============================================================================
# Endpoint:
#     GET /api/v1/integrations/node/health
#
# Purpose:
#     Verify communication between the Python service and the existing
#     Node.js backend using HTTP.
#
# Flow:
#     Client
#       |
#       v
#     FastAPI endpoint
#       |
#       v
#     Node.js API client
#       |
#       v
#     Existing Node.js /health endpoint
#
# Note:
#     HTTP failures from the Node.js client currently propagate as exceptions.
#     We will introduce centralized exception handling in a later step.
# ============================================================================

@app.get(
    "/api/v1/integrations/node/health",
    tags=["Integrations"],
    summary="Check connectivity to the Node.js backend",
)
async def check_node_backend() -> dict:
    node_health = await get_node_health()

    return {
        "integration": "node-backend",
        "node_response": node_health,
    }



@app.post("/api/v1/test-mongodb")
async def test_mongodb_write_read() -> dict:
    """Insert a test document and read it back from MongoDB."""

    collection = database["activity_logs"]

    # 1. Create a test document.
    document = {
        "user_id": "test-user-001",
        "action": "mongodb_connection_test",
        "description": "Testing MongoDB insert and read operations",
        "created_at": datetime.now(timezone.utc),
    }

    # 2. Insert the document.
    result = await collection.insert_one(document)

    # 3. Retrieve the inserted document using its generated ID.
    saved_document = await collection.find_one(
        {"_id": result.inserted_id}
    )

    # 4. Return the result in a JSON-friendly format.
    if saved_document is None:
        return {
            "success": False,
            "message": "Document was inserted but could not be retrieved.",
        }

    return {
        "success": True,
        "message": "MongoDB insert and read operations succeeded.",
        "document": {
            "id": str(saved_document["_id"]),
            "user_id": saved_document["user_id"],
            "action": saved_document["action"],
            "description": saved_document["description"],
            "created_at": saved_document["created_at"].isoformat(),
        },
    }

