import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

function Services({ services }) {
  return (
    <section id="services" className="section-shell py-20 md:py-28">
      <SectionHeader
        eyebrow="What I Can Build"
        title="Useful digital work for students, creators, churches, and small projects."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <Reveal key={service.title} delay={index * 0.05}>
              <article className="service-card red-corner glass-panel group h-full rounded-3xl p-6 transition duration-300 hover:-translate-y-2 hover:border-red-400/45">
                <div className="mb-6 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-500/10 text-red-300 transition group-hover:bg-red-500 group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                    service
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{service.text}</p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default Services