import { ArrowUpRight, GitBranch, LockKeyhole } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

function ProjectAction({ href, children, icon: Icon }) {
  if (!href) {
    return (
      <button
        type="button"
        className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-red-400/15 px-4 py-2 text-sm font-semibold text-slate-500"
        aria-disabled="true"
      >
        <LockKeyhole size={16} />
        Coming Soon
      </button>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500 hover:text-white"
    >
      <Icon size={16} />
      {children}
    </a>
  )
}

function Projects({ projects }) {
  const updateCardGlow = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
    const rotateX = ((y - rect.height / 2) / rect.height) * -6
    const rotateY = ((x - rect.width / 2) / rect.width) * 6
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`
    card.style.zIndex = '40'
    if (card.parentElement) {
      card.parentElement.style.zIndex = '40'
    }
  }

  const resetCardTilt = (event) => {
    event.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)'
    event.currentTarget.style.zIndex = ''
    if (event.currentTarget.parentElement) {
      event.currentTarget.parentElement.style.zIndex = ''
    }
  }

  return (
    <section id="projects" className="section-shell py-20 md:py-28 relative z-20">
      <SectionHeader
        eyebrow="Projects"
        title="Real builds, app concepts, and developer experiments — all in one place."
        text="Every project here is a step in my journey — from polished portfolio work to creative app ideas and full-stack concepts built with modern tools."
      />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 p-1">
        {projects.map((project, index) => (
          <Reveal
            key={project.title}
            delay={index * 0.06}
            className="relative z-10 transition-[z-index] duration-150 hover:z-40 h-full"
          >
            <article
              className="project-card red-corner glass-panel group relative z-10 flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-[border-color,box-shadow,z-index] duration-300 hover:z-40 hover:border-red-400/45 m-0.5"
              onMouseMove={updateCardGlow}
              onMouseLeave={resetCardTilt}
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.18em] text-red-300">
                    Project 0{index + 1}
                  </p>
                  <h3 className="mt-3 text-3xl font-bold text-white">{project.title}</h3>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-500/10 text-red-300 transition group-hover:bg-red-500 group-hover:text-white">
                  <ArrowUpRight size={20} />
                </span>
              </div>

              <p className="mt-5 leading-7 text-slate-300">{project.idea}</p>

              <div className="mt-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                  Tech Stack
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-red-400/20 bg-red-500/[0.055] px-3 py-1.5 text-sm text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex-1">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                  Features
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                  {project.features.map((feature) => (
                    <li key={feature} className="rounded-xl border border-red-400/15 bg-black/30 p-3">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 flex flex-wrap gap-3 border-t border-red-400/15 pt-5">
                <ProjectAction href={project.github} icon={GitBranch}>
                  GitHub
                </ProjectAction>
                <ProjectAction href={project.live} icon={ArrowUpRight}>
                  Live Demo
                </ProjectAction>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default Projects