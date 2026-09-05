"""Command handler for listing available media formats and qualities."""

from typing import Any

from ..cli.printer import console, print_error, print_formats_table
from ..core.constants import EXIT_ERROR, EXIT_SUCCESS
from ..core.exceptions import YtdError
from .base import BaseCommand


class FormatsCommand(BaseCommand):
    """Retrieves and lists all video and audio stream formats for a given URL."""

    def execute(self, url: str, **kwargs: Any) -> int:
        try:
            with console.status("[bold red]Fetching available formats...[/bold red]", spinner="dots"):
                metadata = self.service.get_video_info(url)

            if not metadata.formats:
                console.print("[yellow]No stream formats discovered for this video.[/yellow]")
                return EXIT_SUCCESS

            print_formats_table(metadata.formats)

            if not self.service.has_ffmpeg:
                console.print("\n[dim yellow]Note: Streams marked 'Video + Audio' can be downloaded directly without FFmpeg.[/dim yellow]")

            return EXIT_SUCCESS
        except YtdError as e:
            print_error(e.message, e.details)
            return EXIT_ERROR
        except Exception as e:
            print_error(f"Unexpected error: {e}")
            return EXIT_ERROR
