
"""
HTTP routes for creating and retrieving activity logs.
"""

from typing import Any

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas import ActivityLogCreate, ActivityLogResponse
from app.services.activity_log_service import (
    create_activity,
    find_activity,
    list_activities,
)


# All routes in this router share the same URL prefix and Swagger tag.
router = APIRouter(
    prefix="/api/v1/activity-logs",
    tags=["Activity Logs"],
)


def serialize_activity(
    document: dict[str, Any],
) -> dict[str, Any]:
    """
    Convert a MongoDB document into the API response representation.

    MongoDB uses _id/ObjectId internally. The public API uses id/string.
    """

    return {
        "id": str(document["_id"]),
        "user_id": document["user_id"],
        "action": document["action"],
        "description": document["description"],
        "created_at": document["created_at"],
    }


@router.post(
    "",
    response_model=ActivityLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an activity log",
)
async def create_activity_endpoint(
    request: ActivityLogCreate,
) -> dict[str, Any]:
    """Validate the request, create the record, and return it."""

    # Pydantic has already validated the incoming JSON body.
    activity_data = request.model_dump()

    # Delegate business and database work to their respective layers.
    document = await create_activity(activity_data)

    # Return only the fields the API is intended to expose.
    return serialize_activity(document)


@router.get(
    "",
    response_model=list[ActivityLogResponse],
    summary="List activity logs",
)
async def list_activity_logs(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
) -> list[dict[str, Any]]:
    """Return the newest activity logs, with pagination."""

    documents = await list_activities(
        skip=skip,
        limit=limit,
    )

    return [serialize_activity(document) for document in documents]


@router.get(
    "/{activity_id}",
    response_model=ActivityLogResponse,
    summary="Get an activity log by ID",
)
async def get_activity_log(
    activity_id: str,
) -> dict[str, Any]:
    """Return one activity log or report that it was not found."""

    document = await find_activity(activity_id)

    # Invalid ObjectIds and valid IDs without matching documents
    # both produce a consistent 404 response.
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity log not found.",
        )

    return serialize_activity(document)
