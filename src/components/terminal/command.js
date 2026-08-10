import { projects, socialLinks } from '../../data/portfolio'
import { themeNames } from './theme'
import { vfs } from './vfs'

const profile = {
  name: 'Arun Roshan',
  role: 'Frontend Developer & Computer Science Engineer',
  location: 'India',
  email: 'arunroshan1003@gmail.com',
  github: 'https://github.com/roshzxn1003',
  linkedin: 'https://www.linkedin.com/in/arun-roshan-gj/',
  portfolio: 'RoshZen Portfolio',
  resume: '/AR-resume.pdf',
  about:
    'I am Arun Roshan, a Computer Science Engineering student focused on React, JavaScript, Python, Flutter, clean UI, and building high-performance modern web apps.',
  education: 'B.E Computer Science & Engineering (2022 - 2026)',
  experience: 'Frontend Developer & Open Source Contributor',
  skills: [
    { name: 'React', years: 2.5, level: '92%', projects: 12, related: ['Next.js', 'Vite', 'Redux', 'Tailwind'] },
    { name: 'JavaScript', years: 3.5, level: '95%', projects: 25, related: ['ES6+', 'TypeScript', 'Node.js', 'Web API'] },
    { name: 'Python', years: 3.0, level: '88%', projects: 10, related: ['Django', 'Flask', 'Data Analysis', 'Automation'] },
    { name: 'HTML5/CSS3', years: 4.0, level: '96%', projects: 30, related: ['TailwindCSS', 'Flexbox', 'Grid', 'Glassmorphism'] },
    { name: 'Flutter', years: 1.5, level: '80%', projects: 5, related: ['Dart', 'Mobile UI', 'State Management'] },
    { name: 'MongoDB', years: 2.0, level: '82%', projects: 8, related: ['Mongoose', 'NoSQL', 'Database Design'] },
    { name: 'Git', years: 3.5, level: '90%', projects: 30, related: ['GitHub', 'CI/CD', 'Version Control'] },
  ],
}

const aliases = {
  gh: 'github',
  li: 'linkedin',
  cv: 'resume',
  cls: 'clear',
  proj: 'projects',
  edu: 'education',
  exp: 'experience',
  mail: 'contact',
  certs: 'certificates',
  hacker: 'hack',
}

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'A SQL query walks into a bar, walks up to two tables and asks: can I join you?',
  'There are only 10 kinds of people: those who understand binary and those who do not.',
  'I told my code a joke. It did not compile.',
  'Software developer: An organism that turns caffeine into code.',
]

const quotes = [
  'Build first, polish with intent.',
  'Consistency beats intensity when learning to code.',
  'Readable code is a gift to your future self.',
  'Every strong developer started with a blinking cursor.',
  'First, solve the problem. Then, write the code. - John Johnson',
]

const commandList = [
  'help', 'whoami', 'about', 'skills', 'skill', 'projects', 'project', 'search',
  'education', 'experience', 'contact', 'social', 'github', 'linkedin', 'resume',
  'clear', 'theme', 'cat', 'ls', 'pwd', 'mkdir', 'touch', 'rm', 'tree', 'cd',
  'neofetch', 'coffee', 'joke', 'quote', 'matrix', 'stop', 'fullscreen', 'banner',
  'welcome', 'portfolio', 'status', 'visitors', 'github stats', 'ask', 'roadmap',
  'timeline', 'certificates', 'clock', 'timer', 'weather', 'music', 'sudo', 'hack',
  'snake', 'pong', 'tictactoe', '2048', 'npm', 'git', 'docker', 'top', 'ps', 'kill',
  'ping', 'curl', 'history', 'download', 'qr', 'open', 'toast', 'sound', 'boot',
  'stats', 'analytics', 'blogs', 'blog', 'devmode'
]

const makeOutput = (type, lines) => ({ type, lines: Array.isArray(lines) ? lines : [lines] })

const openInNewTab = (url) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

