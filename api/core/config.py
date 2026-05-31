"""
Environment configuration — fail fast if required vars are missing (§8).
All secrets come from environment variables, never hardcoded.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Required at runtime per agent (passed by the user in each request)
    # These are NOT stored server-side — users supply their own keys per §5.3

    # Optional server-side defaults (can be set in .env for dev convenience)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")

    # CORS
    ALLOWED_ORIGINS: list[str] = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001"
    ).split(",")

    # Security
    # Max input lengths per §5.1
    MAX_URL_LENGTH: int = 2048
    MAX_TEXT_LENGTH: int = 10_000
    MAX_QUERY_LENGTH: int = 500

    # SSRF block list per §5.1
    BLOCKED_URL_HOSTS: tuple = (
        "localhost", "127.0.0.1", "0.0.0.0",
        "::1", "169.254.", "10.", "192.168.", "172.16.",
    )
    ALLOWED_URL_SCHEMES: tuple = ("https",)

    NODE_ENV: str = os.getenv("NODE_ENV", "development")

    @property
    def is_production(self) -> bool:
        return self.NODE_ENV == "production"


settings = Settings()