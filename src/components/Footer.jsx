function Footer({ socialLinks }) {
  return (
    <footer className="border-t border-red-400/15 py-8">
      <div className="section-shell flex flex-col items-center justify-between gap-5 text-center text-sm text-slate-400 md:flex-row md:text-left">
        <div>
          <p className="font-mono text-base font-bold text-white">RoshZen</p>
          <p className="mt-1">© 2026 Arun Roshan. Built with React and clean UI thinking.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {socialLinks
            .filter((item) => item.href)
            .map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-red-400/15 bg-red-500/[0.045] text-slate-300 transition hover:border-red-400/45 hover:text-red-200"
                  aria-label={item.label}
                >
                  <Icon size={18} />
                </a>
              )
            })}
        </div>
      </div>
    </footer>
  )
}

export default Footer