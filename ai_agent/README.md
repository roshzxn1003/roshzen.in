# 🤖 ZenithAI Autonomous Agent & AIML Academy

A modular, production-ready **Autonomous ReAct AI Agent** and **AIML Interactive Learning Academy** built in Python.

---

## 🌟 What This Project Includes

1. **Autonomous ReAct Agent Engine (`ai_agent/agent.py`)**:
   - **Reasoning Loop**: Implements the *Thought $\rightarrow$ Action $\rightarrow$ Observation $\rightarrow$ Reflection* execution cycle.
   - **Multi-step Problem Solving**: Breaks complex goals down into sequential tasks.
   - **Tool Ecosystem**: 8 built-in tools (Web Search, File I/O, Shell Command Execution, Web Scraping, Math Evaluator, System Specs).
   - **Multi-Provider Support**: Compatible with Google Gemini (`gemini-2.5-flash`, `gemini-1.5-flash`), OpenAI, or local offline mode.

2. **Persistent Memory Store (`ai_agent/memory.py`)**:
   - Stores short-term conversational context and persists facts to disk (`ai_agent_memory.json`).

3. **AIML Learning Academy (`ai_agent/tutorial.py`)**:
   - Interactive guided CLI course covering Machine Learning, Neural Networks, Transformers, Attention Mechanism, RAG, and Agentic Architectures with quick checks.

---

## 🚀 Quickstart

### 1. Run the Interactive Agent Shell
```bash
python3 agent.py
```
Type any objective or question:
```bash
zenith-agent ❯ Search the latest AI breakthroughs in 2026 and summarize them
zenith-agent ❯ Inspect my local directory and list all React components
zenith-agent ❯ Calculate 2 ** 16 + 500 * 4
```

### 2. Run a Single Autonomous Task
```bash
python3 agent.py "Create a python script called hello.py that prints hello world and run it"
```

### 3. Launch the AIML Learning Academy
```bash
python3 agent.py --tutorial
```

---

## 🛠️ Built-in Tool Registry (`ai_agent/tools.py`)

| Tool Name | Parameters | Purpose |
| :--- | :--- | :--- |
| `web_search` | `query: str` | Live search for documentation, articles, and news via DuckDuckGo |
| `fetch_url` | `url: str` | Scrapes and extracts clean text from any webpage |
| `execute_command` | `command: str` | Executes bash/shell commands safely with timeout controls |
| `read_file` | `filepath: str` | Reads files from the filesystem |
| `write_file` | `filepath: str, content: str` | Creates or updates local files |
| `list_directory` | `directory: str` | Explores directories and file trees |
| `calculate` | `expression: str` | Evaluates arithmetic and math formulas |
| `get_system_info` | `None` | Queries host OS, CPU architecture, and Python version |

---

## 🧠 How to Add Your Own Custom Tools

Adding a new tool takes less than 10 lines of code in `ai_agent/tools.py`:

```python
# 1. Define the Python function
def tool_get_weather(city: str) -> str:
    # Your logic here
    return f"The weather in {city} is 24°C and Sunny."

# 2. Register it in AVAILABLE_TOOLS
AVAILABLE_TOOLS["get_weather"] = {
    "function": tool_get_weather,
    "description": "Returns current weather for a city.",
    "parameters": {"city": "Name of the city (e.g. 'London')"},
}
```
The agent will automatically discover the tool and use it when relevant!

---

## 📚 Code Architecture Overview

```
roshzen.in/
├── agent.py               <-- Quick launcher (CLI & Interactive mode)
└── ai_agent/
    ├── __init__.py
    ├── agent.py           <-- Core ReAct Agent Engine & LLM Client
    ├── tools.py           <-- Tool Registry & Execution Handlers
    ├── memory.py          <-- Short-term buffer & persistent memory store
    ├── tutorial.py        <-- Interactive AIML Learning Course
    └── README.md          <-- Full Documentation
```
