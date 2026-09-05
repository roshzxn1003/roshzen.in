"""CLI argument parser definition with full subcommand routing."""

import argparse
from typing import List, Optional

from ..core.constants import APP_DESCRIPTION, APP_DISPLAY_NAME, APP_VERSION, AUDIO_FORMATS, VIDEO_QUALITIES


def build_parser() -> argparse.ArgumentParser:
    common_parser = argparse.ArgumentParser(add_help=False)
    common_parser.add_argument("--debug", action="store_true", help="Enable verbose debug logging")
    common_parser.add_argument("--cookies", type=str, metavar="FILE", help="Path to cookies.txt for authenticated access")
    common_parser.add_argument("--dir", type=str, metavar="PATH", help="Custom destination folder for downloads")

    parser = argparse.ArgumentParser(
        prog="ytd",
        parents=[common_parser],
        description=f"{APP_DISPLAY_NAME} v{APP_VERSION} — Modular YouTube Media Downloader",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  ytd                                    Launch interactive menu\n"
            "  ytd https://youtu.be/VIDEO_ID          Download video (default quality)\n"
            "  ytd info https://youtu.be/VIDEO_ID     Inspect video metadata\n"
            "  ytd formats https://youtu.be/VIDEO_ID  View all available stream formats\n"
            "  ytd video https://youtu.be/... -q 1080p Download video at specific quality\n"
            "  ytd audio https://youtu.be/... -f mp3  Download audio track\n"
            "  ytd search \"python tutorial\"           Search and select a video\n"
            "  ytd playlist https://youtube.com/...   Batch download playlist\n"
            "  ytd history                            View recent downloads\n"
            "  ytd config                             Inspect persistent settings\n"
        ),
    )

    parser.add_argument("-v", "--version", action="version", version=f"{APP_DISPLAY_NAME} v{APP_VERSION}")

    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Subcommand: info
    info_p = subparsers.add_parser("info", parents=[common_parser], help="Fetch and display video information without downloading")
    info_p.add_argument("url", type=str, help="YouTube video URL")

    # Subcommand: formats
    fmt_p = subparsers.add_parser("formats", parents=[common_parser], help="List all available resolution, audio, and container formats")
    fmt_p.add_argument("url", type=str, help="YouTube video URL")

    # Subcommand: video
    vid_p = subparsers.add_parser("video", parents=[common_parser], help="Download video at chosen resolution")
    vid_p.add_argument("url", type=str, help="YouTube video URL")
    vid_p.add_argument("-q", "--quality", choices=VIDEO_QUALITIES, default=None, help="Video resolution")

    # Subcommand: audio
    aud_p = subparsers.add_parser("audio", parents=[common_parser], help="Download audio track")
    aud_p.add_argument("url", type=str, help="YouTube video URL")
    aud_p.add_argument("-f", "--format", choices=AUDIO_FORMATS, default="mp3", help="Audio format (default: mp3)")

    # Subcommand: search
    srch_p = subparsers.add_parser("search", parents=[common_parser], help="Search YouTube and interactively select a video to download")
    srch_p.add_argument("query", type=str, help="Search terms")
    srch_p.add_argument("-l", "--limit", type=int, default=5, help="Number of search results to return (default: 5)")
    srch_p.add_argument("-q", "--quality", choices=VIDEO_QUALITIES, default=None, help="Desired video quality")

    # Subcommand: playlist
    pl_p = subparsers.add_parser("playlist", parents=[common_parser], help="Download YouTube playlist items sequentially")
    pl_p.add_argument("url", type=str, help="YouTube playlist URL")
    pl_p.add_argument("-q", "--quality", choices=VIDEO_QUALITIES, default=None, help="Desired video quality")

    # Subcommand: history
    hist_p = subparsers.add_parser("history", parents=[common_parser], help="Inspect local download history")
    hist_p.add_argument("--clear", action="store_true", help="Clear all stored download history records")
    hist_p.add_argument("-l", "--limit", type=int, default=25, help="Maximum records to display (default: 25)")

    # Subcommand: config
    cfg_p = subparsers.add_parser("config", parents=[common_parser], help="View or modify persistent configuration settings")
    cfg_p.add_argument("--set", type=str, metavar="KEY=VAL", help="Set a configuration key (e.g. default_quality=1080p)")
    cfg_p.add_argument("--get", type=str, metavar="KEY", help="Get a single configuration setting value")
    cfg_p.add_argument("--reset", action="store_true", help="Reset configuration back to default values")

    # Subcommand: download
    dl_p = subparsers.add_parser("download", parents=[common_parser], help="Download video directly")
    dl_p.add_argument("url", type=str, help="YouTube video URL")
    dl_p.add_argument("-q", "--quality", choices=VIDEO_QUALITIES, default=None, help="Video resolution")

    return parser


def parse_cli_args(parser: argparse.ArgumentParser, argv: Optional[List[str]] = None):
    """Normalize argv to support direct URLs (e.g. 'ytd https://...') without subcommands."""
    import sys
    from ..downloader.validators import is_valid_youtube_url

    raw_args = list(sys.argv[1:] if argv is None else argv)
    KNOWN_COMMANDS = {"info", "formats", "video", "audio", "search", "playlist", "history", "config", "download"}

    # If first positional argument is a URL, route it to 'video'
    for i, arg in enumerate(raw_args):
        if not arg.startswith("-"):
            if arg not in KNOWN_COMMANDS and (is_valid_youtube_url(arg) or "://" in arg):
                raw_args.insert(i, "video")
            break

    return parser.parse_args(raw_args)
