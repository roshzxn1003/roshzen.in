"""Command handler for searching YouTube and selecting a video to download."""

from typing import Any, Optional

from ..cli.printer import console, print_error, print_search_results, print_warning
from ..core.constants import EXIT_ERROR, EXIT_INTERRUPT, EXIT_SUCCESS
from ..core.exceptions import YtdError
from .base import BaseCommand
from .download_cmd import DownloadCommand


class SearchCommand(BaseCommand):
    """Searches YouTube, displays top matches, and prompts for selection to download."""

    def execute(self, query: str, limit: int = 5, quality: Optional[str] = None, **kwargs: Any) -> int:
        try:
            with console.status(f"[bold red]Searching YouTube for '[white]{query}[/white]'...[/bold red]", spinner="dots"):
                results = self.service.search_videos(query=query, max_results=limit)

            if not results:
                print_warning("No matching videos found.")
                return EXIT_SUCCESS

            print_search_results(results)

            # Prompt for interactive selection
            console.print("[dim]Enter number (1-N) to download, or '0' to cancel:[/dim]")
            try:
                choice = console.input("[bold red]Selection ❯ [/bold red]").strip()
            except (KeyboardInterrupt, EOFError):
                console.print("\n[yellow]Search cancelled.[/yellow]")
                return EXIT_INTERRUPT

            if not choice or choice == "0":
                console.print("[yellow]Search cancelled.[/yellow]")
                return EXIT_SUCCESS

            try:
                index = int(choice) - 1
                if 0 <= index < len(results):
                    selected = results[index]
                    console.print(f"\n[bold green]Selected:[/bold green] {selected['title']}\n")
                    downloader = DownloadCommand(self.service)
                    return downloader.execute(url=selected["url"], quality=quality)
                else:
                    print_error("Invalid selection number.")
                    return EXIT_ERROR
            except ValueError:
                print_error("Please enter a valid number.")
                return EXIT_ERROR

        except YtdError as e:
            print_error(e.message, e.details)
            return EXIT_ERROR
        except Exception as e:
            print_error(f"Unexpected search error: {e}")
            return EXIT_ERROR
