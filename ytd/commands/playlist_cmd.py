"""Command handler for batch playlist downloading."""

from pathlib import Path
from typing import Any, Optional

from ..cli.printer import console, print_error, print_info, print_success, print_warning
from ..config.manager import config
from ..core.constants import EXIT_ERROR, EXIT_INTERRUPT, EXIT_SUCCESS
from ..core.exceptions import YtdError
from ..history.manager import history
from .base import BaseCommand


class PlaylistCommand(BaseCommand):
    """Processes playlists sequentially, downloading items and logging batch summaries."""

    def execute(
        self,
        url: str,
        media_type: str = "video",
        quality: Optional[str] = None,
        output_dir: Optional[str] = None,
        **kwargs: Any,
    ) -> int:
        target_dir = Path(output_dir).expanduser() if output_dir else config.get_download_path()
        selected_quality = quality or config.get("default_quality", "720p")

        try:
            with console.status("[bold red]Analyzing playlist...[/bold red]", spinner="dots"):
                playlist_info = self.service.get_playlist_info(url)

            items = playlist_info.get("items", [])
            total = len(items)

            console.print(f"\n[bold red]Playlist:[/bold red] [white]{playlist_info.get('title')}[/white]")
            console.print(f"[bold red]Total Items:[/bold red] {total}\n")

            if total == 0:
                print_warning("No videos found in this playlist.")
                return EXIT_SUCCESS

            completed_count = 0
            failed_count = 0

            for idx, item in enumerate(items, 1):
                item_url = item.get("url")
                item_title = item.get("title", f"Video {idx}")

                console.print(f"[bold cyan][{idx}/{total}][/bold cyan] [bold white]{item_title}[/bold white]")

                try:
                    if media_type == "video":
                        self.service.download_video(
                            url=item_url,
                            quality=selected_quality,
                            output_dir=target_dir,
                        )
                    else:
                        self.service.download_audio(
                            url=item_url,
                            output_dir=target_dir,
                        )
                    completed_count += 1
                    print_success(f"Finished item {idx}")

                    history.add_record(
                        url=item_url,
                        title=item_title,
                        media_type=media_type,
                        quality=selected_quality,
                        output_path=str(target_dir),
                        status="completed",
                    )
                except KeyboardInterrupt:
                    console.print("\n[yellow]Playlist download paused by user.[/yellow]")
                    return EXIT_INTERRUPT
                except Exception as e:
                    failed_count += 1
                    print_warning(f"Skipping unavailable item ({e})")
                    history.add_record(
                        url=item_url,
                        title=item_title,
                        media_type=media_type,
                        quality=selected_quality,
                        output_path="",
                        status="failed",
                        error=str(e),
                    )

            console.print("\n[bold red]=== Playlist Summary ===[/bold red]")
            console.print(f"✓ Completed: [green]{completed_count}[/green]")
            if failed_count > 0:
                console.print(f"! Skipped/Failed: [yellow]{failed_count}[/yellow]")

            return EXIT_SUCCESS
        except YtdError as e:
            print_error(e.message, e.details)
            return EXIT_ERROR
        except Exception as e:
            print_error(f"Unexpected playlist error: {e}")
            return EXIT_ERROR
