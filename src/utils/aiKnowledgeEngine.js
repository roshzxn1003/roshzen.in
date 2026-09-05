/**
 * RoshZen Portfolio AI Knowledge Engine
 * Provides instant, high-quality, terminal-friendly AI responses for queries
 * regarding Arun Roshan's projects, tech stack, experience, contact details, and engineering skills.
 * Ensures the terminal AI Co-Pilot works 100% reliably online and offline.
 */

import { projects, skillGroups, socialLinks, services } from '../data/portfolio.js'

const BIO_FACTS = {
  name: 'Arun Roshan G J',
  handle: 'roshzen / roshzxn1003',
  role: 'Computer Science Engineering (CSE) Student & Frontend/App Developer',
  email: 'arunroshan1003@gmail.com',
  github: 'https://github.com/roshzxn1003',
  linkedin: 'https://www.linkedin.com/in/arun-roshan-gj/',
  instagram: 'https://instagram.com/rosh.zxn',
  youtube: 'https://www.youtube.com/@roshzxn',
  portfolio: 'https://roshzen.in',
  location: 'Tamil Nadu, India',
  status: 'Open to Software Engineering Internships, Junior Frontend roles, and Freelance builds',
}

/**
 * Intelligent matcher that scores and generates accurate portfolio responses
 */
