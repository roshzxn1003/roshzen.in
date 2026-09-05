"""Command handler for displaying video metadata without downloading."""

from typing import Any

from ..cli.printer import console, print_error, print_video_card
from ..core.constants import EXIT_ERROR, EXIT_SUCCESS
from ..core.exceptions import YtdError
from ..utils.formatters import format_bytes
from .base import BaseCommand


class InfoCommand(BaseCommand):
    """Fetches and displays video metadata in a structured, readable format."""

    def execute(self, url: str, **kwargs: Any) -> int:
        try:
            with console.status("[bold red]Fetching video information...[/bold red]", spinner="dots"):
                metadata = self.service.get_video_info(url)

            print_video_card(metadata)

            # Available resolutions summary
            muxed = metadata.get_muxed_formats()
            v_formats = metadata.get_video_formats()
            a_formats = metadata.get_audio_formats()

            res_set = sorted(
                list({f.resolution for f in v_formats if f.resolution != "N/A"}),
                key=lambda r: int(r.replace("p", "")) if r.replace("p", "").isdigit() else 0,
                reverse=True,
            )

            console.print("\n[bold red]Available Resolutions:[/bold red] " + ", ".join(f"[white]{r}[/white]" for r in res_set))
            console.print("[bold red]Standalone Audio Streams:[/bold red] " + f"{len(a_formats)} available")
            if not self.service.has_ffmpeg and muxed:
                console.print(f"[dim yellow]Note: Direct pre-muxed single-file streams: {len(muxed)}[/dim yellow]")

            return EXIT_SUCCESS
        except YtdError as e:
            print_error(e.message, e.details)
            return EXIT_ERROR
        except Exception as e:
            print_error(f"Unexpected error: {e}")
            return EXIT_ERROR
