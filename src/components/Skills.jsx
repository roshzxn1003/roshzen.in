import { motion } from 'motion/react'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

function Skills({ skillGroups }) {
  return (
    <section id="skills" className="section-shell py-20 md:py-28">
      <SectionHeader
        eyebrow="Skills"
        title="A practical stack for frontend, programming, tools, and continuous learning."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {skillGroups.map((group, index) => {
          const Icon = group.icon
          return (
            <Reveal key={group.title} delay={index * 0.06}>
              <article className="skill-card red-corner glass-panel group h-full rounded-3xl p-6 transition duration-300 hover:-translate-y-2 hover:border-red-400/45">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-500/10 text-red-300 transition group-hover:bg-red-500 group-hover:text-white">
                    <Icon size={24} />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{group.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{group.skills.length} technologies</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-red-400/15 bg-black/35 px-3 py-2 text-sm text-slate-200 transition group-hover:border-red-300/40 group-hover:bg-red-500/10 hover:scale-105 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default Skills