#!/usr/bin/env bash
# YTD — YouTube Downloader CLI launcher
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$DIR/.venv/bin/python3" ]; then
    export PATH="$DIR/.venv/bin:$PATH"
    PYTHON="$DIR/.venv/bin/python3"
else
    PYTHON="python3"
fi

exec "$PYTHON" -m ytd "$@"
