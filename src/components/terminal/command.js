import { projects, socialLinks } from '../../data/portfolio'
import { themeNames } from './theme'

const profile = {
  name: 'Arun Roshan',
  role: 'Frontend Developer',
  location: 'India',
  email: 'arunroshan1003@gmail.com',
  github: 'https://github.com/roshzxn1003',
  linkedin: 'https://www.linkedin.com/in/arun-roshan-gj/',
  portfolio: 'RoshZen Portfolio',
  resume: '/AR-resume.pdf',
  about:
    'I am Arun Roshan, a Computer Science Engineering student focused on React, JavaScript, Python, clean UI, and practical software projects.',
  education: 'B.E Computer Science Engineering',
  experience: 'Currently Learning',
  skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'MongoDB', 'Git'],
}

const jokes = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'A SQL query walks into a bar, walks up to two tables and asks: can I join you?',
  'There are only 10 kinds of people: those who understand binary and those who do not.',
  'I told my code a joke. It did not compile.',
]

const quotes = [
  'Build first, polish with intent.',
  'Consistency beats intensity when learning to code.',
  'Readable code is a gift to your future self.',
  'Every strong developer started with a blinking cursor.',
]

const commandList = [
  'help',
  'whoami',
  'about',
  'skills',
  'projects',
  'education',
  'experience',
  'contact',
  'social',
  'github',
  'linkedin',
  'resume',
  'clear',
  'theme red',
  'theme green',
  'theme blue',
  'theme cyber',
  'theme light',
  'theme default',
  'date',
  'time',
  'echo hello',
  'pwd',
  'ls',
  'cat about.txt',
  'cat skills.json',
  'neofetch',
  'coffee',
  'joke',
  'quote',
  'matrix',
  'stop',
  'banner',
  'welcome',
  'portfolio',
]

const fileList = ['about.txt', 'projects/', 'skills.json', 'resume.pdf', 'contact.md']

const makeOutput = (type, lines) => ({ type, lines: Array.isArray(lines) ? lines : [lines] })

const openInNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const downloadResume = () => {
  const link = document.createElement('a')
  link.href = profile.resume
  link.download = 'Arun_Roshan_Resume.pdf'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formatProjects = () =>
  projects.map((project, index) => `${index + 1}. ${project.title} - ${project.idea}`)

export const getCommandSuggestions = () => commandList

export const getWelcomeEntry = () =>
  makeOutput('system', [
    'Welcome to RoshZen interactive terminal.',
    'Type "help" to list commands. Try "neofetch", "projects", or "theme cyber".',
  ])

export const executeCommand = (rawCommand, context) => {
  const input = rawCommand.trim()
  const normalized = input.toLowerCase()

  if (!input) return []

  if (normalized.startsWith('echo ')) {
    return [makeOutput('output', input.slice(5))]
  }

  if (normalized.startsWith('theme ')) {
    const requestedTheme = normalized.split(/\s+/)[1]

    if (themeNames.includes(requestedTheme)) {
      context.setTheme(requestedTheme)
      return [makeOutput('success', `Theme switched to ${requestedTheme}.`)]
    }

    return [makeOutput('error', `Theme not found. Available themes: ${themeNames.join(', ')}`)]
  }

  if (normalized.startsWith('cat ')) {
    const fileName = normalized.slice(4).trim()

    if (fileName === 'about.txt') {
      return [makeOutput('output', profile.about)]
    }

    if (fileName === 'skills.json') {
      return [
        makeOutput('json', [
          '{',
          '  "skills": [',
          ...profile.skills.map((skill, index) => `    "${skill}"${index === profile.skills.length - 1 ? '' : ','}`),
          '  ]',
          '}',
        ]),
      ]
    }

    return [makeOutput('error', `cat: ${fileName}: No such file`)]
  }

  switch (normalized) {
    case 'help':
      return [
        makeOutput('output', [
          'Available commands:',
          commandList.filter((command) => command !== 'portfolio').join('  |  '),
          'Website commands: portfolio, about, skills, projects, contact',
        ]),
      ]

    case 'whoami':
      return [makeOutput('success', profile.name)]

    case 'about':
      scrollToSection('about')
      return [makeOutput('output', profile.about)]

    case 'skills':
      scrollToSection('skills')
      return [makeOutput('list', profile.skills.map((skill) => `- ${skill}`))]

    case 'projects':
    case 'portfolio':
      scrollToSection('projects')
      return [makeOutput('output', formatProjects())]

    case 'education':
      return [makeOutput('output', profile.education)]

    case 'experience':
      return [makeOutput('output', profile.experience)]

    case 'contact':
      scrollToSection('contact')
      return [
        makeOutput('output', [
          `Email: ${profile.email}`,
          `GitHub: ${profile.github}`,
          `LinkedIn: ${profile.linkedin}`,
        ]),
      ]

    case 'social':
      return [makeOutput('output', socialLinks.map((link) => `${link.label}: ${link.href}`))]

    case 'github':
      openInNewTab(profile.github)
      return [makeOutput('success', 'Opening GitHub in a new tab...')]

    case 'linkedin':
      openInNewTab(profile.linkedin)
      return [makeOutput('success', 'Opening LinkedIn in a new tab...')]

    case 'resume':
      downloadResume()
      return [makeOutput('success', 'Downloading resume...')]

    case 'clear':
      context.clearTerminal()
      return []

    case 'date':
      return [makeOutput('output', new Date().toLocaleDateString(undefined, { dateStyle: 'full' }))]

    case 'time':
      return [makeOutput('output', new Date().toLocaleTimeString(undefined, { timeStyle: 'medium' }))]

    case 'pwd':
      return [makeOutput('output', '/home/arun')]

    case 'ls':
      return [makeOutput('list', fileList)]

    case 'neofetch':
      return [
        makeOutput('ascii', [
          '          /\\',
          '         /  \\        Name      Arun Roshan',
          '        / /\\ \\       Role      Frontend Developer',
          '       / ____ \\      Location  India',
          '      /_/    \\_\\     OS        RoshZen Linux',
          '                     Editor    VS Code',
          '                     Stack     React JavaScript Python MongoDB',
          '                     GitHub    github.com/roshzxn1003',
          '                     Portfolio RoshZen Portfolio',
        ]),
      ]

    case 'coffee':
      return [makeOutput('success', ['Coffee Loaded Successfully.', '☕'])]

    case 'joke':
      return [makeOutput('output', jokes[Math.floor(Math.random() * jokes.length)])]

    case 'quote':
      return [makeOutput('output', quotes[Math.floor(Math.random() * quotes.length)])]

    case 'matrix':
      context.setMatrixActive(true)
      return [makeOutput('success', 'Matrix rain animation started. Type "stop" to end it.')]

    case 'stop':
      context.setMatrixActive(false)
      return [makeOutput('warning', 'Matrix rain animation stopped.')]

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
        makeOutput('error', ['Command not found.', 'Type "help" to see available commands.']),
      ]
  }
}
