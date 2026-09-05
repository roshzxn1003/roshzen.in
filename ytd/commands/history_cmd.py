"""Command handler for viewing and managing download history."""

from typing import Any

from ..cli.printer import console, print_history_table, print_success
from ..core.constants import EXIT_SUCCESS
from ..history.manager import history
from .base import BaseCommand


class HistoryCommand(BaseCommand):
    """Displays or resets local download history records."""

    def execute(self, clear: bool = False, limit: int = 25, **kwargs: Any) -> int:
        if clear:
            count = history.clear()
            print_success(f"Cleared {count} history records.")
            return EXIT_SUCCESS

        records = history.get_records(limit=limit)
        print_history_table(records)
        return EXIT_SUCCESS
