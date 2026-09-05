"""Unit tests for YouTube URL validators and sanitizers."""

import unittest
from ytd.core.exceptions import ValidationError
from ytd.downloader.validators import (
    clean_youtube_url,
    extract_playlist_id,
    extract_video_id,
    is_playlist_url,
    is_valid_youtube_url,
    validate_or_raise,
)


class TestValidators(unittest.TestCase):
    def test_valid_watch_urls(self):
        valid_urls = [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "http://youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/shorts/dQw4w9WgXcQ",
            "https://www.youtube.com/embed/dQw4w9WgXcQ",
        ]
        for url in valid_urls:
            with self.subTest(url=url):
                self.assertTrue(is_valid_youtube_url(url))
                self.assertEqual(extract_video_id(url), "dQw4w9WgXcQ")

    def test_playlist_urls(self):
        pl_url = "https://www.youtube.com/playlist?list=PLrAXtmErZgOdP_8GzKtK425F8"
        self.assertTrue(is_valid_youtube_url(pl_url))
        self.assertTrue(is_playlist_url(pl_url))
        self.assertEqual(extract_playlist_id(pl_url), "PLrAXtmErZgOdP_8GzKtK425F8")

    def test_invalid_urls(self):
        invalid = [
            "",
            "not a url",
            "https://vimeo.com/123456",
            "https://google.com",
            "https://youtube.com/watch?v=short",  # Not 11 chars
        ]
        for url in invalid:
            with self.subTest(url=url):
                self.assertFalse(is_valid_youtube_url(url))

    def test_validate_or_raise(self):
        valid = "https://youtu.be/dQw4w9WgXcQ"
        self.assertEqual(validate_or_raise(valid), "https://www.youtube.com/watch?v=dQw4w9WgXcQ")

        with self.assertRaises(ValidationError):
            validate_or_raise("https://invalid.com/test")

        with self.assertRaises(ValidationError):
            validate_or_raise("")


if __name__ == "__main__":
    unittest.main()
