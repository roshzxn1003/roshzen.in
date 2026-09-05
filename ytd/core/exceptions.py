"""Custom exception hierarchy for the YTD application.

Separating exceptions allows the CLI and API layers to catch specific errors
and present clear, friendly messages without showing raw stack traces to users.
"""


class YtdError(Exception):
    """Base exception for all YTD errors."""

    def __init__(self, message: str, details: str = "") -> None:
        super().__init__(message)
        self.message = message
        self.details = details

    def __str__(self) -> str:
        if self.details:
            return f"{self.message} ({self.details})"
        return self.message


class ValidationError(YtdError):
    """Raised when URL or user input fails validation."""
    pass


class NetworkError(YtdError):
    """Raised when internet connectivity or YouTube server errors occur."""
    pass


class MediaUnavailableError(YtdError):
    """Raised when a video is private, deleted, restricted, or unavailable."""
    pass


class FormatNotAvailableError(YtdError):
    """Raised when a requested video/audio format is not available."""
    pass


class DependencyError(YtdError):
    """Raised when an external tool (e.g. FFmpeg) is missing for a requested task."""
    pass


class DownloadCancelledError(YtdError):
    """Raised when the user interrupts or cancels a download."""
    pass
