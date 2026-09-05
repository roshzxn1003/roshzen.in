import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

function Journey({ journey }) {
  return (
    <section id="journey" className="section-shell py-20 md:py-28">
      <SectionHeader
        eyebrow="Learning Journey"
        title="A growth path built through practice, projects, and steady improvement."
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-red-400 via-red-700 to-transparent shadow-[0_0_22px_rgba(var(--portfolio-accent-glow-rgb,220,38,38),0.35)] md:left-1/2" />

        <div className="grid gap-6">
          {journey.map((item, index) => {
            const Icon = item.icon
            const isEven = index % 2 === 0
            return (
              <Reveal key={item.title} delay={index * 0.05}>
                <div
                  className={`relative grid gap-5 pl-14 md:grid-cols-2 md:pl-0 ${
                    isEven ? '' : 'md:[&>article]:col-start-2'
                  }`}
                >
                  <span className="absolute left-0 top-6 z-10 grid h-10 w-10 place-items-center rounded-2xl border border-red-400/45 bg-[var(--portfolio-bg-solid,#07080c)] text-red-200 shadow-[0_0_28px_rgba(var(--portfolio-accent-glow-rgb,220,38,38),0.28)] md:left-1/2 md:-translate-x-1/2">
                    <Icon size={19} />
                  </span>

                  <article className="journey-card glass-panel rounded-3xl p-6 transition duration-300 hover:-translate-y-2 hover:border-red-400/45">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-red-300">
                      Step {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
                  </article>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Journey