from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

from app.config import settings


# ============================================================================
# MongoDB Client
# ============================================================================
# The client manages connections to MongoDB.
# We reuse one client for the lifetime of this service.
# ============================================================================

client: AsyncMongoClient = AsyncMongoClient(
    settings.mongodb_uri,
    serverSelectionTimeoutMS=5000,
)

database: AsyncDatabase = client[settings.mongodb_database]


async def check_database_connection() -> bool:
    """Verify that MongoDB is reachable."""
    await client.admin.command("ping")
    return True


async def close_database_connection() -> None:
    """Release MongoDB resources during application shutdown."""
    await client.close()