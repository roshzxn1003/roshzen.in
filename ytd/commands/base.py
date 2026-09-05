"""Abstract base class for all CLI subcommands."""

from abc import ABC, abstractmethod
from typing import Any

from ..downloader.service import YouTubeDownloaderService


class BaseCommand(ABC):
    """Abstract base class establishing standard command execution interface."""

    def __init__(self, service: YouTubeDownloaderService) -> None:
        self.service = service

    @abstractmethod
    def execute(self, **kwargs: Any) -> int:
        """Execute the command and return a standard process exit code (0 for success)."""
        pass
