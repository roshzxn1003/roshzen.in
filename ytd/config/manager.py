"""Configuration manager for persistent user preferences.

Configuration is saved in a standard user configuration directory
(~/.config/ytd/config.json on Linux/macOS) in human-readable JSON format.
"""

import json
from pathlib import Path
from typing import Any, Dict

from ..core.constants import CONFIG_DIR, CONFIG_FILE, DEFAULT_CONFIG
from ..utils.system import ensure_directory


class ConfigManager:
    """Manages application configuration loading, validation, and persistence."""

    def __init__(self, config_file: Path = CONFIG_FILE) -> None:
        self.config_file = Path(config_file)
        self._data: Dict[str, Any] = {}
        self.load()

    def load(self) -> Dict[str, Any]:
        """Load configuration from disk, falling back to defaults for any missing keys."""
        if not self.config_file.exists():
            self._data = dict(DEFAULT_CONFIG)
            self.save()
            return self._data

        try:
            with open(self.config_file, "r", encoding="utf-8") as f:
                loaded = json.load(f)
                if isinstance(loaded, dict):
                    # Merge with default config to ensure all keys exist
                    merged = dict(DEFAULT_CONFIG)
                    merged.update(loaded)
                    self._data = merged
                else:
                    self._data = dict(DEFAULT_CONFIG)
        except (json.JSONDecodeError, OSError):
            self._data = dict(DEFAULT_CONFIG)

        return self._data

    def save(self) -> None:
        """Write current configuration to disk safely."""
        ensure_directory(self.config_file.parent)
        try:
            with open(self.config_file, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2)
        except OSError as e:
            # Fallback in memory
            pass

    def get(self, key: str, default: Any = None) -> Any:
        """Retrieve a configuration value by key."""
        return self._data.get(key, default if default is not None else DEFAULT_CONFIG.get(key))

    def set(self, key: str, value: Any) -> None:
        """Update a configuration value and persist immediately."""
        self._data[key] = value
        self.save()

    def reset(self) -> None:
        """Reset configuration to initial defaults."""
        self._data = dict(DEFAULT_CONFIG)
        self.save()

    def all(self) -> Dict[str, Any]:
        """Return a copy of the entire configuration dictionary."""
        return dict(self._data)

    def get_download_path(self) -> Path:
        """Get the configured download directory as an expanded, resolved Path."""
        raw_path = self.get("download_dir", DEFAULT_CONFIG["download_dir"])
        return ensure_directory(Path(raw_path).expanduser())


# Singleton instance for easy import
config = ConfigManager()
