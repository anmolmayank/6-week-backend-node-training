
"""
Pydantic schemas for request validation and API responses.

Schemas define the public data contract of this microservice.
They are separate from the MongoDB document representation.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request body for the existing mock chat endpoint."""

    message: str = Field(
        min_length=1,
        max_length=2000,
        description="The message submitted by the user",
    )


class ActivityLogCreate(BaseModel):
    """Fields a client must provide to create an activity log."""

    user_id: str = Field(
        min_length=1,
        max_length=100,
        description="Identifier of the user performing the activity",
    )

    action: str = Field(
        min_length=1,
        max_length=100,
        description="Short name of the activity",
    )

    description: str = Field(
        min_length=1,
        max_length=500,
        description="Details about the activity",
    )


class ActivityLogResponse(BaseModel):
    """Fields returned to the API client after reading a log."""

    id: str = Field(
        description="String representation of the MongoDB document ID",
    )

    user_id: str
    action: str
    description: str
    created_at: datetime
