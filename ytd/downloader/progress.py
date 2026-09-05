"""Progress hook adapter translating raw yt-dlp callbacks into structured events."""

from dataclasses import dataclass
from typing import Callable, Optional

from ..utils.formatters import format_bytes, format_seconds, format_speed


@dataclass
class ProgressEvent:
    """Structured progress update emitted during media download."""
    status: str  # 'downloading', 'finished', 'error'
    percent: float  # 0.0 - 100.0
    downloaded_bytes: int
    total_bytes: int
    speed_bytes_per_sec: Optional[float]
    eta_seconds: Optional[int]
    filename: str

    @property
    def percent_str(self) -> str:
        return f"{self.percent:.1f}%"

    @property
    def downloaded_str(self) -> str:
        return format_bytes(self.downloaded_bytes)

    @property
    def total_str(self) -> str:
        return format_bytes(self.total_bytes) if self.total_bytes > 0 else "Unknown size"

    @property
    def speed_str(self) -> str:
        return format_speed(self.speed_bytes_per_sec)

    @property
    def eta_str(self) -> str:
        return format_seconds(self.eta_seconds)


ProgressCallback = Callable[[ProgressEvent], None]


def create_progress_hook(callback: Optional[ProgressCallback]) -> Callable[[dict], None]:
    """Create a yt-dlp progress_hook function that parses raw dictionary updates
    and forwards clean ProgressEvent objects to the caller's callback.
    """
    def hook(d: dict) -> None:
        if not callback:
            return

        status = d.get("status", "downloading")
        downloaded = d.get("downloaded_bytes", 0)
        total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0

        percent = 0.0
        if total > 0:
            percent = (downloaded / total) * 100.0
        elif d.get("_percent_str"):
            try:
                # Strip ANSI colors and percent symbol if present
                clean_pct = d["_percent_str"].replace("%", "").strip()
                percent = float(clean_pct)
            except ValueError:
                percent = 0.0

        filename = d.get("filename", "")

        event = ProgressEvent(
            status=status,
            percent=min(percent, 100.0),
            downloaded_bytes=downloaded,
            total_bytes=total,
            speed_bytes_per_sec=d.get("speed"),
            eta_seconds=d.get("eta"),
            filename=filename,
        )

        try:
            callback(event)
        except Exception:
            # Prevent user callback exceptions from crashing yt-dlp internal thread
            pass

    return hook
