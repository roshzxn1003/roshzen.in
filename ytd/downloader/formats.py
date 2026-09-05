"""Data structures and parser functions for YouTube video formats and metadata."""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from ..utils.formatters import format_bytes, format_seconds


@dataclass
class FormatInfo:
    """Represents a specific video or audio stream available from YouTube."""
    format_id: str
    ext: str
    resolution: str
    height: Optional[int] = None
    width: Optional[int] = None
    fps: Optional[int] = None
    vcodec: str = "none"
    acodec: str = "none"
    filesize: Optional[int] = None
    tbr: Optional[float] = None
    format_note: str = ""
    is_video: bool = True
    is_audio: bool = False
    is_muxed: bool = False  # Contains both video and audio in a single stream

    @property
    def filesize_formatted(self) -> str:
        return format_bytes(self.filesize)

    @property
    def stream_type(self) -> str:
        if self.is_muxed:
            return "Video + Audio"
        if self.is_video and not self.is_audio:
            return "Video Only"
        if self.is_audio and not self.is_video:
            return "Audio Only"
        return "Media"


@dataclass
class VideoMetadata:
    """Structured representation of video metadata extracted from YouTube."""
    id: str
    title: str
    channel: str
    channel_url: str
    duration: Optional[int]
    view_count: Optional[int]
    upload_date: Optional[str]
    description: str
    thumbnail: Optional[str]
    webpage_url: str
    formats: List[FormatInfo] = field(default_factory=list)

    @property
    def duration_formatted(self) -> str:
        return format_seconds(self.duration)

    def get_muxed_formats(self) -> List[FormatInfo]:
        """Return all streams that contain both video and audio (playable without ffmpeg merge)."""
        return [f for f in self.formats if f.is_muxed]

    def get_video_formats(self) -> List[FormatInfo]:
        """Return all video streams sorted by resolution descending."""
        v_formats = [f for f in self.formats if f.is_video and f.height]
        return sorted(v_formats, key=lambda x: (x.height or 0, x.tbr or 0), reverse=True)

    def get_audio_formats(self) -> List[FormatInfo]:
        """Return all standalone audio streams sorted by bitrate descending."""
        a_formats = [f for f in self.formats if f.is_audio and not f.is_video]
        return sorted(a_formats, key=lambda x: (x.tbr or 0), reverse=True)


def parse_format_dict(raw: Dict[str, Any]) -> FormatInfo:
    """Parse a single raw format dictionary from yt-dlp into a FormatInfo object."""
    vcodec = str(raw.get("vcodec", "none"))
    acodec = str(raw.get("acodec", "none"))
    has_video = vcodec != "none"
    has_audio = acodec != "none"
    height = raw.get("height")
    width = raw.get("width")

    # Determine resolution label
    if height:
        resolution = f"{height}p"
    elif raw.get("resolution"):
        resolution = str(raw.get("resolution"))
    elif has_audio and not has_video:
        resolution = f"Audio ({raw.get('abr', raw.get('tbr', 'N/A'))}k)"
    else:
        resolution = "N/A"

    filesize = raw.get("filesize") or raw.get("filesize_approx")

    return FormatInfo(
        format_id=str(raw.get("format_id", "")),
        ext=str(raw.get("ext", "")),
        resolution=resolution,
        height=height,
        width=width,
        fps=raw.get("fps"),
        vcodec=vcodec,
        acodec=acodec,
        filesize=filesize,
        tbr=raw.get("tbr"),
        format_note=str(raw.get("format_note", "")),
        is_video=has_video,
        is_audio=has_audio,
        is_muxed=has_video and has_audio,
    )


def parse_video_metadata(info_dict: Dict[str, Any]) -> VideoMetadata:
    """Convert yt-dlp raw info dictionary into a clean VideoMetadata dataclass."""
    raw_formats = info_dict.get("formats", [])
    parsed_formats = [parse_format_dict(f) for f in raw_formats]

    return VideoMetadata(
        id=str(info_dict.get("id", "")),
        title=str(info_dict.get("title", "Unknown Title")),
        channel=str(info_dict.get("uploader", info_dict.get("channel", "Unknown Channel"))),
        channel_url=str(info_dict.get("uploader_url", "")),
        duration=info_dict.get("duration"),
        view_count=info_dict.get("view_count"),
        upload_date=str(info_dict.get("upload_date", "")),
        description=str(info_dict.get("description", "")),
        thumbnail=info_dict.get("thumbnail"),
        webpage_url=str(info_dict.get("webpage_url", f"https://youtube.com/watch?v={info_dict.get('id', '')}")),
        formats=parsed_formats,
    )
