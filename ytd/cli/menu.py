"""Interactive terminal menu matching the portfolio terminal specification."""

import sys
from typing import Optional

from ..downloader.service import YouTubeDownloaderService
from .printer import console, print_banner, print_error, print_info


def run_interactive_menu(service: YouTubeDownloaderService) -> int:
    """Launch the interactive menu interface when 'ytd' is run without arguments."""
    from ..commands.download_cmd import DownloadCommand
    from ..commands.info_cmd import InfoCommand

    print_banner()

    while True:
        console.print("\n[bold red][1][/bold red] [white]Video Information[/white]")
        console.print("[bold red][2][/bold red] [white]Download Video[/white]")
        console.print("[bold red][3][/bold red] [white]Download Audio[/white]")
        console.print("[bold red][4][/bold red] [white]Back[/white]\n")

        try:
            choice = console.input("[bold red]Select option: [/bold red]").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n\n[dim]Returning to terminal...[/dim]\n")
            return 0

        if choice == "1":
            try:
                url = console.input("[bold cyan]Enter Video URL: [/bold cyan]").strip()
                if url:
                    cmd = InfoCommand(service)
                    cmd.execute(url=url)
            except (KeyboardInterrupt, EOFError):
                console.print("\n[dim]Action cancelled.[/dim]")

        elif choice == "2":
            try:
                url = console.input("[bold cyan]Enter Video URL: [/bold cyan]").strip()
                if url:
                    console.print("[dim]Select Quality: 1) Best  2) 1080p  3) 720p  4) 480p  5) 360p [Default: 720p][/dim]")
                    q_choice = console.input("[bold cyan]Quality (1-5 or press Enter): [/bold cyan]").strip()
                    q_map = {"1": "best", "2": "1080p", "3": "720p", "4": "480p", "5": "360p"}
                    quality = q_map.get(q_choice, "720p")
                    cmd = DownloadCommand(service)
                    cmd.execute(url=url, media_type="video", quality=quality)
            except (KeyboardInterrupt, EOFError):
                console.print("\n[dim]Action cancelled.[/dim]")

        elif choice == "3":
            try:
                url = console.input("[bold cyan]Enter Video URL: [/bold cyan]").strip()
                if url:
                    console.print("[dim]Select Audio Format: 1) MP3 (Universal)  2) M4A (AAC)  3) Best [Default: MP3][/dim]")
                    a_choice = console.input("[bold cyan]Format (1-3 or press Enter): [/bold cyan]").strip()
                    a_map = {"1": "mp3", "2": "m4a", "3": "best"}
                    fmt = a_map.get(a_choice, "mp3")
                    cmd = DownloadCommand(service)
                    cmd.execute(url=url, media_type="audio", audio_format=fmt)
            except (KeyboardInterrupt, EOFError):
                console.print("\n[dim]Action cancelled.[/dim]")

        elif choice == "4":
            console.print("\n[dim]Returning to terminal...[/dim]\n")
            return 0

        else:
            print_error(f"Invalid option: '{choice}'. Please select 1, 2, 3, or 4.")
