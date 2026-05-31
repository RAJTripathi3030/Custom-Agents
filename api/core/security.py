"""
Input security per §5.1:
- Validate and sanitize ALL inputs server-side
- Max length enforcement
- SSRF prevention for URL inputs
- Null byte / control character rejection
- URL scheme whitelist (https:// only)
"""
import re
from urllib.parse import urlparse
from fastapi import HTTPException

from api.core.config import settings


def validate_url(url: str, field_name: str = "url") -> str:
    """
    Validate a URL input:
    - Must be https:// only
    - Max 2048 chars
    - Block SSRF targets (localhost, private IPs, etc.)
    - No null bytes or control characters
    """
    url = url.strip()

    if not url:
        raise HTTPException(400, detail=f"{field_name} is required.")

    if len(url) > settings.MAX_URL_LENGTH:
        raise HTTPException(
            400,
            detail=f"{field_name} exceeds maximum length of {settings.MAX_URL_LENGTH} characters.",
        )

    _reject_control_chars(url, field_name)

    try:
        parsed = urlparse(url)
    except Exception:
        raise HTTPException(400, detail=f"{field_name} is not a valid URL.")

    if parsed.scheme not in settings.ALLOWED_URL_SCHEMES:
        raise HTTPException(
            400,
            detail=f"{field_name} must use HTTPS. Only https:// URLs are allowed.",
        )

    host = (parsed.hostname or "").lower()
    if not host:
        raise HTTPException(400, detail=f"{field_name} has no valid hostname.")

    for blocked in settings.BLOCKED_URL_HOSTS:
        if host == blocked or host.startswith(blocked):
            raise HTTPException(
                400,
                detail=f"{field_name} points to a private or blocked address.",
            )

    return url


def validate_text(text: str, field_name: str = "input", max_length: int | None = None) -> str:
    """
    Validate a text input:
    - Required / non-empty
    - Max length (default: settings.MAX_TEXT_LENGTH)
    - No null bytes or control characters
    """
    text = text.strip()
    limit = max_length or settings.MAX_TEXT_LENGTH

    if not text:
        raise HTTPException(400, detail=f"{field_name} is required.")

    if len(text) > limit:
        raise HTTPException(
            400,
            detail=f"{field_name} exceeds maximum length of {limit} characters.",
        )

    _reject_control_chars(text, field_name)
    return text


def validate_api_key(key: str, field_name: str) -> str:
    """Validate an API key is present and not suspiciously malformed."""
    key = key.strip()
    if not key:
        raise HTTPException(400, detail=f"{field_name} is required.")
    if len(key) > 256:
        raise HTTPException(400, detail=f"{field_name} is too long.")
    _reject_control_chars(key, field_name)
    return key


def _reject_control_chars(value: str, field_name: str) -> None:
    """Reject null bytes and control characters per §5.1."""
    if "\x00" in value or re.search(r"[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]", value):
        raise HTTPException(
            400,
            detail=f"{field_name} contains invalid characters.",
        )
