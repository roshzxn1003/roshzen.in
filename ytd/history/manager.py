"""Download history manager.

Records completed, failed, or interrupted downloads into a JSON log file.
Kept modular so it can be swapped for an SQLite database in the future if needed.
"""

from datetime import datetime
import json
from pathlib import Path
from typing import Any, Dict, List, Optional
import uuid

from ..core.constants import HISTORY_FILE
from ..utils.system import ensure_directory


class HistoryManager:
    """Manages appending, retrieving, and clearing download history logs."""

    def __init__(self, history_file: Path = HISTORY_FILE) -> None:
        self.history_file = Path(history_file)
        self._records: List[Dict[str, Any]] = []
        self.load()

    def load(self) -> List[Dict[str, Any]]:
        """Load history records from disk."""
        if not self.history_file.exists():
            self._records = []
            return self._records

        try:
            with open(self.history_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    self._records = data
                else:
                    self._records = []
        except (json.JSONDecodeError, OSError):
            self._records = []

        return self._records

    def save(self) -> None:
        """Persist history records to disk."""
        ensure_directory(self.history_file.parent)
        try:
            with open(self.history_file, "w", encoding="utf-8") as f:
                json.dump(self._records, f, indent=2)
        except OSError:
            pass

    def add_record(
        self,
        url: str,
        title: str,
        media_type: str,
        quality: str,
        output_path: str,
        file_size: Optional[int] = None,
        status: str = "completed",
        error: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Record a download entry."""
        record = {
            "id": str(uuid.uuid4())[:8],
            "url": url,
            "title": title,
            "timestamp": datetime.now().isoformat(),
            "media_type": media_type,
            "quality": quality,
            "output_path": output_path,
            "file_size": file_size,
            "status": status,
            "error": error,
        }
        # Prepend to keep newest first
        self._records.insert(0, record)
        # Keep maximum 500 records to prevent file from growing indefinitely
        self._records = self._records[:500]
        self.save()
        return record

    def get_records(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Retrieve recent download records, newest first."""
        if limit is not None and limit > 0:
            return self._records[:limit]
        return list(self._records)

    def clear(self) -> int:
        """Clear all download history and return count of deleted records."""
        count = len(self._records)
        self._records = []
        self.save()
        return count

    def count(self) -> int:
        """Total number of history records."""
        return len(self._records)


history = HistoryManager()
