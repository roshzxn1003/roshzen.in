"""Core YouTube media downloading and metadata service.

Encapsulates yt-dlp into clean, testable, typed Python methods without leaking
yt-dlp internals or CLI printing logic into other layers.
"""

from pathlib import Path
import shutil
import subprocess
from typing import Any, Callable, Dict, List, Optional
import yt_dlp

from ..core.constants import DEFAULT_CONFIG
from ..core.exceptions import (
    DependencyError,
    FormatNotAvailableError,
    MediaUnavailableError,
    NetworkError,
    ValidationError,
    YtdError,
)
from ..utils.system import ensure_directory, is_ffmpeg_available
from .formats import VideoMetadata, parse_video_metadata
from .progress import ProgressCallback, create_progress_hook
from .validators import clean_youtube_url, is_valid_youtube_url, validate_or_raise


class YouTubeDownloaderService:
    """Core service for extracting metadata, downloading video/audio, and searching YouTube."""

    def __init__(self, debug: bool = False) -> None:
        self.debug = debug
        self.has_ffmpeg = is_ffmpeg_available()

    def _get_base_ydl_opts(self, cookies_file: Optional[str] = None) -> Dict[str, Any]:
        """Generate base yt-dlp options dictionary."""
        opts: Dict[str, Any] = {
            "quiet": not self.debug,
            "no_warnings": not self.debug,
            "extract_flat": False,
            "nocheckcertificate": False,
            "retries": 3,
            "fragment_retries": 3,
            "no_color": True,
        }
        if is_ffmpeg_available():
            ffmpeg_bin = shutil.which("ffmpeg")
            if ffmpeg_bin:
                opts["ffmpeg_location"] = ffmpeg_bin
        if cookies_file and Path(cookies_file).exists():
            opts["cookiefile"] = str(cookies_file)
        return opts

    def get_video_info(self, url: str, cookies_file: Optional[str] = None) -> VideoMetadata:
        """Fetch metadata for a video without downloading any media streams."""
        validated_url = validate_or_raise(url)
        opts = self._get_base_ydl_opts(cookies_file)
        opts["extract_flat"] = False

        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                raw_info = ydl.extract_info(validated_url, download=False)
                if not raw_info:
                    raise MediaUnavailableError("No video information returned by YouTube.")
                return parse_video_metadata(raw_info)
        except yt_dlp.utils.DownloadError as e:
            msg = str(e)
            if "private" in msg.lower():
                raise MediaUnavailableError("This video is private.", details=msg)
            if "not available" in msg.lower() or "deleted" in msg.lower():
                raise MediaUnavailableError("This video is unavailable or has been removed.", details=msg)
            if "sign in" in msg.lower() or "age" in msg.lower():
                raise MediaUnavailableError("This video is age-restricted or requires authentication.", details=msg)
            if "unable to download" in msg.lower() or "network" in msg.lower():
                raise NetworkError("Network error while connecting to YouTube.", details=msg)
            raise YtdError(f"Failed to fetch video information: {msg}")
        except Exception as e:
            if isinstance(e, YtdError):
                raise
            raise YtdError(f"Unexpected error extracting metadata: {e}")

    def download_video(
        self,
        url: str,
        quality: str = "best",
        output_dir: Optional[Path | str] = None,
        filename_template: Optional[str] = None,
        progress_callback: Optional[ProgressCallback] = None,
        cookies_file: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Download video at requested quality, guaranteeing clean MP4 container output."""
        validated_url = validate_or_raise(url)
        dest_dir = ensure_directory(output_dir or DEFAULT_CONFIG["download_dir"])
        template = filename_template or DEFAULT_CONFIG["filename_template"]
        outtmpl = str(dest_dir / template)

        opts = self._get_base_ydl_opts(cookies_file)
        opts.update({
            "outtmpl": outtmpl,
            "progress_hooks": [create_progress_hook(progress_callback)],
        })

        quality_lower = quality.lower()
        has_ffmpeg = is_ffmpeg_available()

        if has_ffmpeg:
            # Prioritize MP4 streams with fallback to any best video+audio, remuxing into standard MP4
            if quality_lower == "best":
                opts["format"] = "bv*[ext=mp4]+ba[ext=m4a]/bv*[ext=mp4]+ba/bv*+ba[ext=m4a]/bv*+ba/b[ext=mp4]/b"
            elif quality_lower == "1080p":
                opts["format"] = "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/bv*[height<=1080]+ba/b[height<=1080]/bv*+ba/b"
            elif quality_lower == "720p":
                opts["format"] = "bv*[height<=720][ext=mp4]+ba[ext=m4a]/bv*[height<=720]+ba/b[height<=720]/bv*+ba/b"
            elif quality_lower == "480p":
                opts["format"] = "bv*[height<=480][ext=mp4]+ba[ext=m4a]/bv*[height<=480]+ba/b[height<=480]/bv*+ba/b"
            elif quality_lower == "360p":
                opts["format"] = "bv*[height<=360][ext=mp4]+ba[ext=m4a]/bv*[height<=360]+ba/b[height<=360]/bv*+ba/b"
            else:
                opts["format"] = quality

            opts["merge_output_format"] = "mp4"
            opts["remuxvideo"] = "mp4"
        else:
            if quality_lower == "best":
                opts["format"] = "b[ext=mp4]/b/bv*+ba"
            elif quality_lower == "720p":
                opts["format"] = "b[height<=720][ext=mp4]/b[height<=720]/b/bv*+ba"
            elif quality_lower == "480p":
                opts["format"] = "b[height<=480][ext=mp4]/b[height<=480]/b/bv*+ba"
            elif quality_lower == "360p":
                opts["format"] = "b[height<=360][ext=mp4]/b[height<=360]/b/bv*+ba"
            else:
                opts["format"] = "b[ext=mp4]/b"

        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(validated_url, download=True)
                final_path = ydl.prepare_filename(info)
                p = Path(final_path)

                # Guarantee MP4 output: if .mp4 version exists or remux is needed
                target_mp4 = p.with_suffix(".mp4")
                if target_mp4.exists():
                    final_path = str(target_mp4)
                elif has_ffmpeg and p.exists() and p.suffix.lower() != ".mp4":
                    ffmpeg_bin = shutil.which("ffmpeg") or "ffmpeg"
                    cmd = [ffmpeg_bin, "-y", "-i", str(p), "-c:v", "copy", "-c:a", "aac", str(target_mp4)]
                    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    if res.returncode != 0:
                        cmd = [ffmpeg_bin, "-y", "-i", str(p), "-c:v", "libx264", "-c:a", "aac", "-preset", "fast", str(target_mp4)]
                        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    if target_mp4.exists() and target_mp4.stat().st_size > 0:
                        try:
                            p.unlink()
                        except Exception:
                            pass
                        final_path = str(target_mp4)

                final_p = Path(final_path)
                return {
                    "id": info.get("id"),
                    "title": info.get("title"),
                    "path": final_path,
                    "duration": info.get("duration"),
                    "size": final_p.stat().st_size if final_p.exists() else (info.get("filesize") or info.get("filesize_approx")),
                    "ext": final_p.suffix.lstrip("."),
                }
        except yt_dlp.utils.DownloadError as e:
            raise YtdError(f"Video download failed: {e}")

    def download_audio(
        self,
        url: str,
        audio_format: str = "mp3",
        output_dir: Optional[Path | str] = None,
        filename_template: Optional[str] = None,
        progress_callback: Optional[ProgressCallback] = None,
        cookies_file: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Download audio track and convert to clean universal MP3 format."""
        validated_url = validate_or_raise(url)
        dest_dir = ensure_directory(output_dir or DEFAULT_CONFIG["download_dir"])
        template = filename_template or DEFAULT_CONFIG["filename_template"]
        outtmpl = str(dest_dir / template)

        opts = self._get_base_ydl_opts(cookies_file)
        opts.update({
            "outtmpl": outtmpl,
            "format": "ba/b",
            "progress_hooks": [create_progress_hook(progress_callback)],
        })

        has_ffmpeg = is_ffmpeg_available()
        req_fmt = (audio_format or "mp3").lower()
        if req_fmt in ("best", "original"):
            req_fmt = "mp3"

        if has_ffmpeg:
            if req_fmt == "mp3":
                opts["postprocessors"] = [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }]
            elif req_fmt == "m4a":
                opts["postprocessors"] = [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "m4a",
                    "preferredquality": "192",
                }]
        else:
            if req_fmt in ("mp3", "m4a"):
                opts["format"] = "ba[ext=m4a]/ba/b"

        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(validated_url, download=True)
                final_path = ydl.prepare_filename(info)
                p = Path(final_path)

                target_file = p.with_suffix(f".{req_fmt}")
                if target_file.exists():
                    final_path = str(target_file)
                elif has_ffmpeg and p.exists() and p.suffix.lower() != f".{req_fmt}":
                    ffmpeg_bin = shutil.which("ffmpeg") or "ffmpeg"
                    cmd = [ffmpeg_bin, "-y", "-i", str(p), "-vn", "-b:a", "192k", str(target_file)]
                    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    if target_file.exists() and target_file.stat().st_size > 0:
                        try:
                            p.unlink()
                        except Exception:
                            pass
                        final_path = str(target_file)

                final_p = Path(final_path)
                return {
                    "id": info.get("id"),
                    "title": info.get("title"),
                    "path": final_path,
                    "duration": info.get("duration"),
                    "size": final_p.stat().st_size if final_p.exists() else (info.get("filesize") or info.get("filesize_approx")),
                    "ext": final_p.suffix.lstrip("."),
                }
        except yt_dlp.utils.DownloadError as e:
            raise YtdError(f"Audio download failed: {e}")

    def search_videos(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Search YouTube for videos matching query and return top results."""
        if not query or not query.strip():
            raise ValidationError("Search query cannot be empty.")

        clean_query = query.strip()
        search_target = f"ytsearch{max_results}:{clean_query}"
        opts = self._get_base_ydl_opts()
        opts["extract_flat"] = "in_playlist"

        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                result = ydl.extract_info(search_target, download=False)
                entries = result.get("entries", [])
                results: List[Dict[str, Any]] = []
                for entry in entries:
                    if not entry:
                        continue
                    vid_id = entry.get("id")
                    results.append({
                        "id": vid_id,
                        "title": entry.get("title", "Unknown Title"),
                        "channel": entry.get("uploader") or entry.get("channel", "Unknown Channel"),
                        "duration": entry.get("duration"),
                        "url": f"https://www.youtube.com/watch?v={vid_id}",
                    })
                return results
        except Exception as e:
            raise YtdError(f"Search failed: {e}")

    def get_playlist_info(self, url: str) -> Dict[str, Any]:
        """Extract metadata and items from a YouTube playlist."""
        validated_url = validate_or_raise(url)
        opts = self._get_base_ydl_opts()
        opts["extract_flat"] = "in_playlist"

        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                raw_playlist = ydl.extract_info(validated_url, download=False)
                if not raw_playlist:
                    raise MediaUnavailableError("Playlist not found or empty.")

                raw_entries = raw_playlist.get("entries", [])
                items = []
                for entry in raw_entries:
                    if not entry:
                        continue
                    vid_id = entry.get("id")
                    items.append({
                        "id": vid_id,
                        "title": entry.get("title", "Unknown Title"),
                        "duration": entry.get("duration"),
                        "url": f"https://www.youtube.com/watch?v={vid_id}",
                    })

                return {
                    "id": raw_playlist.get("id"),
                    "title": raw_playlist.get("title", "Untitled Playlist"),
                    "uploader": raw_playlist.get("uploader", "Unknown"),
                    "item_count": len(items),
                    "items": items,
                }
        except yt_dlp.utils.DownloadError as e:
            raise YtdError(f"Playlist extraction failed: {e}")
