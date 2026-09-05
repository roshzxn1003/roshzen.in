"""Formatting helper utilities for human-readable numbers, sizes, and times."""

from typing import Union


def format_bytes(size_bytes: Union[int, float, None]) -> str:
    """Convert an integer number of bytes into human-readable units (e.g. 14.5 MB)."""
    if size_bytes is None or size_bytes < 0:
        return "N/A"

    units = ["B", "KB", "MB", "GB", "TB"]
    size = float(size_bytes)
    unit_idx = 0

    while size >= 1024.0 and unit_idx < len(units) - 1:
        size /= 1024.0
        unit_idx += 1

    return f"{size:.1f} {units[unit_idx]}" if unit_idx > 0 else f"{int(size)} B"


def format_seconds(seconds: Union[int, float, None]) -> str:
    """Format duration in seconds into HH:MM:SS or MM:SS."""
    if seconds is None or seconds < 0:
        return "--:--"

    total_seconds = int(seconds)
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60

    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"


def format_speed(speed_bytes_per_sec: Union[int, float, None]) -> str:
    """Format download transfer rate (e.g. 3.2 MB/s)."""
    if speed_bytes_per_sec is None or speed_bytes_per_sec <= 0:
        return "-- B/s"
    return f"{format_bytes(speed_bytes_per_sec)}/s"


def format_number(num: Union[int, float, None]) -> str:
    """Format integer counts like view count into 1.2M, 45.3K, etc."""
    if num is None:
        return "N/A"
    n = float(num)
    if n >= 1_000_000_000:
        return f"{n / 1_000_000_000:.1f}B"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.1f}K"
    return str(int(n))