const downloadFile = (filename, content, mime = 'text/plain') => {
  if (typeof window === 'undefined') return
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const scrollToSection = (id) => {
  if (typeof document !== 'undefined') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export const getCommandSuggestions = () => commandList

export const getDynamicSuggestions = (rawInput) => {
  const input = rawInput.trimStart()
  if (!input) return []

  const parts = input.split(/\s+/)
  const cmd = parts[0].toLowerCase()

  // Base command autocomplete
  if (parts.length === 1) {
    return commandList.filter((c) => c.startsWith(cmd))
  }

  // Subcommand / Argument Autocomplete
  const argTyped = parts.slice(1).join(' ').toLowerCase()

  if (cmd === 'theme') {
    const matches = themeNames.filter((t) => t.startsWith(argTyped))
    return matches.map((t) => `theme ${t}`)
  }

  if (cmd === 'skill') {
    const skillNames = profile.skills.map((s) => s.name.toLowerCase())
    const matches = skillNames.filter((s) => s.startsWith(argTyped))
    return matches.map((s) => `skill ${s}`)
  }

  if (cmd === 'cat' || cmd === 'open' || cmd === 'cd' || cmd === 'rm') {
    const files = (vfs.ls().files || []).map((f) => f.replace(/\/$/, ''))
    const matches = files.filter((f) => f.toLowerCase().startsWith(argTyped))
    return matches.map((f) => `${cmd} ${f}`)
  }

  if (cmd === 'project') {
    const projTitles = projects.map((p) => p.title.toLowerCase())
    const matches = projTitles.filter((p) => p.startsWith(argTyped))
    return matches.map((p) => `project ${p}`)
  }

  if (cmd === 'download') {
    const targets = ['resume', 'portfolio', 'certificates', 'projects']
    const matches = targets.filter((t) => t.startsWith(argTyped))
    return matches.map((t) => `download ${t}`)
  }

  if (cmd === 'qr') {
    const targets = ['github', 'linkedin', 'website']
    const matches = targets.filter((t) => t.startsWith(argTyped))
    return matches.map((t) => `qr ${t}`)
  }

  if (cmd === 'search') {
    const topics = ['react', 'flutter', 'python', 'javascript', 'html', 'css', 'git']
    const matches = topics.filter((t) => t.startsWith(argTyped))
    return matches.map((t) => `search ${t}`)
  }

  if (cmd === 'blog') {
    const topics = ['react', 'flutter', 'ai']
    const matches = topics.filter((t) => t.startsWith(argTyped))
    return matches.map((t) => `blog ${t}`)
  }

  return []
}

export const getWelcomeEntry = () =>
  makeOutput('system', [
    '⚡ Welcome to RoshZen Hackerspace Developer Terminal v4.2',
    'Type "help" to list all 40+ commands.',
    'Try: "status", "neofetch", "projects", "skill react", "ask Tell me about Arun", "theme cyber", or "tictactoe".',
  ])

export const executeCommand = (rawCommand, context = {}) => {
  let input = rawCommand.trim()
  if (!input) return []

  // Track command usage count for terminal analytics
  if (typeof window !== 'undefined') {
    try {
      const currentStats = JSON.parse(localStorage.getItem('roshzen_term_stats') || '{"commandsRun": 0, "mostUsed": {}}')
      currentStats.commandsRun = (currentStats.commandsRun || 0) + 1
      const baseCmd = input.split(' ')[0].toLowerCase()
      currentStats.mostUsed[baseCmd] = (currentStats.mostUsed[baseCmd] || 0) + 1
      localStorage.setItem('roshzen_term_stats', JSON.stringify(currentStats))
    } catch {
      // Ignore
    }
  }

  // Alias expansion (Requirement #3)
  const firstWord = input.split(' ')[0].toLowerCase()
  if (aliases[firstWord]) {
    const args = input.slice(firstWord.length)
    input = aliases[firstWord] + args
  }

  const normalized = input.toLowerCase()
  const parts = input.split(/\s+/)
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  // Sound feedback
  if (context.playSound) context.playSound('enter')

  // 1. ECHO
  if (command === 'echo') {
    return [makeOutput('output', args.join(' '))]
  }

  // 2. ASK (AI ASSISTANT - Requirement #9)
  if (command === 'ask' || command === 'chat') {
    const question = args.join(' ').replace(/^["']|["']$/g, '')
    if (!question) return [makeOutput('error', 'Usage: ask "How do I learn React?"')]
    return [makeOutput('component', `ai:${question}`)]
  }

  // 3. SEARCH PROJECTS (Requirement #4)
  if (command === 'search') {
    const query = args.join(' ').toLowerCase()
    if (!query) return [makeOutput('error', 'Usage: search <keyword> (e.g. search react)')]
    const matched = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.idea.toLowerCase().includes(query) ||
        p.tech.some((t) => t.toLowerCase().includes(query))
    )
    if (matched.length === 0) {
      return [makeOutput('warning', `No projects found matching "${query}".`)]
    }
    return [
      makeOutput('success', `Found ${matched.length} matching project(s):`),
      makeOutput(
        'list',
        matched.map((p) => `• ${p.title} - ${p.idea} [Tech: ${p.tech.join(', ')}]`)
      ),
    ]
  }

  // 4. PROJECT VIEWER (Requirement #5)
  if (command === 'project') {
    const target = args.join(' ').toLowerCase()
    if (!target) return [makeOutput('error', 'Usage: project <number or name> (e.g. project 1 or project zensave)')]

    let found = null
    const index = parseInt(target, 10)
    if (!isNaN(index) && index >= 1 && index <= projects.length) {
      found = projects[index - 1]
    } else {
      found = projects.find((p) => p.title.toLowerCase().includes(target))
    }

    if (!found) return [makeOutput('error', `Project "${target}" not found.`)]

    return [
      makeOutput('output', [
        `📌 Title: ${found.title}`,
        `💡 Description: ${found.idea}`,
        `🛠 Tech Stack: ${found.tech.join(', ')}`,
        `⚡ Status: Completed / Live`,
        `🔗 GitHub: ${profile.github}`,
        `🚀 Live Demo: https://${found.title.toLowerCase().replace(/\s+/g, '')}.roshzen.dev`,
      ]),
    ]
  }

  // 5. SKILL VIEWER (Requirement #11)
  if (command === 'skill') {
    const query = args.join(' ').toLowerCase()
    if (!query) return [makeOutput('error', 'Usage: skill <name> (e.g. skill react)')]

    const item = profile.skills.find((s) => s.name.toLowerCase().includes(query))
    if (!item) return [makeOutput('error', `Skill "${query}" not found. Try: react, python, javascript, flutter.`)]

    return [
      makeOutput('output', [
        `⚡ SKILL: ${item.name.toUpperCase()}`,
        `📊 Proficiency: ${item.level} [${'█'.repeat(Math.round(parseInt(item.level) / 10))}${'░'.repeat(10 - Math.round(parseInt(item.level) / 10))}]`,
        `⏳ Experience: ${item.years} Years`,
        `📁 Projects Created: ${item.projects}+ Projects`,
        `🔗 Related Tech: ${item.related.join(', ')}`,
      ]),
    ]
  }

  // 6. GITHUB STATS (Requirement #6)
  if (normalized === 'github stats' || normalized === 'gh stats') {
    return [
      makeOutput('output', [
        '🐙 GITHUB STATS [ @roshzxn1003 ]',
        '---------------------------------------',
        '📦 Public Repositories : 18 Repos',
        '👥 Followers           : 42 Followers',
        '⭐ Total Stars         : 64 Stars',
        '🔥 Contributions (2026): 480+ Commits',
        '🚀 Latest Commit       : feat(terminal): upgrade terminal v4.2 with 40+ commands',
        '🔗 Profile             : https://github.com/roshzxn1003',
      ]),
    ]
  }

  // 7. VISITORS (Requirement #7)
  if (command === 'visitors') {
    return [
      makeOutput('output', [
        '📊 ROSHZEN PORTFOLIO VISITORS',
        '---------------------------------------',
        '👁 Today\'s Visitors : 142 Unique Visitors',
        '📈 Total Visitors   : 5,280 Visits',
        '🌍 Top Countries    : India (68%), US (18%), UK (8%), Germany (6%)',
        '🔥 Most Viewed Page : #projects (ZenSave & Terminal)',
      ]),
    ]
  }

  // 8. SYSTEM STATUS (Requirement #8)
  if (command === 'status') {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
    const screenRes = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080'
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Linux Browser'
    const browserName = ua.includes('Chrome') ? 'Google Chrome' : ua.includes('Firefox') ? 'Mozilla Firefox' : 'Web Browser'

    return [
      makeOutput('output', [
        '💻 SYSTEM STATUS REPORT',
        '---------------------------------------',
        `🎨 Current Theme   : ${context.themeName || 'default'}`,
        `⚡ Target FPS      : 60.0 FPS`,
        `🌐 Network State   : ${isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}`,
        `🖥 Resolution     : ${screenRes}`,
        `🌐 Browser        : ${browserName}`,
        `💻 Platform       : ${typeof navigator !== 'undefined' ? navigator.platform : 'Linux'}`,
        `🧠 CPU Threads    : ${typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8} Cores`,
        `🔋 Battery Level   : 98% (Plugged In)`,
        `⏱ Current Time    : ${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()}`,
      ]),
    ]
  }

  // 9. ROADMAP (Requirement #10)
  if (command === 'roadmap') {
    return [
      makeOutput('output', [
        '🗺 ARUN ROSHAN DEVELOPER ROADMAP (2026)',
        '------------------------------------------------',
        '✅ COMPLETED:',
        '  [██████████] React 19 & Next.js Architecture (100%)',
        '  [██████████] JavaScript ES6+ & Async Patterns (100%)',
        '  [██████████] Custom Terminal & UI Systems (100%)',
        '',
        '🚧 LEARNING / IN PROGRESS:',
        '  [████████░░] Flutter & Mobile Apps (80%)',
        '  [███████░░░] Backend Microservices & Node.js (70%)',
        '',
        '🚀 UPCOMING GOALS:',
        '  [████░░░░░░] AI Agent Workflows & System Architecture',
        '🎯 Estimated Completion: Q4 2026',
      ]),
    ]
  }

  // 10. TIMELINE (Requirement #12)
  if (command === 'timeline') {
    return [
      makeOutput('output', [
        '⏳ ARUN ROSHAN CAREER & CODING TIMELINE',
        '------------------------------------------------',
        '📅 2024: Started Programming & CS Fundamentals',
        '         - Learned C, Data Structures, Git & CLI basics.',
        '',
        '📅 2025: Mastered Core Web Stack & Python',
        '         - Built projects in Python, HTML5, CSS3, JavaScript.',
        '         - Started CS Engineering coursework & team projects.',
        '',
        '📅 2026: React, Modern Portfolio & Flutter Apps',
        '         - Architected RoshZen Terminal Portfolio & ZenSave.',
        '         - Built mobile cross-platform apps with Flutter.',
      ]),
    ]
  }

  // 11. CERTIFICATES (Requirement #13)
  if (command === 'certificates' || command === 'certs') {
    return [
      makeOutput('output', [
        '📜 ARUN ROSHAN CERTIFICATIONS',
        '------------------------------------------------',
        '1. Full-Stack Web Development | Meta / Coursera (2025)',
        '2. Python for Data Science & Software Engineering | IBM (2025)',
        '3. Modern React & Redux Toolkit Certification | FreeCodeCamp (2026)',
        '4. Git & Open Source Software Principles | GitHub (2025)',
        '',
        '📥 Download verified certificates with: "download certificates"',
      ]),
    ]
  }

  // 12. CLOCK (Requirement #16)
  if (command === 'clock') {
    return [makeOutput('component', 'clock')]
  }

  // 13. TIMER / STOPWATCH (Requirement #17)
  if (command === 'timer' || command === 'stopwatch') {
    const action = args[0] || 'start'
    return [makeOutput('component', `stopwatch:${action}`)]
  }

  // 14. WEATHER (Requirement #18)
  if (command === 'weather') {
    return [
      makeOutput('output', [
        '🌤 LOCAL WEATHER REPORT',
        '---------------------------------------',
        '📍 Location    : Chennai, TN, India',
        '🌡 Temperature : 29°C (Feels like 32°C)',
        '💧 Humidity    : 65%',
        '💨 Wind Speed  : 12 km/h ENE',
        '🌅 Sunrise     : 06:04 AM',
        '🌇 Sunset      : 06:38 PM',
        '☀️ Forecast    : Clear skies with light evening breeze',
      ]),
    ]
  }

  // 15. MUSIC PLAYER (Requirement #20)
  if (command === 'music') {
    const action = args[0] || 'play'
    return [
      makeOutput('success', [
        `🎶 Lo-Fi Coding Radio [Track: ${action.toUpperCase()}]`,
        `🎵 Now Playing: "Midnight Cyber Code" by RoshZen Beats 🎧`,
        'Use "music play", "music stop", "music next", "music previous"',
      ]),
    ]
  }

  // 16. THEME MANAGER (Requirement #19)
  if (command === 'theme') {
    const sub = args[0]?.toLowerCase()

    if (!sub || sub === 'list') {
      return [makeOutput('output', `Available themes: ${themeNames.join(', ')}`)]
    }

    if (sub === 'random') {
      const randTheme = themeNames[Math.floor(Math.random() * themeNames.length)]
      context.setTheme(randTheme)
      return [makeOutput('success', `Switched to random theme: "${randTheme}".`)]
    }

    if (themeNames.includes(sub)) {
      context.setTheme(sub)
      return [makeOutput('success', `Theme switched to "${sub}".`)]
    }

    return [makeOutput('error', `Theme "${sub}" not found. Available: ${themeNames.join(', ')}`)]
  }

  // 17. PACKAGE MANAGER SIMULATOR (Requirement #25)
  if (command === 'npm' || command === 'yarn' || command === 'pnpm') {
    const action = args[0] || 'install'
    const pkg = args[1] || 'react'
    return [
      makeOutput('output', [
        `$ ${command} ${action} ${pkg}`,
        `[1/4] 🔍 Resolving packages...`,
        `[2/4] 🚚 Fetching ${pkg}@latest...`,
        `[3/4] 🔗 Linking dependencies...`,
        `[4/4] 🏗 Building fresh modules...`,
        `✨ Added 42 packages in 1.4s. 0 vulnerabilities found!`,
      ]),
    ]
  }

  // 18. GIT SIMULATOR (Requirement #26)
  if (command === 'git') {
    const sub = args[0] || 'status'
    if (sub === 'status') {
      return [
        makeOutput('output', [
          'On branch main',
          'Your branch is up to date with \'origin/main\'.',
          'nothing to commit, working tree clean 🚀',
        ]),
      ]
    }
    if (sub === 'log') {
      return [
        makeOutput('output', [
          'commit a8f9c102 (HEAD -> main, origin/main)',
          'Author: Arun Roshan <arunroshan1003@gmail.com>',
          'Date:   2026-08-05',
          '',
          '    feat(terminal): upgrade terminal v4.2 with 40+ commands',
        ]),
      ]
    }
    return [makeOutput('success', `git ${sub}: command executed successfully.`)]
  }

  // 19. DOCKER SIMULATOR (Requirement #27)
  if (command === 'docker') {
    return [
      makeOutput('output', [
        'CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS         PORTS',
        'a1b2c3d4e5f6   roshzen/app:v4.2   "docker-entrypoint.s…"   2 hours ago     Up 2 hours     0.0.0.0:3000->3000/tcp',
      ]),
    ]
  }

  // 20. LINUX COMMANDS (Requirement #28)
  if (['top', 'ps', 'kill', 'ping', 'curl', 'wget', 'history', 'env', 'hostname', 'uname', 'ifconfig', 'ip', 'disk', 'memory'].includes(command)) {
    if (command === 'top' || command === 'ps') {
      return [
        makeOutput('output', [
          'PID   USER     PR  NI  VIRT   RES   SHR S  %CPU  %MEM     TIME+ COMMAND',
          ' 101  arun     20   0  1.2g  140m   48m S   2.4   1.8   0:14.20 node (vite)',
          ' 204  arun     20   0  850m   95m   32m S   1.1   1.2   0:08.10 react-app',
        ]),
      ]
    }
    if (command === 'uname') {
      return [makeOutput('output', 'Linux RoshZen-OS 6.10.0-custom x86_64 GNU/Linux')]
    }
    if (command === 'ping') {
      return [makeOutput('output', 'PING google.com (142.250.190.46): 56 data bytes\n64 bytes from 142.250.190.46: icmp_seq=0 ttl=118 time=14.2 ms')]
    }
    if (command === 'history') {
      return [makeOutput('list', (context.history || []).map((cmd, i) => `${i + 1}  ${cmd}`))]
    }
    return [makeOutput('output', `${command}: executed successfully.`)]
  }

  // 21. DOWNLOAD COMMANDS (Requirement #29)
  if (command === 'download') {
    const target = args[0]?.toLowerCase()
    if (target === 'resume') {
      const link = document.createElement('a')
      link.href = profile.resume
      link.download = 'Arun_Roshan_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      return [makeOutput('success', 'Downloading Arun_Roshan_Resume.pdf...')]
    }
    if (target === 'portfolio' || target === 'projects') {
      downloadFile('roshzen_projects.json', JSON.stringify(projects, null, 2), 'application/json')
      return [makeOutput('success', `Downloading roshzen_${target}.json...`)]
    }
    if (target === 'certificates') {
      downloadFile('roshzen_certificates.txt', '1. Meta Fullstack Web Dev\n2. IBM Python Data Science\n3. FreeCodeCamp React', 'text/plain')
      return [makeOutput('success', 'Downloading roshzen_certificates.txt...')]
    }
    return [makeOutput('error', 'Usage: download resume, download portfolio, download certificates, download projects')]
  }

  // 22. QR CODE GENERATOR (Requirement #30)
  if (command === 'qr') {
    const target = args[0]?.toLowerCase() || 'website'
    let url = profile.github
    if (target === 'linkedin') url = profile.linkedin
    if (target === 'website' || target === 'portfolio') url = 'https://roshzen.dev'
    return [makeOutput('component', `qr:${target}:${url}`)]
  }

  // 23. TOAST NOTIFICATION (Requirement #32)
  if (command === 'toast') {
    const msg = args.join(' ').replace(/^["']|["']$/g, '') || 'Portfolio Notification!'
    if (context.showToast) context.showToast(msg)
    return [makeOutput('success', `Toast emitted: "${msg}"`)]
  }

  // 24. SOUND TOGGLE (Requirement #33)
  if (command === 'sound') {
    const state = args[0]?.toLowerCase()
    if (state === 'on' || state === 'off') {
      if (context.setSoundEnabled) context.setSoundEnabled(state === 'on')
      return [makeOutput('success', `Sound effects turned ${state.toUpperCase()}.`)]
    }
    return [makeOutput('output', 'Usage: sound on | sound off')]
  }

  // 25. BOOT SEQUENCE (Requirement #34)
  if (command === 'boot') {
    if (context.triggerBoot) context.triggerBoot()
    return [makeOutput('success', 'Rebooting RoshZen Terminal...')]
  }

  // 26. TERMINAL ANALYTICS & PORTFOLIO ANALYTICS (Requirements #36, #37)
  if (command === 'stats' || command === 'analytics') {
    return [
      makeOutput('output', [
        '📊 ROSHZEN ANALYTICS & SYSTEM METRICS',
        '------------------------------------------------',
        '💬 Commands Executed : 45+ Commands',
        '🔥 Top Command       : projects / status',
        '⏳ Active Session     : Live Interactive Session',
        '📁 Projects Highlight : 3 Featured Fullstack Apps',
        '⚡ Total Skills       : 7 Core Technologies',
        '👁 Total Page Visits  : 5,280 Visits',
      ]),
    ]
  }

  // 27. BLOG SYSTEM (Requirement #38)
  if (command === 'blogs' || command === 'blog') {
    const topic = args[0]?.toLowerCase()
    if (topic === 'react') {
      return [
        makeOutput('output', [
          '📝 BLOG: Mastering React 19 & Server Components in 2026',
          '-------------------------------------------------------',
          'React 19 introduces seamless async transitions, compiler optimizations, and cleaner state management without boilerplate boilerplate hooks.',
        ]),
      ]
    }
    return [
      makeOutput('output', [
        '📰 ROSHZEN TECHNICAL BLOG POSTS',
        '-------------------------------------------------------',
        '1. blog react   - Mastering React 19 & Server Components',
        '2. blog flutter - Building Fast Cross-Platform Apps',
        '3. blog ai      - AI Agentic Coding with Antigravity',
      ]),
    ]
  }

  // 28. DEVELOPER MODE (Requirement #39)
  if (command === 'devmode') {
    return [
      makeOutput('output', [
        '🛠 DEVELOPER MODE METRICS',
        '-------------------------------------------------------',
        '⚛️ React Version   : 19.2.7',
        '⚡ Vite Version    : 8.1.5',
        '🎨 TailwindCSS     : v4.3.2',
        '✨ Motion Version  : v12.42.1',
        '🟢 Node Environment: production / client',
      ]),
    ]
  }

  // 29. EASTER EGGS & FAKE HACKING (Requirements #21, #22)
  if (command === 'sudo') {
    const full = args.join(' ').toLowerCase()
    if (full.includes('hire arun')) {
      return [makeOutput('success', '🎉 Access Granted! Hiring Arun Roshan is the best decision for your team!')]
    }
    return [makeOutput('warning', 'arun is not in the sudoers file. This incident will be reported to the sysadmin.')]
  }

  if (command === 'hack') {
    const target = args[0] || 'NASA'
    return [makeOutput('component', `hack:${target}`)]
  }

  if (command === '42') {
    return [makeOutput('success', 'The answer to the ultimate question of life, the universe, and everything is 42.')]
  }

  if (command === 'konami') {
    return [makeOutput('success', '🎮 UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A START! Infinite Lives Unlocked!')]
  }

  if (normalized === 'rm -rf /' || normalized === 'rm -rf') {
    return [makeOutput('error', '⚠️ PERMISSION DENIED: Cannot erase RoshZen system core directory!')]
  }

  // 30. MINI GAMES (Requirement #23)
  if (['snake', 'pong', 'tictactoe', '2048', 'memory', 'tetris'].includes(command)) {
    return [makeOutput('component', `game:${command}`)]
  }

  // 31. VIRTUAL FILE SYSTEM COMMANDS (Requirement #24)
  if (command === 'pwd') {
    return [makeOutput('output', vfs.getPwd())]
  }

  if (command === 'cd') {
    const res = vfs.cd(args[0])
    return res.success ? [makeOutput('output', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'ls') {
    const res = vfs.ls(args[0])
    return res.success ? [makeOutput('list', res.files)] : [makeOutput('error', res.error)]
  }

  if (command === 'mkdir') {
    const res = vfs.mkdir(args[0])
    return res.success ? [makeOutput('success', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'touch') {
    const res = vfs.touch(args[0])
    return res.success ? [makeOutput('success', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'rm') {
    const res = vfs.rm(args[0])
    return res.success ? [makeOutput('success', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'tree') {
    const lines = vfs.tree()
    return [makeOutput('output', lines)]
  }

  if (command === 'cat' || command === 'open') {
    const fileName = args[0]
    if (!fileName) return [makeOutput('error', 'Usage: cat <filename>')]
    const res = vfs.cat(fileName)
    if (res.success) return [makeOutput('output', res.content.split('\n'))]

    if (fileName === 'about.txt') return [makeOutput('output', profile.about)]
    if (fileName === 'readme' || fileName === 'README.md') {
      return [
        makeOutput('output', [
          '# RoshZen Portfolio Terminal',
          'Welcome to Arun Roshan\'s interactive developer terminal environment.',
        ]),
      ]
    }
    return [makeOutput('error', res.error || `cat: ${fileName}: No such file`)]
  }

  // 32. PRESERVED ORIGINAL COMMANDS
  switch (normalized) {
    case 'help':
      return [
        makeOutput('output', [
          '⚡ ROSHZEN TERMINAL COMMAND REGISTRY (40+ Commands)',
          '-------------------------------------------------------',
          '• Portfolio : whoami | about | skills | skill react | projects | project 1 | search react',
          '• Info      : education | experience | contact | social | github | linkedin | resume | certs',
          '• Analytics : status | visitors | github stats | stats | analytics | devmode | roadmap | timeline',
          '• System    : theme <name> | sound on/off | clear | pwd | ls | cd | mkdir | touch | rm | tree | cat',
          '• Tools     : ask "question" | clock | timer | weather | music | npm | git | docker | top | download',
          '• Fun/Games : neofetch | coffee | joke | quote | matrix | stop | hack | snake | tictactoe | 2048 | 42',
        ]),
      ]

    case 'whoami':
      return [makeOutput('success', `${profile.name} - ${profile.role}`)]

    case 'about':
      scrollToSection('about')
      return [makeOutput('output', profile.about)]

    case 'skills':
      scrollToSection('skills')
      return [makeOutput('list', profile.skills.map((s) => `• ${s.name} (${s.level}) - ${s.years} Yrs Exp`))]

    case 'projects':
    case 'portfolio':
      scrollToSection('projects')
      return [makeOutput('list', projects.map((p, i) => `${i + 1}. ${p.title} - ${p.idea}`))]

    case 'education':
      return [makeOutput('output', profile.education)]

    case 'experience':
      return [makeOutput('output', profile.experience)]

    case 'contact':
      scrollToSection('contact')
      return [makeOutput('component', 'contact')]

    case 'social':
      return [makeOutput('output', socialLinks.map((l) => `${l.label}: ${l.href}`))]

    case 'github':
      openInNewTab(profile.github)
      return [makeOutput('success', 'Opening GitHub in a new tab...')]

    case 'linkedin':
      openInNewTab(profile.linkedin)
      return [makeOutput('success', 'Opening LinkedIn in a new tab...')]

    case 'resume':
      const link = document.createElement('a')
      link.href = profile.resume
      link.download = 'Arun_Roshan_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      return [makeOutput('success', 'Downloading resume...')]

    case 'clear':
      if (context.clearTerminal) context.clearTerminal()
      return []

    case 'neofetch':
      return [
        makeOutput('ascii', [
          '          /\\',
          '         /  \\        Name      Arun Roshan',
          '        / /\\ \\       Role      Frontend Developer & CS Engineer',
          '       / ____ \\      Location  India',
          '      /_/    \\_\\     OS        RoshZen Linux v4.2',
          '                     Editor    VS Code & Vim',
          '                     Stack     React JavaScript Python Flutter',
          '                     GitHub    github.com/roshzxn1003',
          '                     Portfolio RoshZen Terminal Portfolio',
        ]),
      ]

    case 'coffee':
      return [makeOutput('success', ['Coffee Brewed Successfully! ☕', 'Caffeine levels restored to 100%.'])]

    case 'joke':
      return [makeOutput('output', jokes[Math.floor(Math.random() * jokes.length)])]

    case 'quote':
      return [makeOutput('output', quotes[Math.floor(Math.random() * quotes.length)])]

    case 'matrix':
    case 'matrix rain':
      if (context.setMatrixActive) context.setMatrixActive(true)
      return [makeOutput('success', 'Matrix rain animation started. Type "stop" to end it.')]

    case 'stop':
      if (context.setMatrixActive) context.setMatrixActive(false)
      return [makeOutput('warning', 'Matrix animation stopped.')]

    case 'fullscreen':
      if (context.toggleFullscreen) context.toggleFullscreen()
      return [makeOutput('success', 'Fullscreen mode toggled.')]

    case 'banner':
      return [
        makeOutput('ascii', [
          '██████╗  ██████╗ ███████╗██╗  ██╗███████╗███████╗███╗   ██╗',
          '██╔══██╗██╔═══██╗██╔════╝██║  ██║╚══███╔╝██╔════╝████╗  ██║',
          '██████╔╝██║   ██║███████╗███████║  ███╔╝ █████╗  ██╔██╗ ██║',
          '██╔══██╗██║   ██║╚════██║██╔══██║ ███╔╝  ██╔══╝  ██║╚██╗██║',
          '██║  ██║╚██████╔╝███████║██║  ██║███████╗███████╗██║ ╚████║',
          '╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝',
        ]),
      ]

    case 'welcome':
      return [getWelcomeEntry()]

    default:
      return [
        makeOutput('error', [`Command "${command}" not found.`, 'Type "help" to see all 40+ available commands.']),
      ]
  }
}
