import { ArrowUpRight, Send } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

function Contact({ socialLinks }) {
  return (
    <section id="contact" className="section-shell py-20 md:py-28">
      <SectionHeader
        eyebrow="Contact"
        title="Have an idea, project, or collaboration? Send a message."
        text="This form is frontend-only for now. You can also reach me directly through email or social links."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <div className="glass-panel h-full rounded-3xl p-6 md:p-8">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-red-300">
              Start a conversation
            </p>
            <h3 className="mt-4 text-3xl font-bold text-white">Let’s build something clean.</h3>
            <p className="mt-4 leading-8 text-slate-300">
              I am open to student project websites, portfolio pages, React app ideas, church
              websites, and creative digital work that helps me keep growing as a developer.
            </p>

            <div className="mt-8 grid gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon
                const content = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-500/10 text-red-300">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">{item.label}</span>
                      <span className="block truncate text-sm text-slate-400">{item.handle}</span>
                    </span>
                    {item.href && <ArrowUpRight className="ml-auto shrink-0 text-slate-500" size={18} />}
                  </>
                )

                if (!item.href) {
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-2xl border border-red-400/15 bg-black/30 p-4"
                    >
                      {content}
                    </div>
                  )
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-red-400/15 bg-black/30 p-4 transition hover:-translate-y-1 hover:border-red-400/40 hover:bg-red-500/10"
                  >
                    {content}
                  </a>
                )
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form className="glass-panel rounded-3xl p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="contact-input"
                  autoComplete="name"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="contact-input"
                  autoComplete="email"
                />
              </label>
            </div>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-200">
              Project Type
              <select name="projectType" className="contact-input">
                <option>Portfolio website</option>
                <option>React app idea</option>
                <option>Church website</option>
                <option>Student project</option>
                <option>Creative design idea</option>
              </select>
            </label>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-200">
              Message
              <textarea
                name="message"
                rows="6"
                placeholder="Tell me about your idea..."
                className="contact-input resize-none"
              />
            </label>

            <button
              type="button"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 px-6 py-4 font-bold text-white shadow-[0_0_32px_rgba(220,38,38,0.28)] transition hover:-translate-y-1 hover:from-red-400 hover:to-red-600"
              aria-label="Frontend-only contact form send button"
            >
              <Send size={18} />
              Frontend Form Preview
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact