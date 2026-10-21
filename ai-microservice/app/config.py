from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    service_name: str = "ai-microservice"
    environment: str = "development"
    port: int = 8001

    node_api_base_url: str = "http://127.0.0.1:3000"

    mongodb_uri: str
    mongodb_database: str = "node_training_activity"

    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "qwen3:1.7b"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()