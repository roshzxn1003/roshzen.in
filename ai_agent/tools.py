"""
ZenithAI Tools Registry
Provides autonomous capabilities (Web Search, File I/O, Bash Execution, System Info, Math)
to the AI Agent.
"""

import json
import os
import platform
import subprocess
import urllib.parse
import urllib.request
import re
from typing import Any, Dict, List

# ─── TOOL IMPLEMENTATIONS ───────────────────────────────────────────────────

def tool_web_search(query: str) -> str:
    """Searches the web for recent information, documentation, or news using DuckDuckGo."""
    try:
        encoded = urllib.parse.quote_plus(query)
        url = f"https://html.duckduckgo.com/html/?q={encoded}"
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
        )
        with urllib.request.urlopen(req, timeout=8) as response:
            html = response.read().decode("utf-8", errors="ignore")

        # Extract snippets and titles
        results = []
        snippets = re.findall(r'<a class="result__snippet[^"]*"[^>]*>(.*?)</a>', html, re.DOTALL)
        titles = re.findall(r'<a class="result__url[^"]*"[^>]*href="([^"]*)"[^>]*>(.*?)</a>', html, re.DOTALL)

        for i, snippet in enumerate(snippets[:5]):
            clean_snippet = re.sub(r"<[^>]+>", "", snippet).strip()
            title_text = re.sub(r"<[^>]+>", "", titles[i][1]).strip() if i < len(titles) else "Result"
            link = titles[i][0] if i < len(titles) else ""
            if clean_snippet:
                results.append(f"[{i+1}] {title_text}\nLink: {link}\nSummary: {clean_snippet}")

        if not results:
            return f"No direct web results found for query: {query}"

        return "\n\n".join(results)
    except Exception as e:
        return f"Web search error: {str(e)}"


def tool_fetch_url(url: str) -> str:
    """Fetches and extracts clean text content from a given web URL."""
    try:
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read().decode("utf-8", errors="ignore")

        # Remove scripts, styles, and tags
        content = re.sub(r"<script[^>]*>.*?</script>", "", content, flags=re.DOTALL | re.IGNORECASE)
        content = re.sub(r"<style[^>]*>.*?</style>", "", content, flags=re.DOTALL | re.IGNORECASE)
        clean_text = re.sub(r"<[^>]+>", " ", content)
        clean_text = re.sub(r"\s+", " ", clean_text).strip()

        # Truncate to first 3000 chars to fit context window
        return clean_text[:3000] + ("..." if len(clean_text) > 3000 else "")
    except Exception as e:
        return f"Failed to fetch URL {url}: {str(e)}"


def tool_execute_command(command: str) -> str:
    """Executes a shell command in the local environment and returns stdout and stderr."""
    # Safety filter for high-risk commands
    forbidden = ["rm -rf /", "mkfs", ":(){ :|:& };:", "dd if=/dev/zero"]
    if any(f in command for f in forbidden):
        return "Error: Execution blocked for security reasons."

    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30,
            cwd=os.getcwd(),
        )
        output = []
        if result.stdout:
            output.append(f"STDOUT:\n{result.stdout.strip()}")
        if result.stderr:
            output.append(f"STDERR:\n{result.stderr.strip()}")
        output.append(f"Exit Code: {result.returncode}")
        return "\n\n".join(output) if output else "Command executed with no output."
    except subprocess.TimeoutExpired:
        return "Error: Command timed out after 30 seconds."
    except Exception as e:
        return f"Execution error: {str(e)}"


def tool_read_file(filepath: str) -> str:
    """Reads the contents of a local file."""
    try:
        path = os.path.abspath(filepath)
        if not os.path.exists(path):
            return f"Error: File does not exist at '{filepath}'."
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return f"File '{filepath}' (Size: {len(content)} chars):\n\n{content}"
    except Exception as e:
        return f"Error reading file: {str(e)}"


def tool_write_file(filepath: str, content: str) -> str:
    """Creates or overwrites a local file with the specified content."""
    try:
        path = os.path.abspath(filepath)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully wrote {len(content)} characters to '{filepath}'."
    except Exception as e:
        return f"Error writing file: {str(e)}"


