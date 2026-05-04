from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    # 🔹 App Info
    APP_NAME: str = "Task Optimizer API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # 🔹 API Config
    API_PREFIX: str = "/api"

    # 🔹 Security (REQUIRED in .env)
    SECRET_KEY: str

    # 🔹 Pagination Default
    DEFAULT_LIMIT: int = 10

    # 🔹 CORS (comma-separated in .env)
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # 🔹 Pydantic Settings Config (v2)
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

    # ✅ Convert string → list for FastAPI CORS
    @property
    def origins(self) -> List[str]:
        return [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]


# ✅ Create settings instance
settings = Settings()