# ============================================================================
# Mock Chat Service
# ============================================================================
# This service simulates an AI response.
# It does not make any external API calls and has no LLM usage cost.
# ============================================================================

def generate_mock_response(message: str) -> str:
    return f"You said: {message}. This is a mock AI response."