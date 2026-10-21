import httpx

from app.config import settings


# ============================================================================
# Node.js Backend Client
# ============================================================================
# Responsibility:
# - Communicate with the existing Node.js backend.
# - Return its JSON response.
# - Raise an exception when the HTTP request fails.
# ============================================================================

async def get_node_health() -> dict:
    url = f"{settings.node_api_base_url.rstrip('/')}/health"

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(url)
        response.raise_for_status()

        return response.json()