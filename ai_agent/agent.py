#!/usr/bin/env python3
"""
ZenithAI Autonomous Agent Core
An autonomous ReAct (Reasoning + Acting) AI Agent powered by Google Gemini / LLMs.
Capable of web research, file management, command execution, and multi-step reasoning.
"""

import json
import os
import re
import sys
import time
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

from ai_agent.memory import AgentMemory
from ai_agent.tools import (
    AVAILABLE_TOOLS,
    execute_tool_call,
    get_tools_prompt_description,
)

# ─── ANSI COLOR PALETTE FOR TERMINAL UI ──────────────────────────────────────
class Colors:
    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RESET = "\033[0m"


def load_env():
    """Loads environment variables from .env.local or .env without external dependencies."""
    candidates = [
        os.path.join(os.getcwd(), ".env.local"),
        os.path.join(os.getcwd(), ".env"),
        os.path.join(os.path.dirname(__file__), "..", ".env.local"),
        os.path.join(os.path.dirname(__file__), "..", ".env"),
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            except Exception:
                pass


load_env()

# ─── LLM CLIENT (GEMINI API) ────────────────────────────────────────────────
class LLMClient:
    """Communicates with Gemini 2.5/1.5 API directly via lightweight REST API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model = "gemini-2.5-flash"

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 10)

    def generate(self, system_instruction: str, prompt_text: str) -> str:
        """Calls the Gemini generateContent endpoint with API key or Bearer token."""
        if not self.is_configured():
            return self._offline_fallback_generator(prompt_text)

        headers = {"Content-Type": "application/json"}
        if self.api_key.startswith(("AQ.", "ya29.")):
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
            headers["Authorization"] = f"Bearer {self.api_key}"
        else:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

        payload = {
            "contents": [{"parts": [{"text": prompt_text}]}],
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2048,
            },
        }

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                candidates = result.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
                return "Error: Empty response from LLM."
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            # If authentication fails or quota is exceeded, use the built-in deterministic reasoning engine
            if e.code in (401, 403, 404, 429):
                return self._offline_fallback_generator(prompt_text)
            return f"LLM API Error ({e.code}): {err_body}"
        except Exception:
            return self._offline_fallback_generator(prompt_text)

    def _offline_fallback_generator(self, prompt: str) -> str:
        """Autonomous heuristic engine that performs ReAct tool calling if API key is invalid."""
        lower = prompt.lower()
        
        # If an observation is already in the prompt, synthesize final answer
        if "observation:" in lower:
            last_obs = prompt.split("Observation:")[-1].strip()
            return f"Thought: I have received the tool output and completed the objective.\nFinal Answer: Based on the executed action, here is the result:\n\n{last_obs}"

        # Otherwise pick the appropriate tool
        if any(w in lower for w in ["calculate", "math", "+", "*", "-", "/", "**"]):
            expr_match = re.search(r"(\d+[\s+\-*/().^0-9]+)", prompt)
            expr = expr_match.group(1).strip() if expr_match else "2 + 2"
            return f"Thought: I need to evaluate the mathematical expression accurately.\nAction: calculate\nAction Input: {{\"expression\": \"{expr}\"}}"
        elif any(w in lower for w in ["search", "find", "who is", "what is", "news", "docs"]):
            query = prompt.replace("User Goal:", "").strip().split("\n")[0]
            return f"Thought: I need to query the web to retrieve up-to-date information.\nAction: web_search\nAction Input: {{\"query\": \"{query}\"}}"
        elif any(w in lower for w in ["system", "os", "specs", "cpu"]):
            return "Thought: I should inspect host system details.\nAction: get_system_info\nAction Input: {}"
        elif any(w in lower for w in ["list", "files", "dir", "directory"]):
            return "Thought: I will list the contents of the current directory.\nAction: list_directory\nAction Input: {\"directory\": \".\"}"
        else:
            return f"Thought: I can answer this question directly.\nFinal Answer: Hello! I am ZenithAI. I received your request: '{prompt.splitlines()[0]}'. To enable cloud LLM generation, you can configure your standard GEMINI_API_KEY in `.env.local`!"


# ─── AGENT SYSTEM PROMPT & REACT LOOP ────────────────────────────────────────

SYSTEM_PROMPT_TEMPLATE = """You are ZenithAI, an elite Autonomous AI Engineer and Problem Solver.
You solve complex multi-step user objectives by reasoning step-by-step and calling available tools.

{tools_description}

### PROTOCOL FORMAT:
To achieve user goals, you MUST strictly use the ReAct (Reasoning + Acting) loop:

When you need to use a tool:
Thought: Describe what you are thinking and why you are choosing the next action.
Action: the_tool_name (MUST be one of: {tool_names})
Action Input: {{"param1": "value1", "param2": "value2"}}

When you have collected all required information and achieved the objective:
Thought: I have gathered all necessary information and completed the objective.
Final Answer: Provide the complete, well-formatted, in-depth solution or report to the user.

### RULES:
1. Always output ONLY one Action at a time, then stop and wait for the tool Observation.
2. If a tool fails, reflect on the error and try an alternative approach.
3. Keep thoughts concise, analytical, and goal-oriented.
4. Format final answers clearly using GitHub-style Markdown, code snippets, and structured tables when appropriate.
"""


class ZenithAgent:
    """The Autonomous ReAct Agent Controller."""

    def __init__(self, api_key: Optional[str] = None):
        self.llm = LLMClient(api_key=api_key)
        self.memory = AgentMemory()
        self.max_steps = 10

    def run(self, user_goal: str, verbose: bool = True) -> str:
        """Executes the autonomous loop for a given user goal."""
        self._print_banner(user_goal) if verbose else None

        tools_desc = get_tools_prompt_description()
        tool_names = ", ".join(AVAILABLE_TOOLS.keys())
        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
            tools_description=tools_desc, tool_names=tool_names
        )

        conversation_log = f"User Goal: {user_goal}\n"

        for step in range(1, self.max_steps + 1):
            if verbose:
                print(f"\n{Colors.BOLD}{Colors.CYAN}┌── [Step {step}/{self.max_steps}] Reasoning...{Colors.RESET}")

            # Prompt model with conversation log so far
            llm_response = self.llm.generate(
                system_instruction=system_prompt,
                prompt_text=conversation_log + "\nThought:",
            )

            # Prepend 'Thought:' if omitted by model
            if not llm_response.startswith("Thought:"):
                llm_response = "Thought: " + llm_response

            # Check for Final Answer
            final_match = re.search(r"Final Answer:\s*(.*?)(?=\nThought:|$)", llm_response, re.DOTALL | re.IGNORECASE)
            if final_match and "Action:" not in llm_response.split("Final Answer:")[0]:
                final_answer = final_match.group(1).strip()
                thought_part = llm_response.split("Final Answer:")[0].replace("Thought:", "").strip()
                if verbose:
                    if thought_part:
                        print(f"{Colors.DIM}│ 💭 Thought: {thought_part}{Colors.RESET}")
                    print(f"{Colors.BOLD}{Colors.GREEN}└── 🎯 FINAL ANSWER:{Colors.RESET}\n")
                    print(final_answer)
                self.memory.add_message("user", user_goal)
                self.memory.add_message("assistant", final_answer)
                return final_answer

            # Extract Action and Action Input
            thought, action_name, action_input = self._parse_react_response(llm_response)

            if verbose:
                if thought:
                    print(f"{Colors.DIM}│ 💭 Thought: {thought}{Colors.RESET}")
                print(f"{Colors.BOLD}{Colors.YELLOW}│ 🛠️  Action: {action_name}{Colors.RESET}")
                print(f"{Colors.DIM}│ 📥 Input: {json.dumps(action_input)}{Colors.RESET}")

            if not action_name:
                # If no clear action parsed, treat entire text as final answer
                clean_ans = llm_response.replace("Thought:", "").strip()
                if verbose:
                    print(f"{Colors.BOLD}{Colors.GREEN}└── 🎯 FINAL ANSWER:{Colors.RESET}\n")
                    print(clean_ans)
                return clean_ans

            # Execute tool
            if verbose:
                print(f"{Colors.DIM}│ ⏳ Executing '{action_name}'...{Colors.RESET}")
            
            tool_start = time.time()
            observation = execute_tool_call(action_name, action_input)
            duration = time.time() - tool_start

            obs_preview = observation[:300] + ("..." if len(observation) > 300 else "")
            if verbose:
                print(f"{Colors.GREEN}│ 👁️  Observation ({duration:.2f}s): {obs_preview}{Colors.RESET}")
                print(f"{Colors.CYAN}└──{Colors.RESET}")

            # Append to trajectory
            conversation_log += (
                f"\nThought: {thought}\n"
                f"Action: {action_name}\n"
                f"Action Input: {json.dumps(action_input)}\n"
                f"Observation: {observation}\n"
            )

        # Max steps exceeded
        fallback = "Goal halted: Maximum reasoning steps (10) reached without final convergence."
        if verbose:
            print(f"\n{Colors.RED}❌ {fallback}{Colors.RESET}")
        return fallback

    def _parse_react_response(self, text: str) -> Tuple[str, str, Dict[str, Any]]:
        """Extracts Thought, Action, and Action Input parameters."""
        thought = ""
        action_name = ""
        action_input = {}

        # 1. Thought
        thought_match = re.search(r"Thought:\s*(.*?)(?=Action:|$)", text, re.DOTALL | re.IGNORECASE)
        if thought_match:
            thought = thought_match.group(1).strip()

        # 2. Action
        action_match = re.search(r"Action:\s*([a-zA-Z0-9_-]+)", text, re.IGNORECASE)
        if action_match:
            action_name = action_match.group(1).strip()

        # 3. Action Input
        input_match = re.search(r"Action Input:\s*(\{.*?\}|\[.*?\]|\".*?\")", text, re.DOTALL | re.IGNORECASE)
        if input_match:
            raw_input = input_match.group(1).strip()
            try:
                action_input = json.loads(raw_input)
                if not isinstance(action_input, dict):
                    action_input = {"input": action_input}
            except Exception:
                # String fallback
                action_input = {"query": raw_input.strip('"')}
        else:
            # Check for single line key-value or raw query
            raw_after_action = text.split("Action:")[-1]
            input_line = re.search(r"Action Input:\s*(.+)", raw_after_action)
            if input_line:
                val = input_line.group(1).strip()
                action_input = {"query": val}

        return thought, action_name, action_input

    def _print_banner(self, goal: str):
        print(f"\n{Colors.BOLD}{Colors.HEADER}======================================================{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.HEADER}          🤖 ZENITH-AI AUTONOMOUS AGENT v1.0         {Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.HEADER}======================================================{Colors.RESET}")
        print(f"{Colors.BOLD}🎯 Goal:{Colors.RESET} {goal}")
        print(f"{Colors.DIM}🧠 Model: {self.llm.model} | 🛠️ Tools: {len(AVAILABLE_TOOLS)} Active{Colors.RESET}")
        print(f"{Colors.HEADER}------------------------------------------------------{Colors.RESET}")


# ─── INTERACTIVE REPL INTERFACE ──────────────────────────────────────────────

def start_interactive_repl():
    """Launches an interactive prompt session with the agent."""
    agent = ZenithAgent()
    print(f"\n{Colors.BOLD}{Colors.HEADER}======================================================{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.HEADER}      ⚡ ZENITH-AI INTERACTIVE AGENT SHELL           {Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.HEADER}======================================================{Colors.RESET}")
    print(f"{Colors.GREEN}Type any task or question. Type 'exit' or 'quit' to close.{Colors.RESET}")
    print(f"{Colors.DIM}Examples:\n  • 'Search recent AI breakthroughs in 2026 and summarize them'\n  • 'List all files in current dir and calculate disk usage'\n  • 'Write a python script to reverse a string and execute it'{Colors.RESET}\n")

    while True:
        try:
            user_input = input(f"{Colors.BOLD}{Colors.CYAN}zenith-agent ❯ {Colors.RESET}").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit", "q"]:
                print(f"{Colors.YELLOW}Exiting ZenithAI Agent session. Goodbye!{Colors.RESET}")
                break
            agent.run(user_input, verbose=True)
            print()
        except KeyboardInterrupt:
            print(f"\n{Colors.YELLOW}[!] Session interrupted by user.{Colors.RESET}")
            break
        except Exception as e:
            print(f"{Colors.RED}Error: {e}{Colors.RESET}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Command line goal passed as arguments
        task = " ".join(sys.argv[1:])
        ZenithAgent().run(task, verbose=True)
    else:
        # Interactive mode
        start_interactive_repl()
