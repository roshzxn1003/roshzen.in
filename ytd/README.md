# ⚡ YTD — Professional YouTube Downloader CLI

A modular, production-ready **YouTube Media Downloader** built in Python with `yt-dlp` and `Rich`.

Built for educational purposes, software engineering practice, and portfolio presentation.

---

## 🌟 Key Features

* **Interactive Hacker Terminal Mode (`ytd`)**: Launches the cyber-tech ASCII menu interface matching the developer portfolio terminal.
* **Direct Fast Downloads (`ytd <url>`)**: Automatically inspects, selects optimal resolution, and downloads with smooth terminal progress bars.
* **Resolution & Format Selector (`ytd formats <url>`, `ytd video <url> -q 1080p`)**: Inspects available streams and downloads specific resolutions (1080p, 720p, 480p, 360p).
* **Audio Extraction (`ytd audio <url> -f mp3`)**: Extracts standalone audio tracks with fallback support for systems without FFmpeg.
* **YouTube Search (`ytd search "<query>"`)**: Interactively searches YouTube, displays top matches, and prompts for selection to download.
* **Playlist Batch Support (`ytd playlist <url>`)**: Downloads full playlists sequentially, gracefully skipping private or restricted items without crashing.
* **Download History (`ytd history`)**: Maintains a persistent local record of downloads, media types, dates, file sizes, and paths.
* **Persistent Configuration (`ytd config`)**: Configure default download directories, preferred quality, and formats stored in standard OS user paths (`~/.config/ytd/config.json`).
* **Clean Error Handling**: Never leaks raw Python tracebacks to normal users. Debug logs are accessible via `--debug`.

---

## 🏗️ Architecture & Clean Design Principles

```text
ytd/
├── __init__.py                # Package metadata & version
├── __main__.py                # Module launcher ('python3 -m ytd')
├── main.py                    # Command-line dispatcher & entry point
├── requirements.txt           # Minimal pinned dependencies (yt-dlp, rich)
├── cli/
│   ├── menu.py                # Interactive CLI menu (Options [1]-[4])
│   ├── parser.py              # Subcommand argument parser
│   └── printer.py             # Rich formatting, tables, panels & progress bars
├── commands/
│   ├── base.py                # BaseCommand abstract interface
│   ├── info_cmd.py            # Video metadata viewer
│   ├── download_cmd.py        # Video/Audio download handler
│   ├── formats_cmd.py         # Format stream listing table
│   ├── search_cmd.py          # YouTube search & interactive picker
│   ├── playlist_cmd.py        # Playlist batch processor
│   ├── history_cmd.py         # History viewer & clear command
│   └── config_cmd.py          # Persistent configuration manager
├── downloader/
│   ├── service.py             # Core YouTubeDownloaderService (yt-dlp wrapper)
│   ├── formats.py             # FormatInfo & VideoMetadata dataclasses
│   ├── progress.py            # Event-driven progress callback adapter
│   └── validators.py          # YouTube URL validation & ID extractors
├── config/
│   └── manager.py             # JSON configuration persistence
├── history/
│   └── manager.py             # Append-only download history logger
├── utils/
│   ├── formatters.py          # Human-readable bytes, duration, and speeds
│   └── system.py              # FFmpeg detection, path and disk checks
└── tests/                     # 21+ unit tests covering all modules
```

### Separation of Concerns
The core downloader logic (`downloader/service.py`) is completely decoupled from terminal printing (`cli/printer.py`). It accepts validated parameters and emits structured event objects (`ProgressEvent`), making it simple to plug into a Web API, GUI, or CLI.

---

## 🚀 Quickstart & Usage

### 1. Installation
```bash
# Clone the repository
cd roshzen.in

# Create virtual environment & install requirements
python3 -m venv .venv
source .venv/bin/activate
pip install -r ytd/requirements.txt
```

### 2. Interactive Mode
Run without arguments to launch the interactive terminal menu:
```bash
./ytd_launcher.sh
# or: python3 -m ytd
```

Output:
```text
╔══════════════════════════════════════════╗
║              YT-CLI DOWNLOADER           ║
║          Python • yt-dlp • CLI           ║
╚══════════════════════════════════════════╝

[1] Video Information
[2] Download Video
[3] Download Audio
[4] Back

Select option:
```

### 3. CLI Subcommands

#### Download Video
```bash
./ytd_launcher.sh https://www.youtube.com/watch?v=dQw4w9WgXcQ
./ytd_launcher.sh video https://www.youtube.com/watch?v=dQw4w9WgXcQ -q 1080p
```

#### Extract Audio
```bash
./ytd_launcher.sh audio https://www.youtube.com/watch?v=dQw4w9WgXcQ -f mp3
```

#### Video Information
```bash
./ytd_launcher.sh info https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

#### View Available Formats Table
```bash
./ytd_launcher.sh formats https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

#### Search YouTube
```bash
./ytd_launcher.sh search "python programming beginner"
```

#### Batch Download Playlist
```bash
./ytd_launcher.sh playlist https://www.youtube.com/playlist?list=PLrAXtmErZgOdP_8GzKtK425F8
```

#### View Download History
```bash
./ytd_launcher.sh history
./ytd_launcher.sh history --clear
```

#### Configuration
```bash
./ytd_launcher.sh config
./ytd_launcher.sh config --set default_quality=1080p
./ytd_launcher.sh config --set download_dir=~/Videos
```

---

## 🧪 Testing

Run the full automated test suite with Python's standard `unittest`:

```bash
python3 -m unittest discover -s ytd/tests
```

All 21 tests execute in under 0.05 seconds with zero network side effects (network operations are cleanly mocked).

---

## ⚖️ Legal & Ethical Usage Notice

This project is built for **educational purposes and developer portfolio demonstration**.
* Only download media that you own, have authorized permission to download, or which are in the Public Domain / Creative Commons.
* Comply with YouTube's Terms of Service.
* This tool does **not** bypass DRM (Digital Rights Management) or access-control restrictions.
