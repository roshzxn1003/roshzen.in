import {
  BadgeCheck,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Code2,
  Database,
  Camera,
  CirclePlay,
  GitBranch,
  Globe2,
  GraduationCap,
  Layers3,
  Laptop,
  Mail,
  MonitorSmartphone,
  Palette,
  Rocket,
  Terminal,
} from 'lucide-react'

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]

export const heroStats = [
  { label: 'Track', value: 'CSE Student' },
  { label: 'Frontend', value: 'React Learner' },
  { label: 'Programming', value: 'Python Basics' },
  { label: 'Build Mode', value: 'App Builder' },
]

export const profileHighlights = [
  'CSE student building real web and app ideas',
  'Frontend developer focused on React and clean UI',
  'Future software engineer practicing production habits',
]

export const skillGroups = [
  {
    title: 'Frontend',
    icon: MonitorSmartphone,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
  },
  {
    title: 'Programming',
    icon: Terminal,
    skills: ['Python', 'Java Basics', 'C Basics'],
  },
  {
    title: 'Tools',
    icon: Laptop,
    skills: ['GitHub', 'VS Code', 'Ubuntu', 'Vercel'],
  },
  {
    title: 'Learning',
    icon: Brain,
    skills: ['DBMS', 'React', 'App Development', 'UI/UX'],
  },
]

export const projects = [
  {
    title: 'RoshZen Portfolio',
    idea: 'My personal red-black cyber-tech portfolio website for presenting skills, projects, services, and learning progress.',
    stack: ['React', 'Tailwind CSS', 'Motion'],
    features: ['Responsive sections', 'Premium red theme', 'Recruiter-friendly content'],
    github: 'https://github.com/roshzxn1003/portfolio',
    live: 'https://roshzen.in',
  },
   {
    title: 'Love Vault',
    idea: 'A private couple memories app concept for saving moments, notes, dates, and emotional digital keepsakes.',
    stack: ['React', 'Supabase', 'Mobile UI'],
    features: ['Private vault concept', 'Memory timeline', 'Secure app structure'],
    github: 'https://github.com/roshzxn1003/zen-love-vault',
    live: 'https://zen-love-vault.lovable.app',
  },
  {
    title: 'Zen Coder',
    idea: 'A daily learning app idea for programming practice, AI-assisted learning, and vibe coding discipline.',
    stack: ['React', 'Tailwind CSS', 'Learning UX'],
    features: ['Daily coding goals', 'Progress cards', 'Focused practice flow'],
    github: '',
    live: '',
  },
  {
    title: 'Website',
    idea: 'A church website project for events, worship updates, ministry details, and contact.',
    stack: ['React', 'Responsive Web', 'Content UI'],
    features: ['Service info', 'Event sections', 'Clean community pages'],
    github: '',
    live: '',
  },
  {
    title: 'Link-in-Bio Website',
    idea: 'A fast personal/social links page for creators, students, and small brands to share all important links.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    features: ['Social buttons', 'Mobile-first layout', 'Personal branding'],
    github: '',
    live: '',
  },
  {
    title: 'Python Daily',
    idea: 'A beginner-friendly Python learning platform idea built around simple daily lessons and practice tasks.',
    stack: ['Python', 'React', 'Education UX'],
    features: ['Beginner lessons', 'Practice prompts', 'Daily consistency flow'],
    github: '',
    live: '',
  },
]

export const journey = [
  {
    title: 'Started Computer Science Engineering',
    text: 'Began the CSE path and started connecting classroom concepts with real software ideas.',
    icon: GraduationCap,
  },
  {
    title: 'Learned Python Basics',
    text: 'Practiced programming fundamentals, logic, syntax, and beginner-friendly problem solving.',
    icon: Code2,
  },
  {
    title: 'Practiced HTML, CSS, and JavaScript',
    text: 'Built frontend fundamentals with structure, styling, interactions, and responsive thinking.',
    icon: Layers3,
  },
  {
    title: 'Started React Development',
    text: 'Moved into component-based frontend development, reusable UI, state thinking, and modern layouts.',
    icon: Layers3,
  },
  {
    title: 'Built Portfolio and App Ideas',
    text: 'Created a personal developer presence and started shaping learning apps, link pages, and web concepts.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Future Goal: Professional Software Engineer',
    text: 'Growing toward professional software engineering with stronger code quality, systems thinking, and teamwork.',
    icon: BadgeCheck,
  },
]

export const services = [
  {
    title: 'Portfolio Websites',
    text: 'Clean personal sites for students, creators, and early-career developers.',
    icon: Globe2,
  },
  {
    title: 'Church Websites',
    text: 'Responsive community websites for events, worship information, and contact.',
    icon: BookOpen,
  },
  {
    title: 'Link-in-Bio Pages',
    text: 'Fast, mobile-first pages for social profiles, creator links, and small brands.',
    icon: Layers3,
  },
  {
    title: 'React Landing Pages',
    text: 'Modern landing pages with reusable components, clear flows, and polished UI.',
    icon: Code2,
  },
  {
    title: 'Student Project Websites',
    text: 'Project landing pages and demo interfaces for academic and learning work.',
    icon: Database,
  },
  {
    title: 'Simple App UI Concepts',
    text: 'Clean mobile and web app interface concepts for learning platforms and product ideas.',
    icon: Palette,
  },
]

export const socialLinks = [
  {
    label: 'GitHub',
    handle: 'github.com/roshzxn1003',
    href: 'https://github.com/roshzxn1003',
    icon: GitBranch,
  },
  {
    label: 'Instagram',
    handle: 'instagram.com/rosh.zxn',
    href: 'https://instagram.com/rosh.zxn',
    icon: Camera,
  },
  {
    label: 'YouTube',
    handle: 'youtube.com/@roshzxn',
    href: 'https://www.youtube.com/@roshzxn',
    icon: CirclePlay,
  },
  {
    label: 'LinkedIn',
    handle: 'linkedin.com/in/arun-roshan-gj',
    href: 'https://www.linkedin.com/in/arun-roshan-gj/',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Email',
    handle: 'arunroshan1003@gmail.com',
    href: 'mailto:arunroshan1003@gmail.com',
    icon: Mail,
  },
]

export const techBadges = ['React', 'JavaScript', 'Python', 'UI Design', 'App Ideas', 'Vercel']

export const designPrinciples = [
  { label: 'Readable code', icon: Code2 },
  { label: 'Responsive UI', icon: MonitorSmartphone },
  { label: 'Clean visuals', icon: Palette },
  { label: 'Real projects', icon: Rocket },
]