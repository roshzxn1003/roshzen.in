#!/usr/bin/env python3
"""
ZenithAI Autonomous Agent Launcher
Usage:
  python3 agent.py                           (Interactive Chat & Task Shell)
  python3 agent.py "search latest AI news"  (Single autonomous task)
  python3 agent.py --tutorial                (Launch AIML Learning Academy)
"""

import sys
import os

# Add root directory to python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai_agent.agent import ZenithAgent, start_interactive_repl
from ai_agent.tutorial import run_tutorial

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1].strip()
        if arg in ["--tutorial", "-t", "tutorial", "learn"]:
            run_tutorial()
        else:
            task = " ".join(sys.argv[1:])
            ZenithAgent().run(task, verbose=True)
    else:
        start_interactive_repl()
