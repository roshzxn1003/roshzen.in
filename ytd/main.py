"""Main execution entry point for the YTD command-line application."""

import logging
import sys
import traceback
from typing import Optional, Sequence

from .cli.menu import run_interactive_menu
from .cli.parser import build_parser
from .cli.printer import console, print_error
from .commands.config_cmd import ConfigCommand
from .commands.download_cmd import DownloadCommand
from .commands.formats_cmd import FormatsCommand
from .commands.history_cmd import HistoryCommand
from .commands.info_cmd import InfoCommand
from .commands.playlist_cmd import PlaylistCommand
from .commands.search_cmd import SearchCommand
from .core.constants import EXIT_ERROR, EXIT_INTERRUPT, EXIT_SUCCESS, LOG_FILE
from .core.exceptions import YtdError
from .downloader.service import YouTubeDownloaderService
from .utils.system import ensure_directory


def configure_logging(debug: bool = False) -> None:
    """Setup application logging."""
    ensure_directory(LOG_FILE.parent)
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        filename=str(LOG_FILE),
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )


def main(argv: Optional[Sequence[str]] = None) -> int:
    """Main CLI entry point coordinating parsing, services, and command dispatch."""
    from .cli.parser import parse_cli_args
    parser = build_parser()
    args = parse_cli_args(parser, list(argv) if argv is not None else None)

    configure_logging(debug=args.debug)
    service = YouTubeDownloaderService(debug=args.debug)

    try:
        # 1. No arguments: launch interactive menu
        raw_args = sys.argv[1:] if argv is None else list(argv)
        if not raw_args and not args.command:
            return run_interactive_menu(service)

        # 2. Subcommand dispatch
        if args.command in ("video", "download"):
            cmd = DownloadCommand(service)
            return cmd.execute(
                url=args.url,
                media_type="video",
                quality=args.quality,
                output_dir=args.dir,
                cookies_file=args.cookies,
            )

        elif args.command == "info":
            cmd = InfoCommand(service)
            return cmd.execute(url=args.url)

        elif args.command == "formats":
            cmd = FormatsCommand(service)
            return cmd.execute(url=args.url)

        elif args.command == "video":
            cmd = DownloadCommand(service)
            return cmd.execute(
                url=args.url,
                media_type="video",
                quality=args.quality,
                output_dir=args.dir,
                cookies_file=args.cookies,
            )

        elif args.command == "audio":
            cmd = DownloadCommand(service)
            return cmd.execute(
                url=args.url,
                media_type="audio",
                audio_format=args.format,
                output_dir=args.dir,
                cookies_file=args.cookies,
            )

        elif args.command == "playlist":
            cmd = PlaylistCommand(service)
            return cmd.execute(
                url=args.url,
                quality=args.quality,
                output_dir=args.dir,
            )

        elif args.command == "search":
            cmd = SearchCommand(service)
            return cmd.execute(
                query=args.query,
                limit=args.limit,
                quality=args.quality,
            )

        elif args.command == "history":
            cmd = HistoryCommand(service)
            return cmd.execute(
                clear=args.clear,
                limit=args.limit,
            )

        elif args.command == "config":
            cmd = ConfigCommand(service)
            return cmd.execute(
                set_val=args.set,
                get_val=args.get,
                reset=args.reset,
            )

        # If nothing matched, show help
        parser.print_help()
        return EXIT_SUCCESS

    except KeyboardInterrupt:
        console.print("\n[yellow]Operation aborted by user.[/yellow]")
        return EXIT_INTERRUPT
    except YtdError as e:
        print_error(e.message, e.details)
        if args.debug:
            console.print("[dim red]" + traceback.format_exc() + "[/dim red]")
        return EXIT_ERROR
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        if args.debug:
            console.print("[dim red]" + traceback.format_exc() + "[/dim red]")
        return EXIT_ERROR


if __name__ == "__main__":
    sys.exit(main())
