import httpx


# ============================================================================
# External HTTP Request
# ============================================================================

async def fetch_test_data() -> dict:
    """Fetch sample JSON from a public test API."""

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            "https://jsonplaceholder.typicode.com/todos/1"
        )

        response.raise_for_status()

        return response.json()