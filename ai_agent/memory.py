"""
ZenithAI Persistent Memory Store
Allows the agent to store, recall, and persist conversational context, notes, and facts.
"""

import json
import os
from typing import Any, Dict, List, Optional


class AgentMemory:
    """Manages short-term conversation buffer and persistent long-term storage."""

    def __init__(self, storage_file: str = "ai_agent_memory.json"):
        self.storage_file = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", storage_file)
        )
        self.short_term_history: List[Dict[str, str]] = []
        self.long_term_facts: Dict[str, Any] = self._load_storage()

    def _load_storage(self) -> Dict[str, Any]:
        """Loads persistent JSON storage from disk."""
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def _save_storage(self) -> None:
        """Saves current state to JSON file."""
        try:
            with open(self.storage_file, "w", encoding="utf-8") as f:
                json.dump(self.long_term_facts, f, indent=2)
        except Exception as e:
            print(f"[Memory] Failed to save long-term storage: {e}")

    def add_message(self, role: str, content: str) -> None:
        """Appends a message to short-term conversational context."""
        self.short_term_history.append({"role": role, "content": content})
        # Keep last 20 messages in context to avoid token bloat
        if len(self.short_term_history) > 20:
            self.short_term_history = self.short_term_history[-20:]

    def get_history(self) -> List[Dict[str, str]]:
        """Returns short-term message history."""
        return self.short_term_history

    def store_fact(self, key: str, value: Any) -> str:
        """Stores a persistent piece of information."""
        self.long_term_facts[key] = value
        self._save_storage()
        return f"Stored '{key}' in long-term memory."

    def recall_fact(self, key: str) -> Optional[Any]:
        """Retrieves a persistent fact by key."""
        return self.long_term_facts.get(key)

    def list_all_facts(self) -> Dict[str, Any]:
        """Returns all remembered facts."""
        return self.long_term_facts

    def clear_short_term(self) -> None:
        """Clears working memory for a fresh session."""
        self.short_term_history.clear()
