"""Command handler for reading and updating application settings."""

from typing import Any, Optional
from rich.table import Table

from ..cli.printer import console, print_error, print_success
from ..config.manager import config
from ..core.constants import EXIT_ERROR, EXIT_SUCCESS
from .base import BaseCommand


class ConfigCommand(BaseCommand):
    """Manages viewing and editing persistent JSON configuration."""

    def execute(
        self,
        set_val: Optional[str] = None,
        get_val: Optional[str] = None,
        reset: bool = False,
        **kwargs: Any,
    ) -> int:
        if reset:
            config.reset()
            print_success("Configuration reset to initial defaults.")
            return EXIT_SUCCESS

        if get_val:
            val = config.get(get_val)
            if val is not None:
                console.print(f"[bold red]{get_val}:[/bold red] {val}")
                return EXIT_SUCCESS
            print_error(f"Configuration key '{get_val}' not found.")
            return EXIT_ERROR

        if set_val:
            if "=" not in set_val:
                print_error("Invalid syntax. Use: --set key=value (e.g. --set default_quality=1080p)")
                return EXIT_ERROR

            key, value = set_val.split("=", 1)
            key = key.strip()
            value = value.strip()

            # Cast boolean or integer if appropriate
            if value.lower() in ("true", "yes"):
                casted_val = True
            elif value.lower() in ("false", "no"):
                casted_val = False
            elif value.isdigit():
                casted_val = int(value)
            else:
                casted_val = value

            config.set(key, casted_val)
            print_success(f"Updated '{key}' = {casted_val}")
            return EXIT_SUCCESS

        # Default: display all current settings
        table = Table(
            title="Current Configuration",
            title_style="bold red",
            header_style="bold cyan",
            border_style="dim red",
        )
        table.add_column("Setting Key", style="bold yellow")
        table.add_column("Value", style="white")

        for k, v in config.all().items():
            table.add_row(k, str(v))

        console.print(table)
        console.print(f"[dim]Config file path: {config.config_file}[/dim]")
        return EXIT_SUCCESS
