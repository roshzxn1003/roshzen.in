"""Unit tests for formatting helpers."""

import unittest
from ytd.utils.formatters import format_bytes, format_number, format_seconds, format_speed


class TestFormatters(unittest.TestCase):
    def test_format_bytes(self):
        self.assertEqual(format_bytes(0), "0 B")
        self.assertEqual(format_bytes(1024), "1.0 KB")
        self.assertEqual(format_bytes(1024 * 1024 * 5), "5.0 MB")
        self.assertEqual(format_bytes(1024 * 1024 * 1024 * 2.5), "2.5 GB")
        self.assertEqual(format_bytes(None), "N/A")

    def test_format_seconds(self):
        self.assertEqual(format_seconds(45), "00:45")
        self.assertEqual(format_seconds(125), "02:05")
        self.assertEqual(format_seconds(3665), "01:01:05")
        self.assertEqual(format_seconds(None), "--:--")

    def test_format_speed(self):
        self.assertEqual(format_speed(1024 * 1024 * 3.5), "3.5 MB/s")
        self.assertEqual(format_speed(None), "-- B/s")

    def test_format_number(self):
        self.assertEqual(format_number(500), "500")
        self.assertEqual(format_number(1500), "1.5K")
        self.assertEqual(format_number(2_400_000), "2.4M")
        self.assertEqual(format_number(1_200_000_000), "1.2B")
        self.assertEqual(format_number(None), "N/A")


if __name__ == "__main__":
    unittest.main()
