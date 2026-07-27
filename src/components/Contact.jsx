import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, Loader2, Send, XCircle } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const INITIAL = { name: '', email: '', projectType: 'Portfolio website', message: '' }

function Contact({ socialLinks }) {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setForm(INITIAL)
    } catch {
      setErrorMsg('Could not reach the server. Make sure the backend is running.')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section-shell py-20 md:py-28">
      <SectionHeader
        eyebrow="Contact"
        title="Have an idea, project, or collaboration? Send a message."
        text="Fill in the form and your message will be saved directly to the server. I'll get back to you soon."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* ── Left: Social links ───────────────────────────────────────────── */}
        <Reveal>
          <div className="glass-panel h-full rounded-3xl p-6 md:p-8">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-red-300">
              Start a conversation
            </p>
            <h3 className="mt-4 text-3xl font-bold text-white">Let's build something clean.</h3>
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

        {/* ── Right: Contact form ──────────────────────────────────────────── */}
        <Reveal delay={0.08}>
          <form className="glass-panel rounded-3xl p-6 md:p-8" onSubmit={handleSubmit} noValidate>

            {/* Success banner */}
            {status === 'success' && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                <span className="text-sm font-medium leading-6">
                  Message sent! I'll get back to you soon. 🎉
                </span>
              </div>
            )}

            {/* Error banner */}
            {status === 'error' && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
                <XCircle size={20} className="mt-0.5 shrink-0" />
                <span className="text-sm font-medium leading-6">{errorMsg}</span>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Name <span className="text-red-400">*</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="contact-input"
                  autoComplete="name"
                  required
                  disabled={status === 'loading'}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Email <span className="text-red-400">*</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="contact-input"
                  autoComplete="email"
                  required
                  disabled={status === 'loading'}
                />
              </label>
            </div>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-200">
              Project Type
              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                className="contact-input"
                disabled={status === 'loading'}
              >
                <option>Portfolio website</option>
                <option>React app idea</option>
                <option>Church website</option>
                <option>Student project</option>
                <option>Creative design idea</option>
              </select>
            </label>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-200">
              Message <span className="text-red-400">*</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="6"
                placeholder="Tell me about your idea..."
                className="contact-input resize-none"
                required
                disabled={status === 'loading'}
              />
            </label>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 px-6 py-4 font-bold text-white shadow-[0_0_32px_rgba(220,38,38,0.28)] transition hover:-translate-y-1 hover:from-red-400 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact