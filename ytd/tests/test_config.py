"""Unit tests for configuration manager."""

from pathlib import Path
import tempfile
import unittest
from ytd.config.manager import ConfigManager


class TestConfigManager(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.config_path = Path(self.temp_dir.name) / "config.json"
        self.mgr = ConfigManager(self.config_path)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_default_values(self):
        self.assertEqual(self.mgr.get("default_quality"), "720p")
        self.assertEqual(self.mgr.get("default_audio_format"), "mp3")

    def test_set_and_persistence(self):
        self.mgr.set("default_quality", "1080p")
        self.assertEqual(self.mgr.get("default_quality"), "1080p")

        # Reload from disk in a fresh instance
        reloaded = ConfigManager(self.config_path)
        self.assertEqual(reloaded.get("default_quality"), "1080p")

    def test_reset(self):
        self.mgr.set("default_quality", "480p")
        self.mgr.reset()
        self.assertEqual(self.mgr.get("default_quality"), "720p")


if __name__ == "__main__":
    unittest.main()
