
"""
MongoDB data-access functions for activity logs.

This module contains database queries only. It does not handle HTTP
requests or decide which HTTP status code should be returned.
"""

from datetime import datetime, timezone
from typing import Any

from bson import ObjectId

from app.database import database


# Select the activity_logs collection from the configured database.
# MongoDB creates the collection automatically on the first insert
# unless it has already been created.
activity_logs_collection = database["activity_logs"]


async def create_activity_log(
    activity_data: dict[str, Any],
) -> dict[str, Any]:
    """
    Insert an activity log and return the persisted document.

    Args:
        activity_data: Validated activity fields from the service layer.

    Returns:
        The saved MongoDB document, including its generated _id.

    Raises:
        RuntimeError: If the inserted document cannot be retrieved.
        PyMongo errors: If the database operation fails.
    """

    # Generate the timestamp on the server, not from client input.
    document = {
        **activity_data,
        "created_at": datetime.now(timezone.utc),
    }

    # insert_one() returns an InsertOneResult containing inserted_id.
    result = await activity_logs_collection.insert_one(document)

    # Retrieve the persisted document using MongoDB's generated ID.
    saved_document = await activity_logs_collection.find_one(
        {"_id": result.inserted_id}
    )

    # Protect against an unexpected situation where the inserted
    # document cannot immediately be retrieved.
    if saved_document is None:
        raise RuntimeError(
            "The activity log was inserted but could not be retrieved."
        )

    return saved_document


async def get_activity_logs(
    skip: int = 0,
    limit: int = 20,
) -> list[dict[str, Any]]:
    """
    Return activity logs, newest first.

    Args:
        skip: Number of documents to skip for pagination.
        limit: Maximum number of documents to return.

    Returns:
        A list of MongoDB documents.
    """

    # MongoDB cursors are lazy. The query is executed as we consume
    # the cursor with to_list().
    cursor = (
        activity_logs_collection
        .find()
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    return await cursor.to_list(length=limit)


async def get_activity_log_by_id(
    activity_id: str,
) -> dict[str, Any] | None:
    """
    Find one activity log using its MongoDB ObjectId.

    Returns:
        The matching document, or None if the ID is invalid or absent.
    """

    # Validate before constructing ObjectId. Invalid IDs should not
    # cause a BSON conversion exception.
    if not ObjectId.is_valid(activity_id):
        return None

    return await activity_logs_collection.find_one(
        {"_id": ObjectId(activity_id)}
    )
