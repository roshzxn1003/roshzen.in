"""Rich-based terminal UI printer with consistent colors, tables, and banners."""

from typing import List, Optional
from rich.console import Console
from rich.panel import Panel
from rich.progress import (
    BarColumn,
    DownloadColumn,
    Progress,
    SpinnerColumn,
    TextColumn,
    TimeRemainingColumn,
    TransferSpeedColumn,
)
from rich.table import Table
from rich.text import Text

from ..downloader.formats import FormatInfo, VideoMetadata
from ..utils.formatters import format_bytes, format_number, format_seconds

# Terminal console singleton
console = Console()


def print_banner() -> None:
    """Print the exact ASCII banner matching the portfolio terminal specification."""
    banner_text = (
        "[bold red]╔══════════════════════════════════════════╗[/bold red]\n"
        "[bold red]║[/bold red]              [bold white]YT-CLI DOWNLOADER[/bold white]           [bold red]║[/bold red]\n"
        "[bold red]║[/bold red]          [dim]Python • yt-dlp • CLI[/dim]           [bold red]║[/bold red]\n"
        "[bold red]╚══════════════════════════════════════════╝[/bold red]"
    )
    console.print(banner_text)


def print_success(message: str) -> None:
    """Print a success message with green checkmark."""
    console.print(f"[bold green]✓[/bold green] [white]{message}[/white]")


def print_error(message: str, details: Optional[str] = None) -> None:
    """Print a formatted error message."""
    console.print(f"[bold red]✗ Error:[/bold red] [white]{message}[/white]")
    if details:
        console.print(f"  [dim red]{details}[/dim red]")


def print_warning(message: str) -> None:
    """Print a yellow warning message."""
    console.print(f"[bold yellow]![/bold yellow] [yellow]{message}[/yellow]")


def print_info(message: str) -> None:
    """Print a cyan informational message."""
    console.print(f"[bold cyan]ℹ[/bold cyan] [slate]{message}[/slate]")


def print_video_card(meta: VideoMetadata) -> None:
    """Display clean video overview card."""
    grid = Table.grid(padding=(0, 2))
    grid.add_column(style="bold red", justify="right")
    grid.add_column(style="white")

    grid.add_row("Title:", meta.title)
    grid.add_row("Channel:", meta.channel)
    grid.add_row("Duration:", meta.duration_formatted)
    if meta.view_count:
        grid.add_row("Views:", format_number(meta.view_count))
    if meta.upload_date:
        grid.add_row("Uploaded:", meta.upload_date)

    panel = Panel(grid, title="[bold red]Video Overview[/bold red]", border_style="red", expand=False)
    console.print(panel)


def print_formats_table(formats: List[FormatInfo]) -> None:
    """Display clean format table with ID, Resolution, Codec, and Size."""
    table = Table(
        title="Available Formats",
        title_style="bold red",
        header_style="bold cyan",
        border_style="dim red",
        show_lines=False,
    )

    table.add_column("ID", style="bold yellow", justify="right")
    table.add_column("Type", style="white")
    table.add_column("Resolution", style="green", justify="right")
    table.add_column("FPS", style="dim", justify="right")
    table.add_column("V-Codec", style="slate_blue")
    table.add_column("A-Codec", style="magenta")
    table.add_column("Approx Size", style="bold white", justify="right")

    # Filter down to interesting formats to prevent flooding 100 rows
    interesting = []
    seen = set()
    for f in formats:
        key = (f.resolution, f.ext, f.is_muxed)
        if key not in seen:
            seen.add(key)
            interesting.append(f)

    for f in interesting[:30]:
        table.add_row(
            f.format_id,
            f.stream_type,
            f.resolution,
            str(f.fps) if f.fps else "-",
            f.vcodec if f.vcodec != "none" else "-",
            f.acodec if f.acodec != "none" else "-",
            f.filesize_formatted,
        )

    console.print(table)


def print_search_results(results: List[dict]) -> None:
    """Display numbered list of search results."""
    console.print("\n[bold red]Search Results:[/bold red]")
    for idx, item in enumerate(results, 1):
        dur = format_seconds(item.get("duration"))
        console.print(
            f"[bold red][{idx}][/bold red] [bold white]{item['title']}[/bold white]\n"
            f"    [dim]Channel:[/dim] {item['channel']}  •  [dim]Duration:[/dim] {dur}\n"
        )


def print_history_table(records: List[dict]) -> None:
    """Display download history table."""
    if not records:
        console.print("[dim]No download history found.[/dim]")
        return

    table = Table(
        title="Download History",
        title_style="bold red",
        header_style="bold cyan",
        border_style="dim red",
    )

    table.add_column("ID", style="bold yellow")
    table.add_column("Date", style="dim")
    table.add_column("Type", style="green")
    table.add_column("Quality", style="cyan")
    table.add_column("Title", style="white", max_width=40, overflow="ellipsis")
    table.add_column("Status", style="bold")

    for r in records:
        ts = r.get("timestamp", "")[:10]
        status = r.get("status", "completed")
        status_styled = f"[green]{status}[/green]" if status == "completed" else f"[red]{status}[/red]"
        table.add_row(
            r.get("id", ""),
            ts,
            r.get("media_type", "video"),
            r.get("quality", "best"),
            r.get("title", ""),
            status_styled,
        )

    console.print(table)


def create_progress_bar() -> Progress:
    """Create Rich progress bar for tracking downloads smoothly."""
    return Progress(
        SpinnerColumn(spinner_name="dots", style="red"),
        TextColumn("[bold red]{task.description}[/bold red]"),
        BarColumn(bar_width=30, style="dim red", complete_style="bold red"),
        TextColumn("[bold white]{task.percentage:>3.0f}%[/bold white]"),
        DownloadColumn(),
        TransferSpeedColumn(),
        TimeRemainingColumn(),
        console=console,
        transient=False,
    )
