
"""
Business operations for activity logs.

Keep business rules here rather than placing them in HTTP routes
or mixing them with MongoDB query code.
"""

from typing import Any

from app.repositories.activity_log_repository import (
    create_activity_log,
    get_activity_log_by_id,
    get_activity_logs,
)


async def create_activity(
    activity_data: dict[str, Any],
) -> dict[str, Any]:
    """Create an activity log through the repository."""

    return await create_activity_log(activity_data)


async def list_activities(
    skip: int = 0,
    limit: int = 20,
) -> list[dict[str, Any]]:
    """Retrieve a paginated list of activities."""

    return await get_activity_logs(skip=skip, limit=limit)


async def find_activity(
    activity_id: str,
) -> dict[str, Any] | None:
    """Find a single activity by ID."""

    return await get_activity_log_by_id(activity_id)
