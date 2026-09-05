"""Unit tests for YouTubeDownloaderService with mocked yt_dlp."""

from unittest.mock import MagicMock, patch
import unittest
from ytd.core.exceptions import MediaUnavailableError, NetworkError, ValidationError
from ytd.downloader.service import YouTubeDownloaderService


class TestService(unittest.TestCase):
    def setUp(self):
        self.service = YouTubeDownloaderService()

    def test_invalid_url_raises_validation_error(self):
        with self.assertRaises(ValidationError):
            self.service.get_video_info("https://invalid-site.com")

    @patch("yt_dlp.YoutubeDL")
    def test_get_video_info_success(self, mock_ydl_cls):
        mock_ydl = MagicMock()
        mock_ydl_cls.return_value.__enter__.return_value = mock_ydl
        mock_ydl.extract_info.return_value = {
            "id": "dQw4w9WgXcQ",
            "title": "Never Gonna Give You Up",
            "uploader": "Rick Astley",
            "duration": 213,
            "view_count": 1500000000,
            "formats": [
                {
                    "format_id": "18",
                    "ext": "mp4",
                    "height": 360,
                    "width": 640,
                    "vcodec": "avc1.42001E",
                    "acodec": "mp4a.40.2",
                    "filesize": 15000000,
                }
            ],
        }

        info = self.service.get_video_info("https://youtu.be/dQw4w9WgXcQ")
        self.assertEqual(info.id, "dQw4w9WgXcQ")
        self.assertEqual(info.title, "Never Gonna Give You Up")
        self.assertEqual(info.channel, "Rick Astley")
        self.assertEqual(len(info.formats), 1)
        self.assertTrue(info.formats[0].is_muxed)

    @patch("yt_dlp.YoutubeDL")
    def test_search_videos_success(self, mock_ydl_cls):
        mock_ydl = MagicMock()
        mock_ydl_cls.return_value.__enter__.return_value = mock_ydl
        mock_ydl.extract_info.return_value = {
            "entries": [
                {
                    "id": "abc12345678",
                    "title": "Python for Beginners",
                    "uploader": "FreeCodeCamp",
                    "duration": 3600,
                }
            ]
        }

        results = self.service.search_videos("python", max_results=1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], "abc12345678")
        self.assertEqual(results[0]["title"], "Python for Beginners")


if __name__ == "__main__":
    unittest.main()
