import { Download, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navLinks } from '../data/portfolio'

const resumeUrl = '/AR-resume.pdf'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible?.target?.id) {
          setActive(visible.target.id)
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-4 z-50">
      <nav className="section-shell nav-shell flex min-h-16 items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <a href="#home" className="flex items-center gap-3 text-white" aria-label="RoshZen home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-red-400 to-red-800 font-mono text-sm font-black text-white shadow-[0_0_28px_rgba(220,38,38,0.32)]">
            AR
          </span>
          <span className="hidden sm:block">
            <span className="block font-mono text-sm font-semibold text-white">RoshZen</span>
            <span className="block text-xs text-slate-400">Arun Roshan Portfolio</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-red-400/15 bg-black/25 p-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition duration-300 ${
                  isActive
                    ? 'bg-red-500 text-white shadow-[0_0_24px_rgba(220,38,38,0.28)] scale-[1.02]'
                    : 'relative text-slate-300 after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-red-400 after:transition hover:bg-red-500/10 hover:text-red-100 hover:after:scale-x-100'
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={resumeUrl}
            download="Arun_Roshan_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-500/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-red-300/70 hover:bg-red-500/15"
          >
            <Download size={16} />
            Resume
          </a>
          <a
            href="#contact"
            className="rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_22px_rgba(220,38,38,0.25)] transition hover:from-red-400 hover:to-red-600"
          >
            Contact
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/[0.06] text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="section-shell pt-2 lg:hidden">
          <div className="glass-panel grid gap-1 rounded-2xl p-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-red-500/10 hover:text-red-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={resumeUrl}
              download="Arun_Roshan_Resume.pdf"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/[0.06] px-4 py-3 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              <Download size={16} />
              Resume
            </a>
            <a
              href="#contact"
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-4 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar