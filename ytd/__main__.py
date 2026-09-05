"""Enables module execution via 'python3 -m ytd'."""

import sys
from .main import main

if __name__ == "__main__":
    sys.exit(main())
