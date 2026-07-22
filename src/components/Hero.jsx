import { ArrowRight, Download, Mail, Sparkles, Terminal } from 'lucide-react'
import { motion } from 'motion/react'
import arunAvatar from '../assets/arun-roshan-avatar.png'
import TypingTerminal from './TypingTerminal'

const resumeUrl = '/AR-resume.pdf'

function Hero({ heroStats, techBadges }) {
  return (
    <section id="home" className="section-shell relative flex min-h-screen items-center pt-24 sm:pt-28">
      <div className="hero-lines" aria-hidden="true" />

      <div className="relative z-10 flex w-full flex-col items-center gap-10 py-10 sm:py-12 lg:flex-row lg:justify-between lg:gap-12 lg:py-16">
        <motion.div
          className="w-full min-w-0 flex-1 text-center lg:text-left"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 font-mono text-xs text-red-100 shadow-[0_0_30px_rgba(220,38,38,0.16)] sm:text-sm">
            <Sparkles size={16} />
            <span className="truncate">RoshZen.exe is online</span>
          </div>

          <h1 className="hero-title-glow mx-auto max-w-5xl text-5xl font-black leading-[0.98] text-white sm:text-6xl md:text-7xl lg:mx-0 xl:text-8xl">
            <span className="bg-gradient-to-r from-red-300 via-red-500 to-red-800 bg-clip-text text-transparent">
              RoshZen
            </span>
            <span className="block bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text pb-2 text-transparent">
              Arun Roshan
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl font-mono text-xs uppercase leading-6 tracking-[0.12em] text-red-200 sm:text-sm sm:tracking-[0.18em] lg:mx-0">
            CSE Student • Frontend Developer • App Developer • Future Software Engineer
          </p>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
            I build modern websites, React apps, learning platforms, and creative digital projects
            while growing as a software engineer.
          </p>

          <div className="motion-strip mx-auto mt-7 lg:mx-0" aria-hidden="true">
            <div className="motion-strip-track">
              <span>React Developer</span>
              <span>Frontend Builder</span>
              <span>App Ideas</span>
              <span>Clean UI</span>
              <span>Future Software Engineer</span>
              <span>React Developer</span>
              <span>Frontend Builder</span>
              <span>App Ideas</span>
              <span>Clean UI</span>
              <span>Future Software Engineer</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {techBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-red-400/20 bg-red-500/[0.07] px-4 py-2 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-6 py-3 font-semibold text-white shadow-[0_0_34px_rgba(220,38,38,0.34)] transition hover:-translate-y-1 hover:from-red-400 hover:to-red-600"
            >
              View Projects
              <ArrowRight size={18} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/[0.06] px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:border-red-300/70 hover:bg-red-500/15"
            >
              <Mail size={18} />
              Contact Me
            </a>
            <a
              href={resumeUrl}
              download="Arun_Roshan_Resume.pdf"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/[0.06] px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:border-red-300/70 hover:bg-red-500/15"
            >
              <Download size={18} />
              Download Resume
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 w-full min-w-0 flex-shrink-0 sm:max-w-[620px] lg:w-[430px] lg:max-w-none xl:w-[470px]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="profile-shell glass-panel mx-auto overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between border-b border-red-400/15 bg-red-500/[0.035] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-red-500" />
              </div>
              <span className="font-mono text-xs text-slate-400">developer-card.jsx</span>
            </div>

            <div className="p-4 sm:p-5 xl:p-6">
              <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col">
                <div className="w-full max-w-[230px] shrink-0 overflow-hidden rounded-3xl border border-red-400/35 bg-[#140606] p-2 shadow-[0_0_54px_rgba(220,38,38,0.3)] sm:max-w-[220px] lg:max-w-[250px] xl:max-w-[280px]">
                  <img
                    src={arunAvatar}
                    alt="Arun Roshan profile portrait"
                    width={280}
                    height={350}
                    decoding="async"
                    fetchPriority="high"
                    className="block aspect-[4/5] h-auto w-full rounded-2xl object-contain"
                  />
                </div>

                <div className="min-w-0 text-center sm:text-left lg:text-center">
                  <p className="font-mono text-xs uppercase leading-5 tracking-[0.16em] text-red-300">
                    Available for Projects
                  </p>
                  <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
                    Frontend + App Ideas
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                    React, JavaScript, Python, Tailwind CSS, UI/UX thinking, and clean student
                    project builds.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <TypingTerminal />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-red-400/15 bg-red-500/[0.055] p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-red-300/80">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                <Terminal size={18} className="mt-1 shrink-0" />
                <span>Currently building better React projects and app concepts.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero