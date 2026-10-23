
"""Tests for the local AI chat endpoint."""

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.main import app


# Avoid running database startup and shutdown logic in endpoint unit tests.
client = TestClient(app)


@pytest.mark.parametrize(
    ("message", "expected_response"),
    [
        ("Explain REST APIs", "A REST API exposes resources over HTTP."),
    ],
)
def test_chat_returns_generated_response(
    monkeypatch: pytest.MonkeyPatch,
    message: str,
    expected_response: str,
) -> None:
    """Return the generated text and identify Ollama as the provider."""

    async def mock_generate_chat_response(user_message: str) -> str:
        assert user_message == message
        return expected_response

    monkeypatch.setattr(
        "app.main.generate_chat_response",
        mock_generate_chat_response,
    )

    response = client.post(
        "/api/v1/chat",
        json={"message": message},
    )

    assert response.status_code == 200
    assert response.json() == {
        "message": expected_response,
        "provider": "ollama",
    }


def test_chat_rejects_empty_message() -> None:
    """Reject an empty message through Pydantic request validation."""

    response = client.post(
        "/api/v1/chat",
        json={"message": ""},
    )

    assert response.status_code == 422


def test_chat_returns_error_when_ollama_is_unavailable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Propagate the service's HTTP error to the API caller."""

    async def mock_generate_chat_response(_message: str) -> str:
        raise HTTPException(
            status_code=503,
            detail="Ollama is unavailable.",
        )

    monkeypatch.setattr(
        "app.main.generate_chat_response",
        mock_generate_chat_response,
    )

    response = client.post(
        "/api/v1/chat",
        json={"message": "Hello"},
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Ollama is unavailable."
