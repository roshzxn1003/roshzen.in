"""Application-wide constants, configuration paths, and default settings."""

from pathlib import Path
import re

APP_NAME = "ytd"
APP_DISPLAY_NAME = "YTD — YouTube Downloader"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "A modular, professional YouTube media downloader built in Python with yt-dlp and Rich."

# Filesystem Paths
HOME_DIR = Path.home()
CONFIG_DIR = HOME_DIR / ".config" / APP_NAME
CONFIG_FILE = CONFIG_DIR / "config.json"
HISTORY_FILE = CONFIG_DIR / "history.json"
LOG_FILE = CONFIG_DIR / "ytd.log"
DEFAULT_DOWNLOAD_DIR = HOME_DIR / "Downloads" / "YTD"

# URL Patterns
YOUTUBE_VIDEO_REGEX = re.compile(
    r"^(https?://)?(www\.)?(youtube\.com/(watch\?.*v=|shorts/|embed/|v/)|youtu\.be/)([\w-]{11})",
    re.IGNORECASE,
)
YOUTUBE_PLAYLIST_REGEX = re.compile(
    r"[?&]list=([a-zA-Z0-9_-]+)",
    re.IGNORECASE,
)

# Supported Video Qualities & Formats
VIDEO_QUALITIES = ["best", "1080p", "720p", "480p", "360p"]
AUDIO_FORMATS = ["mp3", "m4a", "best", "original"]

# Default Configuration Dictionary
DEFAULT_CONFIG = {
    "download_dir": str(DEFAULT_DOWNLOAD_DIR),
    "default_quality": "720p",
    "default_audio_format": "mp3",
    "filename_template": "%(title)s.%(ext)s",
    "overwrite": False,
    "max_retries": 3,
    "concurrent_fragments": 4,
}

# Process Exit Codes
EXIT_SUCCESS = 0
EXIT_ERROR = 1
EXIT_INTERRUPT = 130
