# ⚡ RoshZen Interactive Terminal — Complete Command Reference Manual

> **Welcome to the RoshZen Terminal CLI (`arun@roshzen: ~`)**  
> A high-performance, cyberpunk developer terminal emulator built into the RoshZen portfolio.  
> This terminal features **165+ Linux-style utilities, portfolio exploration commands, procedural Web Audio synthesizer, interactive retro games, and an AI Co-Pilot**.

---

## 📑 Table of Contents

1. [Terminal Navigation & Global Shortcuts](#1-terminal-navigation--global-shortcuts)
2. [Portfolio & Developer Identity](#2-portfolio--developer-identity)
3. [Linux Shell & File System (VFS)](#3-linux-shell--file-system-vfs)
4. [Networking & Remote Diagnostics](#4-networking--remote-diagnostics)
5. [Interactive Mini-Apps & Retro Games](#5-interactive-mini-apps--retro-games)
6. [Visual Effects & Themes (12 Palettes)](#6-visual-effects--themes-12-palettes)
7. [AI Co-Pilot & Smart Assistant](#7-ai-co-pilot--smart-assistant)
8. [Developer Tools, Insights & Metrics](#8-developer-tools-insights--metrics)
9. [Easter Eggs & Secret Commands](#9-easter-eggs--secret-commands)

---

## 1. Terminal Navigation & Global Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `t` (anywhere on page) | Automatically opens and focuses the interactive terminal. |
| `Ctrl + C` | Cancels current active running interactive game, component, or prompt. |
| `Ctrl + L` | Instantly clears terminal output history (identical to `clear`). |
| `Up / Down Arrows` | Navigates through previous shell command history. |
| `Tab` | Auto-completes commands and file/directory names. |
| `Esc` / Double Click Window Control | Exits full-screen mode and returns to normal view. |

---

## 2. Portfolio & Developer Identity

Explore Arun Roshan's background, skills, real-world builds, and contact channels.

| Command | Aliases | Description | Example |
| :--- | :--- | :--- | :--- |
| `whoami` | `about`, `bio` | Biographical summary, engineering philosophy, and background. | `whoami` |
| `skills` | `skill`, `techstack` | Categorized tech stack (Frontend, Languages, Frameworks, DB, Tools). | `skills` |
| `projects` | `project`, `portfolio` | List of featured builds (Love Vault, Zenith Finance, etc.) with links. | `projects` |
| `experience` | `timeline` | Chronological learning milestones, projects, and work history. | `experience` |
| `education` | - | Academic details, degree, and Computer Science Engineering coursework. | `education` |
| `certificates` | `certs` | Verified engineering certificates, credentials, and achievements. | `certificates` |
| `contact` | `hire`, `freelance` | Contact details + launches interactive contact form modal. | `contact` |
| `resume` | `download` | Downloads the latest `Arun_Roshan_Resume.pdf`. | `resume` |
| `social` | `socials` | Overview of all social media profiles and channels. | `social` |
| `github` | `gh stats`, `github stats` | Direct GitHub link + live interactive GitHub profile card. | `github` |
| `linkedin` | - | Opens Arun Roshan's professional LinkedIn profile. | `linkedin` |
| `goto <section>` | - | Smoothly scrolls the webpage to a target section (`home`, `about`, `skills`, `projects`, `journey`, `services`, `contact`). | `goto projects` |
| `roadmap` | - | Arun's current engineering focus and technical learning goals. | `roadmap` |

---

## 3. Linux Shell & File System (VFS)

The terminal includes a client-side **Virtual File System (VFS)** with directories like `/`, `/home/arun`, `/projects`, `/skills`, and `/docs`.

| Command | Syntax / Options | Description | Example |
| :--- | :--- | :--- | :--- |
| `help` | `help [command]` | Comprehensive command index or manual for a specific command. | `help games` |
| `man` | `man <command>` | Unix-style manual page detailing command synopsis and flags. | `man curl` |
| `ls` | `ls [-l, -a, -la, -lh] [path]` | Lists files and directories with permissions, sizes, and timestamps. | `ls -la /projects` |
| `cd` | `cd <path>` | Changes working directory (`..`, `~`, `/`, relative paths). | `cd /projects` |
| `pwd` | `pwd` | Displays the absolute path of the current working directory. | `pwd` |
| `cat` | `cat <file>` | Prints the full content of a file with line numbers and syntax styling. | `cat readme.md` |
| `head` | `head [-n count] <file>` | Prints the first N lines of a file (default: 5 lines). | `head -n 3 skills.json` |
| `tail` | `tail [-n count] <file>` | Prints the last N lines of a file (default: 5 lines). | `tail -n 2 about.txt` |
| `grep` | `grep <pattern> <file>` | Searches for text or regex patterns within a file. | `grep React projects.txt` |
| `mkdir` | `mkdir <dir>` | Creates a new directory in the Virtual File System. | `mkdir experiments` |
| `rmdir` | `rmdir <dir>` | Deletes an empty directory from the Virtual File System. | `rmdir experiments` |
| `touch` | `touch <file>` | Creates a new empty file or updates its timestamp. | `touch notes.txt` |
| `rm` | `rm [-rf] <path>` | Removes files or directories (system root protected). | `rm notes.txt` |
| `cp` | `cp <src> <dest>` | Copies a file from source to destination path. | `cp notes.txt backup.txt` |
| `mv` | `mv <src> <dest>` | Moves or renames a file in the VFS. | `mv notes.txt diary.txt` |
| `tree` | `tree [path]` | Renders an ASCII hierarchical tree diagram of directories and files. | `tree /` |
| `find` | `find [path] [-name pattern]` | Recursively searches for files matching a pattern. | `find / -name *.json` |
| `echo` | `echo [text] [$VAR]` | Prints text or evaluates environment variables (`$USER`, `$SHELL`). | `echo "Hello $USER"` |
| `wc` | `wc [-l, -w, -c] <file>` | Counts total lines, words, and characters in a file. | `wc -l about.txt` |
| `sed` | `sed 's/find/replace/' <file>` | Stream editor simulation for replacing text in files. | `sed 's/bug/feature/' code.js` |
| `awk` | `awk '{print $1}' <file>` | Pattern scanning and column text processing utility. | `awk '{print $2}' logs.txt` |
| `tr` | `tr [set1] [set2]` | Translates or transforms character sets (e.g. lowercase to uppercase). | `echo hello \| tr a-z A-Z` |
| `sort` | `sort [-r] <file>` | Sorts lines of text alphabetically or reverse numerically. | `sort names.txt` |
| `uniq` | `uniq <file>` | Filters out adjacent duplicate lines from file content. | `uniq records.txt` |
| `tee` | `tee <file>` | Duplicates standard input to terminal output and a file simultaneously. | `echo test \| tee out.txt` |
| `chmod` | `chmod <mode> <file>` | Simulates file permission modification (`755`, `644`, `+x`). | `chmod 755 run.sh` |
| `chown` | `chown <user:group> <file>` | Simulates file user and group ownership changes. | `chown arun:dev app.js` |
| `ps` | `ps [aux]` | Lists simulated active processes, PIDs, and memory usage. | `ps aux` |
| `top` | `top` | Dynamic interactive process monitor with CPU/RAM metrics. | `top` |
| `kill` | `kill <pid>` | Terminates a simulated background process or daemon. | `kill 1337` |
| `clear` | `clear` | Clears all prior command output from the terminal buffer. | `clear` |
| `history` | `history [-c]`, `!n` | Lists previous commands or replays command at index `n`. | `history` |
| `alias` | `alias [name='cmd']` | Defines or lists custom command aliases. | `alias ll='ls -la'` |
| `export` | `export KEY=VAL` | Exports custom environment variables into memory. | `export ENV=production` |
| `printenv` | `printenv [KEY]` | Prints all environment variables or queries a specific key. | `printenv SHELL` |
| `which` | `which <cmd>` | Locates the simulated executable binary path for a command. | `which git` |
| `whereis` | `whereis <cmd>` | Shows binary, source, and manual page locations. | `whereis node` |
| `basename` | `basename <path>` | Extracts file name component from a full path string. | `basename /src/App.jsx` |
| `dirname` | `dirname <path>` | Extracts directory portion from a full path string. | `dirname /src/App.jsx` |
| `uname` | `uname [-a]` | Prints OS kernel name, architecture, and version info. | `uname -a` |
| `hostname` | `hostname` | Displays the current host system identifier (`roshzen-terminal`). | `hostname` |
| `id` | `id` | Displays effective user ID (UID), group ID (GID), and groups. | `id` |
| `who` | `who`, `w` | Shows logged-in user session, terminal TTY, and login time. | `who` |
| `date` | `date` | Outputs current formatted system timestamp and date. | `date` |
| `uptime` | `uptime` | Displays system running time, active users, and load averages. | `uptime` |
| `free` | `free`, `memory` | Displays simulated memory statistics (total, used, free RAM). | `free -h` |
| `df` | `df`, `disk` | Displays disk partition filesystem usage and mount points. | `df -h` |
| `neofetch` | `sysinfo`, `systeminfo` | Displays ASCII logo with OS, Kernel, Uptime, Packages, Shell, and Memory. | `neofetch` |
| `diff` | `diff <file1> <file2>` | Compares two text files and highlights line-by-line differences. | `diff v1.txt v2.txt` |
| `sleep` | `sleep <seconds>` | Suspends command execution for the specified duration in seconds. | `sleep 2` |

---

## 4. Networking & Remote Diagnostics

| Command | Syntax / Options | Description | Example |
| :--- | :--- | :--- | :--- |
| `curl` | `curl <url>` | Simulates HTTP GET request with status code, headers, and payload. | `curl https://api.roshzen.in` |
| `wget` | `wget <url>` | Simulates downloading files from remote HTTP/HTTPS servers. | `wget https://site.com/app.zip` |
| `ping` | `ping <host>` | Simulates ICMP echo requests and calculates latency (ms). | `ping google.com` |
| `ifconfig` | `ifconfig`, `ip` | Inspects simulated network interfaces (`eth0`, `lo`) and IP config. | `ifconfig` |
| `netstat` | `netstat`, `ss` | Shows network connections, routing tables, and open listening ports. | `netstat -tuln` |
| `traceroute` | `traceroute <host>` | Simulates route hops, gateways, and packet latency to a remote server. | `traceroute github.com` |
| `nslookup` | `nslookup <domain>` | Queries DNS name servers for domain A/AAAA records. | `nslookup roshzen.in` |
| `dig` | `dig <domain>` | Detailed DNS lookup with answer and authority sections. | `dig roshzen.in` |
| `host` | `host <domain>` | Simple DNS domain-to-IP lookup tool. | `host roshzen.in` |
| `whois` | `whois <domain>` | Shows domain registration details, registrar, and creation dates. | `whois roshzen.in` |
| `weather` | `weather [city]` | Displays live ASCII weather forecasts for specified cities. | `weather Tokyo` |
| `qr` | `qr <text/url>` | Generates a clean, downloadable interactive SVG QR Code in terminal. | `qr https://roshzen.in` |
| `url` | `url <link>` | Parses URL components (protocol, hostname, pathname, query params). | `url https://roshzen.in/projects` |
| `open` | `open <url>`, `visit` | Opens external URLs or social links in a new browser tab. | `open https://github.com` |

---

## 5. Interactive Mini-Apps & Retro Games

Launch playable retro arcade games and real-time interactive utilities inside the terminal.

| Command | Arguments | Description & Controls |
| :--- | :--- | :--- |
| `clock` | - | Launches the **Live Digital Clock** component with continuous ticking. |
| `stopwatch` | `[start\|pause\|reset]` | High-precision digital stopwatch with lap and split timer controls. |
| `calc` | `<expression>` | Scientific mathematical evaluator powered by `mathjs` (`sin`, `cos`, `sqrt`, `pi`). |
| `radio` | `[play\|pause]` | Built-in procedural **432Hz Ambient Lo-Fi Synth** with audio waves and play/pause card. |
| `lofi` | `beats`, `music` | Alias for built-in Web Audio Lo-Fi synth player. |
| `games` | `[name]` | Opens the arcade game launcher menu with all 6 games. |
| `tictactoe` | - | Play **Tic-Tac-Toe** against an AI with real-time win/draw detection. |
| `snake` | - | Retro **Arcade Snake** with arrow key / WASD controls, food dots, and score tracking. |
| `pong` | - | 2D **Pong Arcade** against an automated opponent paddle with bounce physics. |
| `memory` | - | **Memory Flip Card** matching puzzle game. |
| `2048` | - | Sliding tile **2048 Puzzle** with arrow key controls and score tracker. |
| `quiz` | `[category]`, `trivia`| 4-choice **Developer Quiz Challenge** testing React, JS, Python, and CS concepts. |
| `challenge` | - | Algorithmic logic coding challenge with interactive code evaluation. |
| `hack` | `[target]` | Hollywood cyberpunk **Terminal Breach Simulator** with dynamic progress bars. |

---

## 6. Visual Effects & Themes (12 Palettes)

Customize the visual appearance and auditory feedback of both the terminal and entire portfolio.

| Command | Syntax / Options | Description |
| :--- | :--- | :--- |
| `theme` | `theme <name>` | Switches both terminal and entire portfolio color palette in real time. |
| `themes` | `themes` | Lists all 12 available color palettes with visual sample badges. |
| `matrix` | `matrix rain` | Toggles full-screen falling digital green matrix code canvas overlay. |
| `crt` | `scanlines`, `retro` | Toggles retro CRT scanlines and curved phosphorescent glow screen filter. |
| `sound` | `sound [on\|off]` | Toggles mechanical keyboard typing audio sound FX. |
| `fullscreen` | `fullscreen` | Toggles full-screen distraction-free Linux shell mode. |
| `banner` | `banner` | Re-renders the large ASCII RoshZen title banner. |
| `welcome` | `welcome` | Replays the realistic typewriter welcome message sequence. |
| `toast` | `toast <message>` | Spawns a floating glass HUD notification toast with audio chime. |

### Available Theme Palettes
- `default` / `red` — Authentic RoshZen Red (Native Tailwind v4 OKLCH Crimson)
- `green` — Matrix Emerald Hacker
- `blue` — Cyberpunk Neon Cyan
- `cyber` — Electric Cyber Gold & Yellow
- `matrix` — Ultra-Deep High-Contrast Terminal Green
- `dracula` — Classic Purple & Pink Dracula Spec
- `github` — Modern GitHub Dark Dimmed Theme
- `vscode` — Visual Studio Code Dark Modern
- `nord` — Arctic Ice Blue Nord Theme
- `synthwave` — 80s Retro Synthwave Violet & Fuchsia
- `tokyo` — Tokyo Night Deep Indigo

---

## 7. AI Co-Pilot & Smart Assistant

The terminal includes an integrated AI Co-Pilot with automated fallback:
1. **Cloud AI (Online):** Google Gemini 2.0 Flash / 1.5 Flash via Express backend.
2. **Offline Knowledge Engine (Air-Gapped):** Client-side knowledge engine answering queries about Arun's stack, experience, and contact info without internet.

| Command | Syntax | Description | Example |
| :--- | :--- | :--- | :--- |
| `ai` | `ai <question>` | Queries the AI Co-Pilot with markdown formatted terminal response. | `ai What stack does Arun use?` |
| `ask` | `ask <question>` | Alias for AI Co-Pilot query. | `ask How do I hire Arun?` |
| `chat` | `chat [question]` | Opens the interactive AI chat dialog card with suggested quick chips. | `chat` |

---

## 8. Developer Tools, Insights & Metrics

| Command | Description | Example |
| :--- | :--- | :--- |
| `devmode` | Inspects React 19, Vite 8, Tailwind v4, and Motion dependencies. | `devmode` |
| `blog` | `blog [react\|flutter\|ai]` — Technical engineering articles and guides. | `blog react` |
| `git` | Simulates git commands (`git status`, `git log`, `git branch`, `git commit`). | `git status` |
| `docker` | Simulates container status (`docker ps`, `docker images`). | `docker ps` |
| `npm` | Simulates package manager (`npm install`, `npm run build`). | `npm list` |
| `pnpm`, `yarn` | Package manager aliases for dependency management. | `pnpm audit` |
| `analytics` | Simulated visitor stats, page views, and geographic distribution. | `analytics` |
| `credits` | `thanks` — Open-source library credits, acknowledgments, and licenses. | `credits` |
| `version` | Displays RoshZen CLI version, build date, and commit hash. | `version` |

---

## 9. Easter Eggs & Secret Commands

| Command | Description |
| :--- | :--- |
| `sudo hire arun` | Grants superuser root access with congratulations badge for hiring Arun. |
| `sudo <anything>` | Reports that user is not in sudoers file and logs the incident. |
| `konami` | Unlocks infinite lives mode via the classic Konami code sequence. |
| `42` | Returns the answer to the ultimate question of life, universe, and everything. |
| `coffee` | ASCII art hot coffee cup break for developers. |
| `joke` | Random programmer jokes and computer science puns. |
| `quote` | Inspiring quotes from Alan Turing, Linus Torvalds, Dennis Ritchie, etc. |
| `rm -rf /` | Triggers a security protocol alert denying root directory destruction. |
| `links` | Navigates directly to Arun's private Link-in-Bio platform (`#links`). |
| `zenith` | Secret access shortcut to Zenith Finance platform overview. |

---

*Authored by Arun Roshan (RoshZen) • Updated September 2026*
