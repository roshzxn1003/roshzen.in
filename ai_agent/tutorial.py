#!/usr/bin/env python3
"""
ZenithAI Interactive AIML & AI Agent Learning Course
An interactive CLI tutorial teaching you AI & Machine Learning from first principles.
"""

import sys
import time

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


LESSONS = [
    {
        "id": 1,
        "title": "What is an AI Agent? (Architecture & ReAct Loop)",
        "content": """
🤖 LESSON 1: THE ANATOMY OF AN AI AGENT

A standard LLM (ChatGPT / Claude / Gemini) is a passive text prediction engine:
   Prompt ──> LLM ──> Text Output

An AI AGENT is active and autonomous:
   Goal ──> [Thought ──> Action ──> Tool Execution ──> Observation] ──> Final Solution

The ReAct (Reasoning + Acting) Paradigm:
1. Thought: The agent plans what information it needs.
2. Action: It selects a tool (e.g. `web_search`, `read_file`, `execute_command`).
3. Observation: The real world returns the tool's result.
4. Reflection: The agent evaluates if the goal is completed or if more steps are needed.
""",
        "quiz": {
            "q": "What makes an AI Agent different from a regular LLM chatbot?",
            "options": [
                "A) Agents can execute tools, observe feedback, and loop autonomously",
                "B) Agents have larger context windows only",
                "C) Agents do not use neural networks",
            ],
            "answer": "A",
        },
    },
    {
        "id": 2,
        "title": "Machine Learning Foundations (How Models Learn)",
        "content": """
🧠 LESSON 2: HOW MACHINE LEARNING ACTUALLY WORKS

Machine learning transforms inputs (X) into predictions (Y) using weights (W) and bias (B):
   Y = W * X + B

The 3-Step Training Loop:
1. Forward Pass: The model makes a guess (prediction).
2. Loss Calculation: How wrong was the guess? (e.g. Mean Squared Error or Cross-Entropy).
3. Backpropagation & Optimization: Gradient Descent calculates derivatives and updates weights:
   W_new = W_old - (Learning_Rate * Gradient)

Over millions of iterations, the model minimizes error until it accurately identifies patterns!
""",
        "quiz": {
            "q": "Which algorithm calculates the gradients of the loss function with respect to weights?",
            "options": [
                "A) Backpropagation (via the Chain Rule of calculus)",
                "B) Random Forest selection",
                "C) K-Means Clustering",
            ],
            "answer": "A",
        },
    },
    {
        "id": 3,
        "title": "Transformers & Attention Mechanism",
        "content": """
⚡ LESSON 3: TRANSFORMERS & SELF-ATTENTION

In 2017, the paper 'Attention Is All You Need' revolutionized AI by introducing Transformers.

The Core Formula: Self-Attention
   Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V

- Q (Query): What the word is looking for.
- K (Key): What the word represents.
- V (Value): The actual information content.

Why Transformers beat older RNNs:
• Highly parallelizable across GPUs (no sequential bottleneck).
• Captures relationships between words across thousands of tokens instantly.
""",
        "quiz": {
            "q": "What allows Transformers to process all tokens in a sentence at the exact same time?",
            "options": [
                "A) Positional Embeddings and Parallel Matrix Multiplication",
                "B) Recurrent hidden states",
                "C) Manual if-else conditions",
            ],
            "answer": "A",
        },
    },
    {
        "id": 4,
        "title": "RAG (Retrieval-Augmented Generation) & Vector Databases",
        "content": """
📚 LESSON 4: RAG & VECTOR EMBEDDINGS

Problem: LLMs hallucinate and don't know your private files or real-time data.
Solution: RAG (Retrieval-Augmented Generation)!

How RAG Works:
1. Chunking: Split long documents into small paragraphs (e.g. 500 characters).
2. Embeddings: Convert text chunks into high-dimensional vectors (e.g. 1536 floats).
3. Vector Database: Store in ChromaDB, Pinecone, or FAISS.
4. Similarity Search: Calculate Cosine Similarity between user query and text vectors.
5. Prompt Augmentation: Pass retrieved text chunks directly into the LLM context!
""",
        "quiz": {
            "q": "What metric is most commonly used to measure semantic similarity between two embedding vectors?",
            "options": [
                "A) Cosine Similarity (Dot product of normalized vectors)",
                "B) Alphabetical distance",
                "C) Character length difference",
            ],
            "answer": "A",
        },
    },
    {
        "id": 5,
        "title": "Tool Calling & Function Calling Mechanics",
        "content": """
🛠️ LESSON 5: TOOL & FUNCTION CALLING IN PRACTICE

How LLMs call functions in real code:
1. We describe Python functions to the LLM in JSON Schema.
2. The LLM produces a structured JSON output: `{"name": "fetch_weather", "args": {"city": "Tokyo"}}`.
3. Our Python backend executes the real function in the operating system.
4. The output is fed back to the LLM as an `Observation`.

You can inspect the complete working implementation in `ai_agent/tools.py` and `ai_agent/agent.py`!
""",
        "quiz": {
            "q": "Does the LLM run Python code directly inside its neural weights?",
            "options": [
                "A) No, the LLM outputs structured tool arguments; the backend environment executes the code",
                "B) Yes, LLMs have built-in Linux kernels inside their weights",
            ],
            "answer": "A",
        },
    },
]


def run_tutorial():
    print(f"\n{Colors.BOLD}{Colors.HEADER}======================================================{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.HEADER}   🎓 ZENITH-AI INTERACTIVE AIML & AGENT ACADEMY      {Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.HEADER}======================================================{Colors.RESET}")
    print(f"{Colors.CYAN}Master Artificial Intelligence, Machine Learning & Autonomous Agents!{Colors.RESET}\n")

    score = 0
    total = len(LESSONS)

    for lesson in LESSONS:
        print(f"\n{Colors.BOLD}{Colors.YELLOW}──────────────────────────────────────────────────────{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}📌 MODULE {lesson['id']}: {lesson['title']}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.YELLOW}──────────────────────────────────────────────────────{Colors.RESET}")
        print(lesson["content"])

        # Quiz
        quiz = lesson["quiz"]
        print(f"\n{Colors.BOLD}🧪 Quick Check:{Colors.RESET} {quiz['q']}")
        for opt in quiz["options"]:
            print(f"   {opt}")

        user_choice = input(f"\n{Colors.CYAN}Your Answer (A/B/C) ❯ {Colors.RESET}").strip().upper()
        if user_choice == quiz["answer"]:
            print(f"{Colors.BOLD}{Colors.GREEN}✓ Correct! Excellent grasp of the concept.{Colors.RESET}")
            score += 1
        else:
            print(f"{Colors.BOLD}{Colors.RED}✗ Not quite. The correct answer is ({quiz['answer']}).{Colors.RESET}")

        input(f"\n{Colors.DIM}[Press Enter to proceed to the next module...]{Colors.RESET}")

    print(f"\n{Colors.BOLD}{Colors.HEADER}======================================================{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.GREEN}🎉 CONGRATULATIONS! COURSE COMPLETED! Score: {score}/{total}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.HEADER}======================================================{Colors.RESET}")
    print(f"\n{Colors.CYAN}Next Steps to Practice:{Colors.RESET}")
    print("1. Run the AI Agent: `python3 agent.py`")
    print("2. Explore and add custom tools in: `ai_agent/tools.py`")
    print("3. Inspect the ReAct loop in: `ai_agent/agent.py`\n")


if __name__ == "__main__":
    run_tutorial()
