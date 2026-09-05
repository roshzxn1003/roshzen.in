"""Unit tests for download history manager."""

from pathlib import Path
import tempfile
import unittest
from ytd.history.manager import HistoryManager


class TestHistoryManager(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.history_path = Path(self.temp_dir.name) / "history.json"
        self.mgr = HistoryManager(self.history_path)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_add_and_retrieve_record(self):
        record = self.mgr.add_record(
            url="https://youtu.be/dQw4w9WgXcQ",
            title="Sample Video",
            media_type="video",
            quality="1080p",
            output_path="/tmp/sample.mp4",
            file_size=1024 * 1024 * 15,
        )
        self.assertEqual(self.mgr.count(), 1)
        records = self.mgr.get_records()
        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]["title"], "Sample Video")
        self.assertEqual(records[0]["quality"], "1080p")

    def test_clear_history(self):
        self.mgr.add_record(
            url="https://youtu.be/1",
            title="V1",
            media_type="video",
            quality="720p",
            output_path="/tmp/v1.mp4",
        )
        self.mgr.add_record(
            url="https://youtu.be/2",
            title="V2",
            media_type="audio",
            quality="mp3",
            output_path="/tmp/v2.mp3",
        )
        self.assertEqual(self.mgr.count(), 2)
        cleared = self.mgr.clear()
        self.assertEqual(cleared, 2)
        self.assertEqual(self.mgr.count(), 0)


if __name__ == "__main__":
    unittest.main()
