"""Cross-platform operating system, filesystem, and external dependency checks."""

import os
from pathlib import Path
import re
import shutil


def is_ffmpeg_available() -> bool:
    """Check whether FFmpeg binary is installed and accessible via PATH,
    auto-discovering static-ffmpeg or local venv bins if not globally present.
    """
    if shutil.which("ffmpeg"):
        return True

    # 1. Check if static_ffmpeg is available and register its path
    try:
        import static_ffmpeg
        static_ffmpeg.add_paths()
        if shutil.which("ffmpeg"):
            return True
    except Exception:
        pass

    # 2. Check current workspace venv/bin
    venv_ffmpeg = Path(__file__).resolve().parent.parent.parent / ".venv" / "bin" / "ffmpeg"
    if venv_ffmpeg.exists():
        os.environ["PATH"] = f"{venv_ffmpeg.parent}:{os.environ.get('PATH', '')}"
        return True

    return False


def get_free_disk_space(target_dir: Path | str) -> int:
    """Return available free disk space in bytes for the specified directory."""
    path = Path(target_dir).expanduser().resolve()
    # Find existing parent if path doesn't exist yet
    while not path.exists() and path != path.parent:
        path = path.parent
    try:
        usage = shutil.disk_usage(path)
        return usage.free
    except (OSError, ValueError):
        return 0


def ensure_directory(path: Path | str) -> Path:
    """Ensure a directory exists, creating parents if necessary, and return resolved Path."""
    target = Path(path).expanduser().resolve()
    target.mkdir(parents=True, exist_ok=True)
    return target


def sanitize_filename(name: str) -> str:
    """Remove illegal characters from string to make it safe for Linux and Windows filenames."""
    # Replace invalid chars: <>:"/\|?* and control characters
    cleaned = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", name)
    # Strip leading/trailing spaces and dots
    cleaned = cleaned.strip(" .")
    return cleaned or "untitled"
