import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navLinks, socialLinks } from '../data/portfolio'
import StaggeredMenu from './StaggeredMenu'

const resumeUrl = '/AR-resume.pdf'

function Navbar() {
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

  const menuItems = navLinks.map((link) => ({
    label: link.label,
    ariaLabel: `Go to ${link.label} section`,
    link: link.href,
  }))

  const menuSocials = socialLinks.map((s) => ({
    label: s.label,
    link: s.href,
  }))

  return (
    <>
      {/* Mobile Only: StaggeredMenu from React Bits */}
      <StaggeredMenu
        className="mobile-only lg:hidden"
        isFixed={true}
        position="right"
        items={menuItems}
        socialItems={menuSocials}
        displaySocials={true}
        displayItemNumbering={true}
        colors={['#1c0404', '#450a0a', '#991b1b']}
        accentColor="#ef4444"
        menuButtonColor="#ffffff"
        openMenuButtonColor="#ffffff"
        changeMenuColorOnOpen={true}
      />

      {/* Desktop Only: Original Navigation Header (Undisturbed) */}
      <header className="hidden lg:block fixed inset-x-0 top-4 z-50">
        <nav className="section-shell nav-shell flex min-h-16 items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <a href="#home" className="flex items-center gap-3 text-white" aria-label="RoshZen home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-red-400 to-red-800 font-mono text-sm font-black text-white shadow-[0_0_28px_rgba(220,38,38,0.32)]">
              AR
            </span>
            <span>
              <span className="block font-mono text-sm font-semibold text-white">RoshZen</span>
              <span className="block text-xs text-slate-400">Arun Roshan Portfolio</span>
            </span>
          </a>

          <div className="flex items-center gap-1 rounded-full border border-red-400/15 bg-black/25 p-1">
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

          <div className="flex items-center gap-3">
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
        </nav>
      </header>
    </>
  )
}

export default Navbar