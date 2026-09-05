"""Validation and normalization logic for YouTube URLs."""

from typing import Optional
from urllib.parse import parse_qs, urlparse

from ..core.constants import YOUTUBE_PLAYLIST_REGEX, YOUTUBE_VIDEO_REGEX
from ..core.exceptions import ValidationError


def is_valid_youtube_url(url: str) -> bool:
    """Return True if the URL matches standard YouTube video or playlist patterns."""
    if not url or not isinstance(url, str):
        return False
    clean = url.strip()
    return bool(YOUTUBE_VIDEO_REGEX.search(clean) or YOUTUBE_PLAYLIST_REGEX.search(clean))


def is_playlist_url(url: str) -> bool:
    """Check if the URL contains a playlist identifier."""
    if not url or not isinstance(url, str):
        return False
    return bool(YOUTUBE_PLAYLIST_REGEX.search(url.strip()))


def extract_video_id(url: str) -> Optional[str]:
    """Extract the standard 11-character YouTube video ID, if present."""
    if not url:
        return None
    match = YOUTUBE_VIDEO_REGEX.search(url.strip())
    if match:
        return match.group(5)
    return None


def extract_playlist_id(url: str) -> Optional[str]:
    """Extract the playlist ID, if present."""
    if not url:
        return None
    match = YOUTUBE_PLAYLIST_REGEX.search(url.strip())
    if match:
        return match.group(1)
    return None


def clean_youtube_url(url: str) -> str:
    """Normalize YouTube URL and remove extraneous query tracking params."""
    if not url:
        return ""
    clean = url.strip()
    vid = extract_video_id(clean)
    pid = extract_playlist_id(clean)

    if is_playlist_url(clean) and not vid:
        return f"https://www.youtube.com/playlist?list={pid}"
    if vid:
        if pid:
            return f"https://www.youtube.com/watch?v={vid}&list={pid}"
        return f"https://www.youtube.com/watch?v={vid}"

    return clean


def validate_or_raise(url: str) -> str:
    """Validate a YouTube URL and return the cleaned string, or raise ValidationError."""
    if not url or not url.strip():
        raise ValidationError("URL cannot be empty. Please provide a YouTube link.")

    cleaned = clean_youtube_url(url)
    if not is_valid_youtube_url(cleaned):
        raise ValidationError(
            f"Invalid YouTube URL: '{url}'",
            "Supported formats include: https://youtube.com/watch?v=... and https://youtu.be/...",
        )
    return cleaned
