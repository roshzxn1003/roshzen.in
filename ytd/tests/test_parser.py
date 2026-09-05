"""Unit tests for CLI argument parsing."""

import unittest
from ytd.cli.parser import build_parser, parse_cli_args


class TestParser(unittest.TestCase):
    def setUp(self):
        self.parser = build_parser()

    def test_info_command(self):
        args = parse_cli_args(self.parser, ["info", "https://youtu.be/dQw4w9WgXcQ"])
        self.assertEqual(args.command, "info")
        self.assertEqual(args.url, "https://youtu.be/dQw4w9WgXcQ")

    def test_video_command(self):
        args = parse_cli_args(self.parser, ["video", "https://youtu.be/dQw4w9WgXcQ", "-q", "1080p"])
        self.assertEqual(args.command, "video")
        self.assertEqual(args.url, "https://youtu.be/dQw4w9WgXcQ")
        self.assertEqual(args.quality, "1080p")

    def test_audio_command(self):
        args = parse_cli_args(self.parser, ["audio", "https://youtu.be/dQw4w9WgXcQ", "-f", "mp3"])
        self.assertEqual(args.command, "audio")
        self.assertEqual(args.url, "https://youtu.be/dQw4w9WgXcQ")
        self.assertEqual(args.format, "mp3")

    def test_search_command(self):
        args = parse_cli_args(self.parser, ["search", "python tutorial", "--limit", "10"])
        self.assertEqual(args.command, "search")
        self.assertEqual(args.query, "python tutorial")
        self.assertEqual(args.limit, 10)

    def test_direct_url(self):
        args = parse_cli_args(self.parser, ["https://youtu.be/dQw4w9WgXcQ"])
        self.assertEqual(args.command, "video")
        self.assertEqual(args.url, "https://youtu.be/dQw4w9WgXcQ")


if __name__ == "__main__":
    unittest.main()
