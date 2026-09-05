"""Command handler for downloading video and audio media."""

from pathlib import Path
from typing import Any, Optional

from ..cli.printer import console, create_progress_bar, print_error, print_success, print_video_card, print_warning
from ..config.manager import config
from ..core.constants import EXIT_ERROR, EXIT_INTERRUPT, EXIT_SUCCESS
from ..core.exceptions import YtdError
from ..downloader.progress import ProgressEvent
from ..history.manager import history
from ..utils.formatters import format_bytes
from .base import BaseCommand


class DownloadCommand(BaseCommand):
    """Orchestrates video and audio downloads with rich terminal progress reporting."""

    def execute(
        self,
        url: str,
        media_type: str = "video",
        quality: Optional[str] = None,
        audio_format: Optional[str] = None,
        output_dir: Optional[str] = None,
        cookies_file: Optional[str] = None,
        **kwargs: Any,
    ) -> int:
        target_dir = Path(output_dir).expanduser() if output_dir else config.get_download_path()
        selected_quality = quality or config.get("default_quality", "720p")
        selected_audio_format = audio_format or config.get("default_audio_format", "mp3")

        # Step 1: Fetch and display overview
        try:
            with console.status("[bold red]Connecting to YouTube...[/bold red]", spinner="dots"):
                metadata = self.service.get_video_info(url, cookies_file=cookies_file)

            print_video_card(metadata)

            if media_type == "video":
                console.print(f"[bold cyan]Media Target:[/bold cyan] Video [white]({selected_quality})[/white]")
            else:
                console.print(f"[bold cyan]Media Target:[/bold cyan] Audio [white]({selected_audio_format})[/white]")

            console.print(f"[bold cyan]Download Directory:[/bold cyan] [dim]{target_dir}[/dim]\n")

        except YtdError as e:
            print_error(e.message, e.details)
            return EXIT_ERROR
        except KeyboardInterrupt:
            console.print("\n[yellow]Operation cancelled by user.[/yellow]")
            return EXIT_INTERRUPT

        # Step 2: Initialize Progress Bar and Download Hook
        progress = create_progress_bar()
        task_id = progress.add_task(f"Downloading {metadata.title[:35]}...", total=100)

        def on_progress(event: ProgressEvent) -> None:
            if event.total_bytes > 0:
                progress.update(
                    task_id,
                    completed=event.percent,
                    total=100,
                    description=f"[bold red]Downloading {event.percent_str}[/bold red]",
                )

        # Step 3: Run download
        try:
            with progress:
                if media_type == "video":
                    result = self.service.download_video(
                        url=url,
                        quality=selected_quality,
                        output_dir=target_dir,
                        progress_callback=on_progress,
                        cookies_file=cookies_file,
                    )
                else:
                    result = self.service.download_audio(
                        url=url,
                        audio_format=selected_audio_format,
                        output_dir=target_dir,
                        progress_callback=on_progress,
                        cookies_file=cookies_file,
                    )

            final_path = result.get("path", "")
            file_size = result.get("size")

            print_success(f"Download complete! Saved to:")
            console.print(f"  [bold white]{final_path}[/bold white]")
            if file_size:
                console.print(f"  [dim]Size: {format_bytes(file_size)}[/dim]")

            # Record in history
            history.add_record(
                url=url,
                title=metadata.title,
                media_type=media_type,
                quality=selected_quality if media_type == "video" else selected_audio_format,
                output_path=str(final_path),
                file_size=file_size,
                status="completed",
            )

            return EXIT_SUCCESS

        except KeyboardInterrupt:
            progress.stop()
            console.print("\n[yellow]Download interrupted by user.[/yellow]")
            history.add_record(
                url=url,
                title=metadata.title,
                media_type=media_type,
                quality=selected_quality if media_type == "video" else selected_audio_format,
                output_path="",
                status="interrupted",
            )
            return EXIT_INTERRUPT
        except YtdError as e:
            progress.stop()
            print_error(e.message, e.details)
            history.add_record(
                url=url,
                title=metadata.title,
                media_type=media_type,
                quality=selected_quality if media_type == "video" else selected_audio_format,
                output_path="",
                status="failed",
                error=str(e),
            )
            return EXIT_ERROR
        except Exception as e:
            progress.stop()
            print_error(f"Unexpected download error: {e}")
            return EXIT_ERROR
