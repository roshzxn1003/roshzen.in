import { projects, socialLinks } from '../../data/portfolio.js'
import { themeNames } from './theme.js'
import { vfs } from './vfs.js'

const profile = {
  name: 'Arun Roshan',
  role: 'Frontend Developer & Computer Science Engineer',
  location: 'India',
  email: 'arunroshan1003@gmail.com',
  github: 'https://github.com/roshzxn1003',
  linkedin: 'https://www.linkedin.com/in/arun-roshan-gj/',
  instagram: 'https://instagram.com/rosh.zxn',
  youtube: 'https://www.youtube.com/@roshzxn',
  portfolio: 'https://roshzen.in',
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
  cmatrix: 'matrix',
  sys: 'sysinfo',
  ver: 'version',
  demo: 'runall',
  testall: 'runall',
  batch: 'runall',
  suite: 'runall',
  'run-all': 'runall',
  links: 'roshzen-links',
  linktree: 'roshzen-links',
  linkhub: 'roshzen-links',
  goto: 'open',
  visit: 'open',
  url: 'open',
  trivia: 'quiz',
  challenge: 'quiz',
}

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'A SQL query walks into a bar, walks up to two tables and asks: can I join you?',
  'There are only 10 kinds of people: those who understand binary and those who do not.',
  'I told my code a joke. It did not compile.',
  'Software developer: An organism that turns caffeine into code.',
  'Real programmers count from 0.',
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
  'head', 'tail', 'wc', 'grep', 'find', 'cp', 'mv', 'rmdir', 'chmod', 'chown',
  'df', 'free', 'who', 'w', 'id', 'groups', 'alias', 'export', 'printenv', 'env',
  'basename', 'dirname', 'sort', 'uniq', 'tr', 'tee', 'diff', 'nslookup', 'dig', 'host',
  'traceroute', 'netstat', 'ss', 'sleep', 'which', 'whereis', 'man', 'sed', 'awk',
  'neofetch', 'coffee', 'joke', 'quote', 'matrix', 'cmatrix', 'stop', 'fullscreen', 'banner',
  'welcome', 'portfolio', 'status', 'visitors', 'github stats', 'ask', 'roadmap',
  'timeline', 'certificates', 'clock', 'timer', 'weather', 'music', 'playlist', 'sudo', 'hack',
  'snake', 'pong', 'tictactoe', '2048', 'games', 'play', 'npm', 'git', 'docker', 'top', 'ps', 'kill',
  'ping', 'curl', 'wget', 'history', 'download', 'qr', 'open', 'toast', 'sound', 'boot',
  'stats', 'analytics', 'blogs', 'blog', 'devmode', 'uptime', 'date', 'time', 'uname',
  'sysinfo', 'calc', 'echo', 'whois', 'hire', 'freelance', 'credits', 'thanks', 'motd', 'version',
  'ifconfig', 'ip', 'hostname', 'disk', 'memory', 'runall', 'demo', 'testall', 'batch', 'suite',
  'roshzen-links', 'links', 'open', 'goto', 'visit', 'url', 'zenith', 'techstack', 'socials', 'hire',
  'quiz', 'trivia', 'challenge', 'crt', 'lofi', 'github'
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

  if (['cat', 'open', 'cd', 'rm', 'head', 'tail', 'wc', 'grep', 'cp', 'mv', 'rmdir', 'chmod', 'chown', 'sort', 'uniq', 'diff', 'man'].includes(cmd)) {
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
    const targets = ['website', 'portfolio', 'github', 'linkedin', 'instagram', 'youtube', 'email', 'whatsapp', 'resume', 'list']
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

  if (cmd === 'quiz') {
    const topics = ['react', 'js', 'python', 'git', 'css', 'all']
    const matches = topics.filter((t) => t.startsWith(argTyped))
    return matches.map((t) => `quiz ${t}`)
  }

  return []
}