export function generateKnowledgeResponse(rawPrompt) {
  if (!rawPrompt || !rawPrompt.trim()) {
    return 'Greetings! I am the RoshZen Terminal AI Co-Pilot. Ask me about Arun\'s projects, tech stack, work experience, or availability for hire!'
  }

  const query = rawPrompt.toLowerCase().trim()

  // 1. GREETINGS & CASUAL INTRO
  if (/^(hi|hello|hey|yo|greetings|sup|hoi|hola)\b/.test(query) && query.length < 25) {
    return `👋 Hey there! Welcome to ${BIO_FACTS.name}'s portfolio terminal.
I'm his AI Co-Pilot. You can ask me questions like:
  • "What are Arun's top projects?"
  • "What is his tech stack?"
  • "Tell me about Love Vault or Zenith Finance"
  • "Is Arun open for hire or freelance work?"
  • "How do I contact him?"

Type any question below or use quick chips to get started!`
  }

  // 2. WHO ARE YOU / IDENTITY / ABOUT
  if (
    query.includes('who is arun') ||
    query.includes('who are you') ||
    query.includes('about arun') ||
    query.includes('introduce') ||
    query.includes('background') ||
    query.includes('bio') ||
    query.includes('who are u')
  ) {
    return `👨‍💻 ${BIO_FACTS.name} (${BIO_FACTS.handle})
Role: ${BIO_FACTS.role}
Location: ${BIO_FACTS.location}

Summary:
Arun Roshan is a passionate Computer Science Engineering student and developer who blends clean software architecture with modern cyber-tech visuals. He specializes in React.js, Tailwind CSS, JavaScript, and Flutter with Supabase, turning creative concepts into production-ready web and mobile experiences.

Highlights:
  ✓ Built RoshZen.in — Cyberpunk terminal portfolio with 30+ interactive commands
  ✓ Built Love Vault — Secure private couples memory app with Supabase
  ✓ Building Zenith — Dual-space personal & family finance app in Flutter
  ✓ Passionate about responsive UI, audio feedback, and clean code`
  }

  // 3. TERMINAL COMMANDS & SHORTCUTS HELP
  if (
    query.includes('command') ||
    query.includes('commands') ||
    query.includes('what can i run') ||
    query.includes('help me') ||
    query.includes('easter egg')
  ) {
    return `💻 Terminal Command Reference:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Here are some of the coolest commands you can run:
  • \`projects\` — Interactive project portfolio showcase
  • \`skills\` — Technical competencies matrix
  • \`lofi play\` / \`lofi stop\` — Lo-Fi ambient synth music player
  • \`scanlines\` — Retro CRT cathode monitor scanline filter
  • \`hack nasa\` — Cyber security hacker mainframe simulation
  • \`qr <label> <url>\` — Generate scannable QR code live
  • \`game snake\` | \`game tictactoe\` | \`game riddle\` — Interactive terminal games
  • \`theme <red|amber|green|cyan|matrix>\` — Switch terminal color theme
  • \`matrix\` — Matrix green code rain effect
  • \`contact\` — Open direct messaging box
  • \`help\` — List all 30+ supported commands!`
  }

  // 4. GENERAL TECH / PROGRAMMING QUESTIONS (React, Supabase, Flutter, Tailwind, etc.)
  if (query.includes('what is react') || query.includes('why react') || query.includes('explain react')) {
    return `⚛️ React is a declarative, component-based JavaScript library for building user interfaces.
In Arun's projects, React powers:
  • Reusable UI components and state management
  • High-performance interactive terminals and cyber web apps
  • Clean reactive data-binding with modern hooks (useState, useEffect, useCallback)`
  }

  if (query.includes('what is flutter') || query.includes('flutter vs react') || query.includes('explain flutter')) {
    return `📱 Flutter is Google's open-source UI toolkit for building natively compiled, multi-platform applications from a single codebase using Dart.
Arun uses Flutter (paired with Riverpod and Supabase) in his "Zenith Finance" app to deliver 60+ FPS native animations, cross-platform performance, and custom glassmorphism design.`
  }

  if (query.includes('what is supabase') || query.includes('explain supabase')) {
    return `⚡ Supabase is an open-source Firebase alternative built on PostgreSQL.
Arun uses Supabase for:
  • Instant Postgres database with Row Level Security (RLS)
  • User authentication (email/password, OAuth, magic links)
  • Real-time database change subscriptions (e.g. live expense sync in Zenith Finance & Love Vault)`
  }

  // 5. SPECIFIC PROJECTS (Love Vault, Zenith, RoshZen)
  if (
    query.includes('love vault') ||
    query.includes('couple') ||
    query.includes('memories app')
  ) {
    return `💖 Love Vault — Private Couple Memories Keepsake
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Concept: A private digital sanctuary for couples to store memories, milestones, photos, notes, and emotional moments.
• Tech Stack: React, Supabase (Auth, RLS & Storage), Tailwind CSS, Mobile-First UI
• Key Features:
  - Secure personal authentication & encryption
  - Interactive chronological memory timeline
  - Private shared vault space
• Live Demo: https://zen-love-vault.lovable.app
• GitHub: https://github.com/roshzxn1003/zen-love-vault`
  }

  if (
    query.includes('zenith') ||
    query.includes('finance') ||
    query.includes('expense')
  ) {
    return `💰 Zenith — Next-Gen Personal & Family Finance App
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Concept: A modern dual-space financial tracking app solving the tension between individual budgets and collective family spending.
• Tech Stack: Flutter, Dart, Riverpod State Management, Supabase Realtime Backend
• Key Features:
  - Space Switcher: Instantly toggle between Personal and Family expense buckets
  - Biometric authentication & real-time sync across devices
  - Translucent "Anti-Gravity" dark glassmorphism UI
  - Real-time transaction splitting and budget insights`
  }

  if (
    query.includes('portfolio') ||
    query.includes('roshzen.in') ||
    query.includes('website')
  ) {
    return `⚡ RoshZen Cyber Terminal Portfolio (This Website)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• URL: https://roshzen.in
• GitHub: https://github.com/roshzxn1003/portfolio
• Tech Stack: React 19, Tailwind CSS v4, Motion, Web Audio API, Canvas Shaders
• Standout Features:
  - Fully interactive bash-style terminal with 30+ functional commands
  - Realistic typewriter welcome animation & mechanical keyboard sound synthesis
  - Built-in Lo-Fi ambient coding radio synth
  - Retro CRT scanline phosphor display toggle
  - Interactive minigames (Snake, TicTacToe, Riddles), QR generator, Hacker simulator
  - AI Co-Pilot integrated into command line`
  }

  // 6. ALL PROJECTS / BUILDS
  if (
    query.includes('project') ||
    query.includes('what has he built') ||
    query.includes('portfolio work') ||
    query.includes('apps')
  ) {
    const list = projects
      .map(
        (p, i) =>
          `  ${i + 1}. ${p.title}
     Tech: ${p.stack.join(', ')}
     Description: ${p.idea}
     ${p.live ? `Live: ${p.live}` : ''} ${p.github ? `GitHub: ${p.github}` : ''}`
      )
      .join('\n\n')

    return `🚀 Arun's Featured Projects & Builds:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${list}

Tip: You can run \`projects\` in the terminal to view interactive cards with direct buttons!`
  }

  // 7. TECH STACK / SKILLS / PROGRAMMING LANGUAGES
  if (
    query.includes('tech stack') ||
    query.includes('skill') ||
    query.includes('language') ||
    query.includes('tools') ||
    query.includes('frontend') ||
    query.includes('react') ||
    query.includes('flutter') ||
    query.includes('python') ||
    query.includes('supabase')
  ) {
    const groupLines = skillGroups
      .map((g) => `  • ${g.title}: ${g.skills.join(', ')}`)
      .join('\n')

    return `🛠️ Technical Stack & Skills Matrix:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${groupLines}

Core Strengths:
  • Frontend: React, Tailwind CSS, JavaScript (ES6+), Responsive Design, Web Audio API
  • Mobile & App: Flutter, Dart, Riverpod
  • Backend & Cloud: Supabase (PostgreSQL, Auth, Realtime), Node.js, Express, REST APIs
  • Foundations: Python, Java Basics, C, DBMS, Git/GitHub, Ubuntu Linux

Tip: You can run \`skills\` in the terminal to view animated skill meters!`
  }

  // 5. HIRING / FREELANCE / INTERNSHIP / CONTACT
  if (
    query.includes('hire') ||
    query.includes('job') ||
    query.includes('intern') ||
    query.includes('freelance') ||
    query.includes('available') ||
    query.includes('work with') ||
    query.includes('contract')
  ) {
    return `💼 Hiring & Availability Status: OPEN!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Arun Roshan is actively available for:
  ✓ Software Engineering & Frontend Internships
  ✓ Junior Fullstack / React / Flutter Developer roles
  ✓ Freelance Web & Landing Page development (Portfolios, Startups, Creator Link Hubs)

Why hire Arun?
  • High attention to visual polish, responsive design, and smooth user interactions
  • Pragmatic code architecture: React, Flutter, Supabase, Tailwind
  • Rapid prototyping speed and strong appetite to learn new technologies

Get in touch directly:
  ✉️ Email: ${BIO_FACTS.email}
  💼 LinkedIn: ${BIO_FACTS.linkedin}
  🐙 GitHub: ${BIO_FACTS.github}
  Or run \`contact\` in this terminal to submit a direct message!`
  }

  // 6. CONTACT DETAILS / SOCIALS
  if (
    query.includes('contact') ||
    query.includes('email') ||
    query.includes('reach') ||
    query.includes('social') ||
    query.includes('linkedin') ||
    query.includes('github') ||
    query.includes('instagram')
  ) {
    const links = socialLinks
      .map((s) => `  • ${s.label}: ${s.handle} (${s.href})`)
      .join('\n')

    return `📬 Connect with Arun Roshan:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
${links}

Run \`contact\` in the terminal to open the interactive contact form card!`
  }

  // 7. SERVICES / WHAT CAN HE BUILD
  if (
    query.includes('service') ||
    query.includes('what can he build') ||
    query.includes('build for me') ||
    query.includes('landing page')
  ) {
    const svc = services.map((s) => `  • ${s.title}: ${s.text}`).join('\n')
    return `🛠️ Development Services Offered:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${svc}

Need a website or app concept built? Reach out at ${BIO_FACTS.email}!`
  }

  // 8. EDUCATION / COLLEGE / JOURNEY
  if (
    query.includes('education') ||
    query.includes('college') ||
    query.includes('study') ||
    query.includes('degree') ||
    query.includes('journey')
  ) {
    return `🎓 Education & Developer Journey:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Track: Computer Science & Engineering (B.E. / B.Tech CSE)
• Milestones:
  1. Mastered programming fundamentals in C & Python.
  2. Built strong frontend foundations with HTML5, modern CSS, and JavaScript.
  3. Advanced to modern component architecture with React, Tailwind CSS, and Motion.
  4. Expanded into fullstack & mobile: Flutter, Riverpod, Supabase backend integration.
  5. Current Focus: Production web apps, clean systems engineering, and creative UI engineering.

Run \`journey\` in the terminal to view his full career roadmap timeline!`
  }

  // 10. DEFAULT INTELLIGENT AI RESPONSE
  return `🤖 RoshZen Co-Pilot Response:
Regarding: "${rawPrompt}"

Arun Roshan is a Computer Science Engineering student and developer specializing in React, Tailwind CSS, JavaScript, and Flutter with Supabase.

Quick resources:
  • View his work: type \`projects\` or \`skills\` in the terminal
  • Connect directly: ${BIO_FACTS.email} | ${BIO_FACTS.linkedin}
  • Live repos: ${BIO_FACTS.github}

Feel free to ask more specific questions like "Tell me about Love Vault", "What are his frontend skills?", or "Is he open to internships?"!`
}