def tool_list_directory(directory: str = ".") -> str:
    """Lists files and folders inside a specified directory path."""
    try:
        path = os.path.abspath(directory)
        if not os.path.exists(path):
            return f"Error: Directory '{directory}' does not exist."
        items = os.listdir(path)
        formatted = []
        for item in sorted(items):
            full = os.path.join(path, item)
            is_dir = os.path.isdir(full)
            prefix = "[DIR] " if is_dir else "[FILE]"
            formatted.append(f"{prefix} {item}")
        return f"Contents of '{directory}':\n" + "\n".join(formatted[:60])
    except Exception as e:
        return f"Error listing directory: {str(e)}"


def tool_calculate(expression: str) -> str:
    """Evaluates a mathematical expression safely."""
    # Allow only basic math symbols and numbers
    allowed = set("0123456789+-*/()., %^eEpi ")
    clean_expr = expression.replace("^", "**").replace("pi", "3.141592653589793")
    if not all(c in allowed for c in clean_expr):
        return "Error: Expression contains invalid characters."
    try:
        # Safe eval using limited builtins
        result = eval(clean_expr, {"__builtins__": None}, {})
        return f"Result: {result}"
    except Exception as e:
        return f"Calculation error: {str(e)}"


def tool_get_system_info() -> str:
    """Retrieves current operating system, CPU architecture, Python version, and working directory."""
    return json.dumps(
        {
            "os": platform.system(),
            "os_release": platform.release(),
            "architecture": platform.machine(),
            "python_version": platform.python_version(),
            "cwd": os.getcwd(),
            "user": os.getenv("USER", "developer"),
        },
        indent=2,
    )


# ─── TOOL DEFINITIONS / SCHEMAS ─────────────────────────────────────────────

AVAILABLE_TOOLS: Dict[str, Dict[str, Any]] = {
    "web_search": {
        "function": tool_web_search,
        "description": "Searches the web for latest articles, code snippets, documentation, or news.",
        "parameters": {"query": "The search query string (e.g. 'latest PyTorch features')"},
    },
    "fetch_url": {
        "function": tool_fetch_url,
        "description": "Fetches and reads text content from a given web page URL.",
        "parameters": {"url": "The full website URL to scrape (e.g. 'https://docs.python.org')"},
    },
    "execute_command": {
        "function": tool_execute_command,
        "description": "Runs a shell/bash command in the local environment and captures the output.",
        "parameters": {"command": "The shell command to execute (e.g. 'ls -la', 'python script.py')"},
    },
    "read_file": {
        "function": tool_read_file,
        "description": "Reads the entire content of a file from disk.",
        "parameters": {"filepath": "The relative or absolute file path to read"},
    },
    "write_file": {
        "function": tool_write_file,
        "description": "Creates or updates a file with the provided text content.",
        "parameters": {
            "filepath": "The file path to write to",
            "content": "The full code or text to write inside the file",
        },
    },
    "list_directory": {
        "function": tool_list_directory,
        "description": "Lists all files and subdirectories in a directory path.",
        "parameters": {"directory": "The folder path (defaults to '.')"},
    },
    "calculate": {
        "function": tool_calculate,
        "description": "Performs mathematical and arithmetic calculations.",
        "parameters": {"expression": "The math equation to solve (e.g. '2 ** 10 + 50 * 3')"},
    },
    "get_system_info": {
        "function": tool_get_system_info,
        "description": "Returns details about the host OS, Python environment, and CPU.",
        "parameters": {},
    },
}


def get_tools_prompt_description() -> str:
    """Generates the tool specification section for the LLM system prompt."""
    lines = ["You have access to the following tools:"]
    for name, data in AVAILABLE_TOOLS.items():
        params = ", ".join(f"{k}: {v}" for k, v in data["parameters"].items())
        lines.append(f"- `{name}({params})`: {data['description']}")
    return "\n".join(lines)


def execute_tool_call(tool_name: str, arguments: Dict[str, Any]) -> str:
    """Executes a tool by name with provided keyword arguments."""
    if tool_name not in AVAILABLE_TOOLS:
        return f"Error: Tool '{tool_name}' not found. Available tools: {list(AVAILABLE_TOOLS.keys())}"

    tool = AVAILABLE_TOOLS[tool_name]
    fn = tool["function"]
    try:
        return fn(**arguments)
    except TypeError as e:
        return f"Error calling '{tool_name}' with args {arguments}: {str(e)}"
    except Exception as e:
        return f"Unhandled error in tool '{tool_name}': {str(e)}"