export const getWelcomeEntry = () =>
  makeOutput('welcome', [
    '⚡ Welcome to RoshZen Hackerspace Developer Terminal v4.2',
    'Type "help" to list all 40+ commands.',
    'Try: "quiz", "status", "neofetch", "projects", "skill react", "ask Tell me about Arun", "theme cyber", or "tictactoe".',
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

  // 0. OPEN ANY URL / GOTO / VISIT / SHORTCUT HANDLER
  if (command === 'open' || command === 'goto' || command === 'visit' || command === 'url') {
    const rawTarget = args.join(' ').trim()
    if (!rawTarget) {
      return [
        makeOutput('header', '⚡ Terminal URL Launcher Usage:'),
        makeOutput('list', [
          '  open <url>         : Open ANY website URL (e.g. open google.com, open https://x.com)',
          '  open github        : Open GitHub repository profile',
          '  open linkedin      : Open LinkedIn professional network',
          '  open youtube       : Open YouTube channel',
          '  open instagram     : Open Instagram profile',
          '  open links         : Open RoshZen Private LinkHub (/links)',
          '  open admin         : Open RoshZen Protected Admin (/admin)',
          '  open resume        : Download/view PDF resume',
        ]),
      ]
    }

    const target = rawTarget.toLowerCase()

    if (target === 'links' || target === 'linktree' || target === 'linkhub') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/links')
        window.dispatchEvent(new Event('popstate'))
      }
      return [makeOutput('success', '⚡ Navigating to RoshZen Private LinkHub (/links)...')]
    }

    if (target === 'admin') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/admin')
        window.dispatchEvent(new Event('popstate'))
      }
      return [makeOutput('success', '⚡ Navigating to RoshZen Admin Dashboard (/admin)...')]
    }

    if (target === 'login') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/login')
        window.dispatchEvent(new Event('popstate'))
      }
      return [makeOutput('success', '⚡ Navigating to RoshZen Login Gateway (/login)...')]
    }

    if (target === 'github' || target === 'gh') {
      openInNewTab('https://github.com/roshzxn1003')
      return [makeOutput('success', '⚡ Opening GitHub Profile (github.com/roshzxn1003)...')]
    }

    if (target === 'linkedin' || target === 'li') {
      openInNewTab('https://www.linkedin.com/in/arun-roshan-gj/')
      return [makeOutput('success', '⚡ Opening LinkedIn Profile (linkedin.com/in/arun-roshan-gj)...')]
    }

    if (target === 'youtube' || target === 'yt') {
      openInNewTab('https://www.youtube.com/@roshzxn')
      return [makeOutput('success', '⚡ Opening YouTube Channel (youtube.com/@roshzxn)...')]
    }

    if (target === 'instagram' || target === 'ig') {
      openInNewTab('https://instagram.com/rosh.zxn')
      return [makeOutput('success', '⚡ Opening Instagram Profile (instagram.com/rosh.zxn)...')]
    }

    if (target === 'resume' || target === 'cv') {
      openInNewTab('/AR-resume.pdf')
      return [makeOutput('success', '⚡ Opening PDF Resume (/AR-resume.pdf)...')]
    }

    if (target === 'portfolio') {
      openInNewTab('https://roshzen.in')
      return [makeOutput('success', '⚡ Opening Main Portfolio (roshzen.in)...')]
    }

    // Check if file exists in VFS
    const vfsRes = vfs.cat(rawTarget)
    if (vfsRes.success) {
      return [makeOutput('output', vfsRes.content.split('\n'))]
    }

    // Format and open ANY general URL typed in terminal
    let formattedUrl = rawTarget
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl
    }

    try {
      openInNewTab(formattedUrl)
      return [
        makeOutput('success', `⚡ Launching URL: ${formattedUrl}`),
        makeOutput('output', `Opened in a new browser tab.`),
      ]
    } catch {
      return [makeOutput('error', `Failed to open URL "${rawTarget}".`)]
    }
  }

  // ZENITH PROJECT COMMAND
  if (command === 'zenith') {
    return [
      makeOutput('header', '📱 ZENITH - Dual-Space Personal Finance App Architecture'),
      makeOutput('output', [
        '----------------------------------------------------------------------',
        'Overview      : Zenith solves single vs shared family expense tracking.',
        'Architecture  : Financial Space Switcher (Private vs Family Space).',
        'Tech Stack    : Flutter, Dart, Riverpod 2.0, GoRouter, Hive, Supabase.',
        'Key Features  : Biometric Auth, Realtime Sync, Translucent Anti-Gravity UI.',
        'Status        : Active Mobile Architecture Project.',
        '----------------------------------------------------------------------',
      ]),
    ]
  }

  // TECHSTACK COMMAND
  if (command === 'techstack') {
    return [
      makeOutput('header', '🛠 ARUN ROSHAN - CATEGORIZED TECH STACK'),
      makeOutput('output', [
        '----------------------------------------------------------------------',
        '• Frontend    : React 19, Vite, Next.js, JavaScript (ES6+), HTML5/CSS3',
        '• Styling     : TailwindCSS, Glassmorphism, CSS Shaders, Framer Motion',
        '• Mobile      : Flutter, Dart, Riverpod State Management',
        '• Backend/DB  : Node.js, Express, Supabase PostgreSQL, MongoDB',
        '• Tools/Dev   : Git, GitHub, Linux CLI, Vercel, REST APIs',
        '----------------------------------------------------------------------',
      ]),
    ]
  }

  // SOCIALS COMMAND
  if (command === 'socials') {
    return [
      makeOutput('header', '🌐 ARUN ROSHAN - SOCIAL & OFFICIAL PROFILES'),
      makeOutput('list', [
        '• GitHub    : https://github.com/roshzxn1003  (Type: open github)',
        '• LinkedIn  : https://www.linkedin.com/in/arun-roshan-gj/  (Type: open linkedin)',
        '• YouTube   : https://www.youtube.com/@roshzxn  (Type: open youtube)',
        '• Instagram : https://instagram.com/rosh.zxn  (Type: open instagram)',
        '• LinkHub   : /links  (Type: open links)',
      ]),
    ]
  }

  // HIRE / FREELANCE COMMAND
  if (command === 'hire' || command === 'freelance') {
    return [
      makeOutput('header', '🤝 HIRE ARUN ROSHAN / COLLABORATIONS'),
      makeOutput('output', [
        '----------------------------------------------------------------------',
        'Status        : Available for Freelance & Frontend Developer Roles',
        'Specialization: Custom React Web Apps, LinkHubs, UI Engineering',
        'Direct Email  : arunroshan1003@gmail.com',
        'Location      : India (Remote Available Worldwide)',
        '----------------------------------------------------------------------',
      ]),
    ]
  }

  // ROSHZEN PRIVATE LINKHUB TERMINAL COMMAND
  if (command === 'roshzen-links' || command === 'links') {
    const subCmd = (args[0] || 'open').toLowerCase()

    if (subCmd === 'open' || subCmd === 'launch') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/links')
        window.dispatchEvent(new Event('popstate'))
      }
      return [
        makeOutput('success', '⚡ Opening RoshZen Private LinkHub (/links)...'),
        makeOutput('output', 'Accessing secure personal link hub...'),
      ]
    }

    if (subCmd === 'admin') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/admin')
        window.dispatchEvent(new Event('popstate'))
      }
      return [
        makeOutput('success', '⚡ Opening RoshZen Admin Command Center (/admin)...'),
        makeOutput('output', 'Redirecting to admin gateway...'),
      ]
    }

    if (subCmd === 'login') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/login')
        window.dispatchEvent(new Event('popstate'))
      }
      return [
        makeOutput('success', '⚡ Opening RoshZen Admin Login Gateway (/login)...'),
      ]
    }

    if (subCmd === 'list') {
      return [
        makeOutput('success', '⚡ RoshZen Private Links:'),
        makeOutput('list', [
          '• Portfolio Website     : https://www.roshzen.in',
          '• GitHub Repositories   : https://github.com/roshzxn1003',
          '• LinkedIn Network      : https://www.linkedin.com/in/arun-roshan-gj/',
          '• YouTube Channel       : https://www.youtube.com/@roshzxn',
          '• Instagram             : https://instagram.com/rosh.zxn',
          '• Download Resume (PDF) : https://www.roshzen.in/AR-resume.pdf',
          '• Direct Email          : mailto:arunroshan1003@gmail.com',
        ]),
        makeOutput('output', 'Type "roshzen-links open" or "links open" to launch the UI.'),
      ]
    }

    return [
      makeOutput('header', '⚡ RoshZen Private LinkHub Terminal Commands:'),
      makeOutput('list', [
        '  roshzen-links open   : Launch private LinkHub UI (/links)',
        '  roshzen-links list   : Display registered links in terminal',
        '  roshzen-links admin  : Open protected Admin Dashboard (/admin)',
        '  roshzen-links login  : Open Admin Login Gateway (/login)',
      ]),
    ]
  }

  // 1. ECHO
  if (command === 'echo') {
    return [makeOutput('output', args.join(' '))]
  }

  // 2. ASK (AI ASSISTANT - Requirement #9)
  if (command === 'ask' || command === 'chat' || command === 'ai') {
    const question = args.join(' ').replace(/^["']|["']$/g, '')
    if (!question) return [makeOutput('component', ['ai:prompt_picker'])]
    return [makeOutput('component', [`ai:${question}`])]
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
        `🚀 Live Demo: ${found.live || 'https://roshzen.in'}`,
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

  // 15. LO-FI CODING MUSIC PLAYER (Ambient Synthesizer)
  if (command === 'music' || command === 'lofi' || command === 'radio' || command === 'beats') {
    const action = (args[0] || 'play').toLowerCase()
    return [makeOutput('component', [`lofi:${action}`])]
  }

  // 15.1 RETRO CRT MONITOR MODE
  if (command === 'crt' || command === 'retro' || command === 'scanlines') {
    const sub = args[0]?.toLowerCase()
    if (sub === 'off') {
      if (context.crtMode && context.toggleCrt) context.toggleCrt()
      return [makeOutput('output', '📺 CRT Retro Monitor Mode [DISABLED]')]
    }
    if (sub === 'on') {
      if (!context.crtMode && context.toggleCrt) context.toggleCrt()
      return [makeOutput('success', '📺 CRT Retro Monitor Mode [ENABLED] - Authentic Phosphor Scanlines Active')]
    }
    if (context.toggleCrt) context.toggleCrt()
    return [makeOutput('success', `📺 CRT Retro Monitor Mode [TOGGLED] - Now ${!context.crtMode ? 'ENABLED' : 'DISABLED'}`)]
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

  // 20. LINUX COMMANDS & SYSTEM UTILITIES
  if (command === 'head') {
    let count = 10
    let fileArg = args[0]
    if (args[0] === '-n' && args[1]) {
      count = parseInt(args[1], 10) || 10
      fileArg = args[2]
    } else if (args[0] && args[0].startsWith('-n')) {
      count = parseInt(args[0].slice(2), 10) || 10
      fileArg = args[1]
    }
    if (!fileArg) return [makeOutput('error', 'Usage: head [-n lines] <filename>')]
    const res = vfs.cat(fileArg)
    if (!res.success) return [makeOutput('error', res.error)]
    const lines = res.content.split('\n').slice(0, count)
    return [makeOutput('output', lines)]
  }

  if (command === 'tail') {
    let count = 10
    let fileArg = args[0]
    if (args[0] === '-n' && args[1]) {
      count = parseInt(args[1], 10) || 10
      fileArg = args[2]
    } else if (args[0] && args[0].startsWith('-n')) {
      count = parseInt(args[0].slice(2), 10) || 10
      fileArg = args[1]
    }
    if (!fileArg) return [makeOutput('error', 'Usage: tail [-n lines] <filename>')]
    const res = vfs.cat(fileArg)
    if (!res.success) return [makeOutput('error', res.error)]
    const allLines = res.content.split('\n')
    const lines = allLines.slice(Math.max(0, allLines.length - count))
    return [makeOutput('output', lines)]
  }

  if (command === 'wc') {
    const flag = args[0] && args[0].startsWith('-') ? args[0] : null
    const fileArg = flag ? args[1] : args[0]
    if (!fileArg) return [makeOutput('error', 'Usage: wc [-l|-w|-c] <filename>')]
    const res = vfs.cat(fileArg)
    if (!res.success) return [makeOutput('error', res.error)]
    const text = res.content
    const lineCount = text ? text.split('\n').length : 0
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const charCount = text.length
    if (flag === '-l') return [makeOutput('output', `${lineCount} ${fileArg}`)]
    if (flag === '-w') return [makeOutput('output', `${wordCount} ${fileArg}`)]
    if (flag === '-c' || flag === '-m') return [makeOutput('output', `${charCount} ${fileArg}`)]
    return [makeOutput('output', `  ${lineCount}  ${wordCount} ${charCount} ${fileArg}`)]
  }

  if (command === 'grep') {
    let isCaseInsensitive = false
    let pattern = ''
    let targetFile = ''
    let argIdx = 0
    if (args[argIdx] === '-i') {
      isCaseInsensitive = true
      argIdx++
    }
    pattern = args[argIdx]
    targetFile = args[argIdx + 1]
    if (!pattern) return [makeOutput('error', 'Usage: grep [-i] <pattern> [file or directory]')]
    const res = vfs.grep(pattern, targetFile, { i: isCaseInsensitive })
    if (!res.success) return [makeOutput('error', res.error)]
    if (res.results.length === 0) return [makeOutput('warning', `grep: pattern '${pattern}' not found`)]
    return [makeOutput('output', res.results)]
  }

  if (command === 'find') {
    let startPath = '.'
    let namePattern = '*'
    if (args[0] && !args[0].startsWith('-')) {
      startPath = args[0]
      if (args[1] === '-name' && args[2]) namePattern = args[2].replace(/^["']|["']$/g, '')
    } else if (args[0] === '-name' && args[1]) {
      namePattern = args[1].replace(/^["']|["']$/g, '')
    }
    const res = vfs.find(startPath, namePattern)
    if (!res.success) return [makeOutput('error', res.error)]
    return [makeOutput('output', res.results)]
  }

  if (command === 'cp') {
    if (args.length < 2) return [makeOutput('error', 'Usage: cp <source> <destination>')]
    const res = vfs.cp(args[0], args[1])
    return res.success ? [makeOutput('success', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'mv') {
    if (args.length < 2) return [makeOutput('error', 'Usage: mv <source> <destination>')]
    const res = vfs.mv(args[0], args[1])
    return res.success ? [makeOutput('success', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'rmdir') {
    if (!args[0]) return [makeOutput('error', 'Usage: rmdir <directory>')]
    const res = vfs.rmdir(args[0])
    return res.success ? [makeOutput('success', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'chmod') {
    if (args.length < 2) return [makeOutput('error', 'Usage: chmod <mode> <filename>')]
    const res = vfs.chmod(args[0], args[1])
    return res.success ? [makeOutput('success', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'chown') {
    if (args.length < 2) return [makeOutput('error', 'Usage: chown <owner:group> <filename>')]
    const res = vfs.chown(args[0], args[1])
    return res.success ? [makeOutput('success', res.message)] : [makeOutput('error', res.error)]
  }

  if (command === 'df') {
    return [
      makeOutput('output', [
        'Filesystem     1K-blocks      Used Available Use% Mounted on',
        '/dev/root       52428800  14680064  37748736  28% /',
        'devtmpfs         8192000         0   8192000   0% /dev',
        'tmpfs            8192000       512   8191488   1% /run',
        '/dev/nvme0n1p2 209715200  47185920 162529280  23% /home/arun',
        'roshzen_vfs       102400     12480     89920  12% /home/arun/vfs',
      ]),
    ]
  }

  if (command === 'free') {
    const isHuman = args.includes('-h')
    if (isHuman) {
      return [
        makeOutput('output', [
          '               total        used        free      shared  buff/cache   available',
          'Mem:           15.7Gi       4.1Gi       8.0Gi       512Mi       3.6Gi      11.4Gi',
          'Swap:           2.0Gi          0B       2.0Gi',
        ]),
      ]
    }
    return [
      makeOutput('output', [
        '               total        used        free      shared  buff/cache   available',
        'Mem:        16465920     4300800     8388608      524288     3776512    11953728',
        'Swap:        2097152           0     2097152',
      ]),
    ]
  }

  if (command === 'who' || command === 'w') {
    return [
      makeOutput('output', [
        ' 23:25:00 up 42 days, 13:37,  2 users,  load average: 0.04, 0.01, 0.00',
        'USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT',
        'arun     tty1     :0               10Aug26 42days  0.12s  0.12s /bin/bash',
        'arun     pts/0    192.168.1.100    23:15    0.00s  0.08s  0.02s bash -c terminal',
      ]),
    ]
  }

  if (command === 'id') {
    const user = args[0] || 'arun'
    return [
      makeOutput(
        'output',
        `uid=1000(${user}) gid=1000(${user}) groups=1000(${user}),27(sudo),100(users),999(docker),1001(developer)`
      ),
    ]
  }

  if (command === 'groups') {
    const user = args[0] || 'arun'
    return [makeOutput('output', `${user} : ${user} sudo users docker developer webdev`)]
  }

  if (command === 'alias') {
    const list = Object.entries(aliases).map(([k, v]) => `alias ${k}='${v}'`)
    return [makeOutput('list', ['# Current RoshZen Shell Aliases', ...list])]
  }

  if (command === 'export' || command === 'printenv') {
    const envVars = [
      'USER=arun',
      'LOGNAME=arun',
      'HOME=/home/arun',
      'SHELL=/bin/bash',
      'TERM=xterm-256color',
      'LANG=en_US.UTF-8',
      'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      'NODE_ENV=production',
      'ROSHZEN_OS=v4.2-cyberpunk',
    ]
    if (command === 'export' && args.length === 0) {
      return [makeOutput('output', envVars.map((v) => `declare -x ${v}`))]
    }
    if (args[0]) {
      const matched = envVars.find((v) => v.startsWith(args[0].toUpperCase() + '='))
      if (matched) return [makeOutput('output', matched.split('=')[1])]
    }
    return [makeOutput('output', envVars)]
  }

  if (command === 'basename') {
    if (!args[0]) return [makeOutput('error', 'Usage: basename <path> [suffix]')]
    let base = args[0].replace(/\/+$/, '').split('/').pop() || '/'
    if (args[1] && base.endsWith(args[1])) {
      base = base.slice(0, base.length - args[1].length)
    }
    return [makeOutput('output', base)]
  }

  if (command === 'dirname') {
    if (!args[0]) return [makeOutput('error', 'Usage: dirname <path>')]
    const parts = args[0].replace(/\/+$/, '').split('/')
    parts.pop()
    const dir = parts.join('/') || '/'
    return [makeOutput('output', dir)]
  }

  if (command === 'sort') {
    const isReverse = args.includes('-r')
    const fileArg = args.find((a) => !a.startsWith('-'))
    if (!fileArg) return [makeOutput('error', 'Usage: sort [-r] <filename>')]
    const res = vfs.cat(fileArg)
    if (!res.success) return [makeOutput('error', res.error)]
    const sorted = res.content.split('\n').sort()
    if (isReverse) sorted.reverse()
    return [makeOutput('output', sorted)]
  }

  if (command === 'uniq') {
    const fileArg = args[0]
    if (!fileArg) return [makeOutput('error', 'Usage: uniq <filename>')]
    const res = vfs.cat(fileArg)
    if (!res.success) return [makeOutput('error', res.error)]
    const lines = res.content.split('\n')
    const uniqueLines = lines.filter((line, i) => i === 0 || line !== lines[i - 1])
    return [makeOutput('output', uniqueLines)]
  }

  if (command === 'tr') {
    if (args.length < 2) return [makeOutput('error', "Usage: tr 'set1' 'set2' (e.g. tr 'a-z' 'A-Z')")]
    const fromSet = args[0].replace(/['"]/g, '')
    const toSet = args[1].replace(/['"]/g, '')
    if (fromSet === 'a-z' && toSet === 'A-Z') {
      const rest = args.slice(2).join(' ') || 'hello world from linux'
      return [makeOutput('output', rest.toUpperCase())]
    }
    if (fromSet === 'A-Z' && toSet === 'a-z') {
      const rest = args.slice(2).join(' ') || 'HELLO WORLD FROM LINUX'
      return [makeOutput('output', rest.toLowerCase())]
    }
    return [makeOutput('output', (args.slice(2).join(' ') || fromSet).replace(new RegExp(fromSet, 'g'), toSet))]
  }

  if (command === 'tee') {
    if (!args[0]) return [makeOutput('error', 'Usage: tee <filename>')]
    const text = args.slice(1).join(' ') || 'RoshZen Linux Pipe Stream Output'
    vfs.writeFile(args[0], text)
    return [makeOutput('output', text)]
  }

  if (command === 'diff') {
    if (args.length < 2) return [makeOutput('error', 'Usage: diff <file1> <file2>')]
    const res1 = vfs.cat(args[0])
    const res2 = vfs.cat(args[1])
    if (!res1.success) return [makeOutput('error', res1.error)]
    if (!res2.success) return [makeOutput('error', res2.error)]
    const l1 = res1.content.split('\n')
    const l2 = res2.content.split('\n')
    const diffs = []
    const maxLen = Math.max(l1.length, l2.length)
    for (let i = 0; i < maxLen; i++) {
      if (l1[i] !== l2[i]) {
        if (l1[i] !== undefined) diffs.push(`< ${l1[i]}`)
        if (l2[i] !== undefined) diffs.push(`> ${l2[i]}`)
      }
    }
    if (diffs.length === 0) return [makeOutput('success', 'Files are identical.')]
    return [makeOutput('output', diffs)]
  }

  if (command === 'nslookup' || command === 'dig' || command === 'host') {
    const domain = args.find((a) => !a.startsWith('-')) || 'roshzen.in'
    return [
      makeOutput('output', [
        `Server:         1.1.1.1`,
        `Address:        1.1.1.1#53`,
        ``,
        `Non-authoritative answer:`,
        `Name:   ${domain}`,
        `Address: 76.76.21.21 (Vercel Edge Network)`,
        `Address: 2604:a880:800:10::1`,
        `MX record: 10 mail.gandi.net`,
        `TXT record: "v=spf1 include:_spf.google.com ~all"`,
      ]),
    ]
  }

  if (command === 'traceroute') {
    const target = args[0] || 'google.com'
    return [
      makeOutput('output', [
        `traceroute to ${target} (142.250.190.46), 30 hops max, 60 byte packets`,
        ` 1  gateway (192.168.1.1)  1.124 ms  1.085 ms  1.012 ms`,
        ` 2  10.240.0.1 (10.240.0.1)  8.432 ms  8.112 ms  7.985 ms`,
        ` 3  172.16.100.4 (172.16.100.4)  12.102 ms  11.890 ms  11.543 ms`,
        ` 4  edge-router.net (142.250.190.46)  14.210 ms  13.980 ms  14.050 ms`,
      ]),
    ]
  }

  if (command === 'netstat' || command === 'ss') {
    return [
      makeOutput('output', [
        'Active Internet connections (only servers)',
        'Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name',
        'tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN      101/node (vite)',
        'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      402/nginx',
        'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      512/sshd',
        'tcp6       0      0 :::443                  :::*                    LISTEN      402/nginx',
      ]),
    ]
  }

  if (command === 'sleep') {
    const sec = parseInt(args[0], 10) || 1
    return [makeOutput('success', `Slept for ${sec} second(s).`)]
  }

  if (command === 'which' || command === 'whereis') {
    const target = args[0] || 'bash'
    const paths = {
      bash: '/bin/bash',
      sh: '/bin/sh',
      node: '/usr/local/bin/node',
      npm: '/usr/local/bin/npm',
      git: '/usr/bin/git',
      python: '/usr/bin/python3',
      python3: '/usr/bin/python3',
      docker: '/usr/bin/docker',
      ls: '/bin/ls',
      cat: '/bin/cat',
      grep: '/usr/bin/grep',
      find: '/usr/bin/find',
      vim: '/usr/bin/vim',
      nano: '/usr/bin/nano',
    }
    const found = paths[target.toLowerCase()]
    if (found) return [makeOutput('output', found)]
    return [makeOutput('output', `/usr/bin/${target}`)]
  }

  if (command === 'man') {
    const cmd = args[0]?.toLowerCase()
    if (!cmd) return [makeOutput('error', 'Usage: man <command_name> (e.g. man ls, man grep, man git)')]
    return [
      makeOutput('output', [
        `NAME`,
        `       ${cmd} - RoshZen Linux Command Documentation`,
        ``,
        `SYNOPSIS`,
        `       ${cmd} [OPTION]... [FILE]...`,
        ``,
        `DESCRIPTION`,
        `       Standard Linux command utility integrated within RoshZen Virtual OS v4.2.`,
        `       Allows interactive file system manipulation and software engineering execution.`,
        ``,
        `EXAMPLES`,
        `       ${cmd} --help`,
        `       ${cmd} filename`,
      ]),
    ]
  }

  if (command === 'sed') {
    if (!args[0]) return [makeOutput('error', "Usage: sed 's/find/replace/g' <filename>")]
    const expr = args[0].replace(/^["']|["']$/g, '')
    const fileArg = args[1]
    const match = expr.match(/^s\/([^/]+)\/([^/]*)\/([g]?)$/)
    if (!match) return [makeOutput('error', 'Invalid sed expression syntax. Example: sed s/foo/bar/g file.txt')]
    const [, findStr, replaceStr, flags] = match
    if (!fileArg) return [makeOutput('error', 'Usage: sed s/find/replace/g <filename>')]
    const res = vfs.cat(fileArg)
    if (!res.success) return [makeOutput('error', res.error)]
    const regex = new RegExp(findStr, flags.includes('g') ? 'g' : '')
    const modified = res.content.replace(regex, replaceStr)
    return [makeOutput('output', modified.split('\n'))]
  }

  if (command === 'awk') {
    if (!args[0]) return [makeOutput('error', "Usage: awk '{print $1}' <filename>")]
    const fileArg = args.find((a) => !a.startsWith('{') && !a.startsWith("'") && !a.startsWith('"'))
    if (!fileArg) return [makeOutput('error', "Usage: awk '{print $1}' <filename>")]
    const res = vfs.cat(fileArg)
    if (!res.success) return [makeOutput('error', res.error)]
    const colMatch = args.join(' ').match(/\$([0-9]+)/)
    const colIdx = colMatch ? parseInt(colMatch[1], 10) - 1 : 0
    const lines = res.content.split('\n').map((line) => {
      const parts = line.trim().split(/\s+/)
      return colIdx >= 0 ? parts[colIdx] || '' : line
    })
    return [makeOutput('output', lines)]
  }

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
    if (command === 'hostname') {
      return [makeOutput('output', 'roshzen-cyberpunk-linux')]
    }
    if (command === 'ifconfig' || command === 'ip') {
      return [
        makeOutput('output', [
          'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
          '        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255',
          '        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>',
          '        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)',
          '        RX packets 14205  bytes 18450122 (18.4 MB)',
          '        TX packets 9820  bytes 2450110 (2.4 MB)',
          '',
          'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
          '        inet 127.0.0.1  netmask 255.0.0.0',
        ]),
      ]
    }
    if (command === 'disk' || command === 'memory') {
      return command === 'disk'
        ? [makeOutput('output', 'Disk Usage: 47.1 GB used / 209.7 GB total (23% used)')]
        : [makeOutput('output', 'Memory Usage: 4.1 GB used / 16.0 GB RAM total (26% used)')]
    }
    if (command === 'curl' || command === 'wget') {
      const url = args[0] || 'https://roshzen.in'
      return [
        makeOutput('output', [
          `HTTP/1.1 200 OK`,
          `Content-Type: text/html; charset=UTF-8`,
          `Server: RoshZen-Vercel-Edge`,
          `Date: ${new Date().toUTCString()}`,
          `Connection: keep-alive`,
          ``,
          `<!DOCTYPE html><html><head><title>RoshZen Portfolio</title></head><body><h1>Welcome to RoshZen</h1></body></html>`,
        ]),
      ]
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

  // 22. QR CODE GENERATOR (ALL SOCIAL MEDIA & CUSTOM LINKS)
  if (command === 'qr') {
    const rawTarget = args[0] || 'website'
    const target = rawTarget.toLowerCase()

    if (target === 'list' || target === 'all' || target === 'help') {
      return [
        makeOutput('output', [
          '📱 ROSHZEN SOCIAL MEDIA QR CODE REGISTRY',
          '-------------------------------------------------------',
          '• qr website   / qr portfolio  → Portfolio Website (https://roshzen.in)',
          '• qr github    / qr gh         → GitHub Profile (github.com/roshzxn1003)',
          '• qr linkedin  / qr li         → LinkedIn Profile (linkedin.com/in/arun-roshan-gj)',
          '• qr instagram / qr ig         → Instagram Profile (instagram.com/rosh.zxn)',
          '• qr youtube   / qr yt         → YouTube Channel (youtube.com/@roshzxn)',
          '• qr email     / qr mail       → Email Contact (arunroshan1003@gmail.com)',
          '• qr whatsapp  / qr wa         → WhatsApp Contact (+91 9999999999)',
          '• qr resume    / qr cv         → Download Resume PDF',
          '• qr <custom_url>             → Any Custom Link (e.g. qr https://x.com/roshzxn)',
          '-------------------------------------------------------',
          'Type any command above to generate its original scannable QR Code!',
        ]),
      ]
    }

    let url = 'https://roshzen.in'
    let label = target

    if (target === 'website' || target === 'portfolio' || target === 'site') {
      url = 'https://roshzen.in'
      label = 'Portfolio Website'
    } else if (target === 'github' || target === 'gh') {
      url = profile.github
      label = 'GitHub Profile'
    } else if (target === 'linkedin' || target === 'li') {
      url = profile.linkedin
      label = 'LinkedIn Profile'
    } else if (target === 'instagram' || target === 'ig') {
      url = 'https://instagram.com/rosh.zxn'
      label = 'Instagram Profile'
    } else if (target === 'youtube' || target === 'yt') {
      url = 'https://www.youtube.com/@roshzxn'
      label = 'YouTube Channel'
    } else if (target === 'email' || target === 'mail' || target === 'contact') {
      url = 'mailto:arunroshan1003@gmail.com'
      label = 'Email Contact'
    } else if (target === 'whatsapp' || target === 'wa') {
      url = 'https://wa.me/919999999999'
      label = 'WhatsApp Contact'
    } else if (target === 'resume' || target === 'cv') {
      url = 'https://roshzen.in/AR-resume.pdf'
      label = 'Resume PDF'
    } else if (rawTarget.startsWith('http://') || rawTarget.startsWith('https://')) {
      url = rawTarget
      label = 'Custom Link'
    } else {
      url = 'https://roshzen.in'
      label = `Portfolio`
    }

    return [makeOutput('component', `qr:${label}:${url}`)]
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
  if (['snake', 'pong', 'tictactoe', '2048', 'memory', 'tetris', 'quiz', 'trivia', 'challenge'].includes(command)) {
    const category = (args[0] || 'all').toLowerCase()
    const gameParam = (command === 'quiz' || command === 'trivia' || command === 'challenge') ? `quiz:${category}` : command
    return [makeOutput('component', `game:${gameParam}`)]
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

  // 31b. ADDITIONAL NEW COMMAND HANDLERS
  if (command === 'uptime') {
    return [
      makeOutput('success', [
        '⏱ ROSHZEN SYSTEM UPTIME',
        '-------------------------------------------------------',
        'Uptime       : 42 days, 13 hours, 37 minutes',
        'System Load  : 0.04 (1m), 0.01 (5m), 0.00 (15m)',
        'Status       : 100% Operational (0 downtime reported)',
      ]),
    ]
  }

  if (command === 'date' || command === 'time' || command === 'clock') {
    const now = new Date()
    return [
      makeOutput('output', [
        `🕒 Current Time : ${now.toLocaleTimeString()}`,
        `📅 Current Date : ${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        `🌐 Timezone     : ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      ]),
    ]
  }

  if (command === 'uname' || command === 'sysinfo' || command === 'systeminfo') {
    return [
      makeOutput('output', [
        '🖥 ROSHZEN OS SPECIFICATIONS',
        '-------------------------------------------------------',
        'OS Name      : RoshZen Linux (Cyberpunk Edition)',
        'Kernel       : 6.8.0-roshzen-x86_64',
        'Architecture : x86_64 / ARM64 Compatible',
        'Shell        : RoshZen Interactive Terminal v4.2',
        'Runtime      : WebAssembly / React 19 Engine',
      ]),
    ]
  }

  if (command === 'calc' || command === 'eval') {
    const expr = args.join(' ')
    if (!expr) return [makeOutput('error', 'Usage: calc <expression> (e.g. calc 15 * 4, calc Math.sqrt(144))')]
    try {
      const sanitized = expr.replace(/[^0-9+\-*/().%\s^sqrtcointlogpabs]/gi, '')
      const evaluated = Function(`return (${sanitized.replace(/sqrt/g, 'Math.sqrt')})`)()
      return [makeOutput('success', `Result: ${evaluated}`)]
    } catch {
      return [makeOutput('error', `Invalid calculation expression: "${expr}"`)]
    }
  }

  if (command === 'echo') {
    return [makeOutput('output', args.join(' ') || '')]
  }

  if (command === 'whois') {
    const query = args[0] || 'arun'
    return [
      makeOutput('output', [
        '🔍 WHOIS RECORD FOR: ' + query.toUpperCase(),
        '-------------------------------------------------------',
        'Registrant   : Arun Roshan (RoshZen)',
        'Role         : Computer Science Engineering Student & Developer',
        'Location     : India',
        'Domain       : roshzen.in / roshzens-portfolio.vercel.app',
        'Status       : Available for Freelance & Full-Time Hire',
        'Contact      : arunroshan1003@gmail.com',
      ]),
    ]
  }

  if (command === 'hire' || command === 'freelance') {
    scrollToSection('contact')
    return [
      makeOutput('success', [
        '🚀 HIRE ARUN ROSHAN',
        '-------------------------------------------------------',
        'Status       : 🟢 OPEN FOR OPPORTUNITIES',
        'Services     : React Web Apps, Mobile UI, Portfolio Design, Frontend Development',
        'Email        : arunroshan1003@gmail.com',
        'GitHub       : https://github.com/roshzxn1003',
        'LinkedIn     : https://www.linkedin.com/in/arun-roshan-gj/',
        'Action       : Scrolling to contact section...',
      ]),
    ]
  }

  if (command === 'music' || command === 'playlist') {
    return [
      makeOutput('output', [
        '🎵 ROSHZEN VIBE CODING PLAYLIST',
        '-------------------------------------------------------',
        'Current Track : Synthwave / Lo-Fi Beats for Coding 🎧',
        'Genre         : Cyberpunk Synthwave & Chillhop',
        'Favorite      : Midnight City - M83',
        'Status        : 🟢 Playing in high-focus mode',
      ]),
    ]
  }

  if (command === 'games' || command === 'play') {
    return [
      makeOutput('output', [
        '🎮 TERMINAL MINI GAMES',
        '-------------------------------------------------------',
        '• snake     - Classic Snake Arcade Game',
        '• pong      - Retro Pong VS AI',
        '• tictactoe - Tic-Tac-Toe Game',
        '• 2048      - 2048 Puzzle Game',
        '• hack      - Hacking Simulation',
        '-------------------------------------------------------',
        'Type any game name to launch it right inside the terminal!',
      ]),
    ]
  }

  if (command === 'ping') {
    const host = args[0] || 'roshzen.in'
    return [
      makeOutput('success', [
        `PING ${host} 56(84) bytes of data.`,
        `64 bytes from ${host}: icmp_seq=1 ttl=64 time=12.4 ms`,
        `64 bytes from ${host}: icmp_seq=2 ttl=64 time=11.8 ms`,
        `64 bytes from ${host}: icmp_seq=3 ttl=64 time=12.1 ms`,
        `--- ${host} ping statistics ---`,
        `3 packets transmitted, 3 received, 0% packet loss, time 2003ms`,
      ]),
    ]
  }

  if (command === 'credits' || command === 'thanks') {
    return [
      makeOutput('output', [
        '⭐ PORTFOLIO CREDITS & ACKNOWLEDGMENTS',
        '-------------------------------------------------------',
        'Developer    : Arun Roshan (RoshZen)',
        'Core Tech    : React 19, Vite, Tailwind CSS v4, Motion (Framer)',
        'Icons        : Lucide React',
        'Shaders/3D   : WebGL 2 / OGL Engine',
        'Special      : Built with passion & clean software architecture.',
      ]),
    ]
  }

  if (command === 'motd') {
    return [
      makeOutput('success', [
        '💬 MESSAGE OF THE DAY',
        '-------------------------------------------------------',
        '“The best way to predict the future is to invent it.” — Alan Kay',
      ]),
    ]
  }

  if (command === 'version') {
    return [
      makeOutput('output', [
        '📌 ROSHZEN TERMINAL VERSION INFO',
        '-------------------------------------------------------',
        'Terminal Version : v4.2.0-pro (Build 2026)',
        'Features         : Interactive Games, WebGL Shaders, 50+ Commands',
      ]),
    ]
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

  // 33. RUNALL / BATCH EXECUTION SUITE
  if (command === 'runall' || command === 'demo' || command === 'testall' || command === 'batch' || command === 'suite') {
    const suite = [
      'whoami',
      'about',
      'skills',
      'projects',
      'education',
      'experience',
      'contact',
      'certs',
      'status',
      'visitors',
      'github stats',
      'stats',
      'roadmap',
      'timeline',
      'pwd',
      'ls',
      'tree',
      'cat about.txt',
      'head -n 2 skills.json',
      'tail -n 2 README.md',
      'wc -l about.txt',
      'grep -i react skills.json',
      'find . -name *.md',
      'df',
      'free -h',
      'who',
      'id',
      'groups',
      'alias',
      'export',
      'basename /home/arun/about.txt',
      'dirname /home/arun/about.txt',
      'top',
      'ping roshzen.in',
      'curl https://roshzen.in',
      'uname',
      'sysinfo',
      'uptime',
      'calc 25 * 4',
      'weather',
      'music',
      'qr list',
      'neofetch',
      'coffee',
      'joke',
      'quote',
      'motd',
      'version',
    ]

    const resultOutputs = [
      makeOutput('success', [
        '⚡ ROSHZEN TERMINAL BATCH EXECUTION SUITE (RUNALL)',
        `Running all ${suite.length} terminal commands in 1 automated sequence...`,
        '----------------------------------------------------------------------',
      ]),
    ]

    suite.forEach((cmdItem, index) => {
      resultOutputs.push(makeOutput('output', `[${index + 1}/${suite.length}] $ ${cmdItem}`))
      if (cmdItem !== 'runall' && cmdItem !== 'demo') {
        const cmdRes = executeCommand(cmdItem, context)
        cmdRes.forEach((res) => {
          resultOutputs.push(res)
        })
      }
    })

    resultOutputs.push(
      makeOutput('success', [
        '----------------------------------------------------------------------',
        `✨ ALL DONE: All ${suite.length} commands executed successfully in 1 automated sequence!`,
      ])
    )

    return resultOutputs
  }

  // 34. PRESERVED ORIGINAL COMMANDS
  switch (normalized) {
    case 'help':
      return [
        makeOutput('output', [
          '⚡ ROSHZEN TERMINAL COMMAND REGISTRY (80+ Commands)',
          '-------------------------------------------------------',
          '• Portfolio : whoami | about | skills | skill <name> | projects | project <1-6> | search <topic>',
          '• Info      : education | experience | contact | social | github | linkedin | resume | certs | hire | whois',
          '• Analytics : status | visitors | github stats | stats | analytics | devmode | roadmap | timeline',
          '• VFS Files : pwd | ls | cd | mkdir | touch | rm | rmdir | cp | mv | tree | cat | head | tail | wc | grep | find | chmod | chown',
          '• Linux CLI : top | ps | kill | df | free | who | w | id | groups | alias | export | printenv | env | diff | sort | uniq | tr | tee | sed | awk | man | which | whereis',
          '• Network   : ping | curl | wget | nslookup | dig | host | traceroute | netstat | ss | ifconfig | ip | hostname',
          '• System    : theme <name> | sound on/off | clear | uptime | date | time | uname | sysinfo | calc | echo | version | boot',
          '• Automated : runall | demo | testall | batch (Run all 40+ commands at once in 1 sequence!)',
          '• Dev Tools : npm | git | docker | qr | download | toast | music | playlist | weather | ask',
          '• Fun/Games : quiz | snake | pong | tictactoe | 2048 | neofetch | coffee | joke | quote | motd | matrix | cmatrix | stop | hack | games | 42',
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
      return [makeOutput('component', ['github'])]

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
