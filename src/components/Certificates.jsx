import { useState } from 'react'
import {
  ExternalLink,
  Eye,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Award,
} from 'lucide-react'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

export default function Certificates({ certificates = [] }) {
  const [selectedIssuer, setSelectedIssuer] = useState('ALL')
  const [copiedId, setCopiedId] = useState(null)

  const activeCerts = certificates
    .filter((c) => c.is_active !== false)
    .sort((a, b) => (a.position || 0) - (b.position || 0))

  const issuers = ['ALL', ...new Set(activeCerts.map((c) => c.issuer).filter(Boolean))]

  const filteredCerts =
    selectedIssuer === 'ALL'
      ? activeCerts
      : activeCerts.filter((c) => c.issuer === selectedIssuer)

  const handleCopyCredential = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!id) return
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const updateCardGlow = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
    const rotateX = ((y - rect.height / 2) / rect.height) * -5
    const rotateY = ((x - rect.width / 2) / rect.width) * 5
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`
    card.style.zIndex = '40'
    if (card.parentElement) {
      card.parentElement.style.zIndex = '40'
    }
  }

  const resetCardTilt = (event) => {
    event.currentTarget.style.transform =
      'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)'
    event.currentTarget.style.zIndex = ''
    if (event.currentTarget.parentElement) {
      event.currentTarget.parentElement.style.zIndex = ''
    }
  }

  return (
    <section id="certificates" className="section-shell py-20 md:py-28 relative z-10">
      <SectionHeader
        eyebrow="Certifications"
        title="Verified credentials, specializations, and professional learning milestones."
        text="Formal coursework, professional specializations, and developer certifications backing my software engineering foundation."
      />

      {/* Top Telemetry Info & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">{activeCerts.length}</strong> Verified Credentials
          </span>
          <span>•</span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Authenticated Records
          </span>
        </div>

        {/* Filter Pills */}
        {issuers.length > 2 && (
          <div className="flex flex-wrap items-center gap-2">
            {issuers.map((issuer) => {
              const count =
                issuer === 'ALL'
                  ? activeCerts.length
                  : activeCerts.filter((c) => c.issuer === issuer).length

              return (
                <button
                  key={issuer}
                  onClick={() => setSelectedIssuer(issuer)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition border cursor-pointer flex items-center gap-2 ${
                    selectedIssuer === issuer
                      ? 'bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.35)] font-bold'
                      : 'bg-black/30 border-red-400/15 text-slate-300 hover:border-red-400/40 hover:text-white'
                  }`}
                >
                  <span>{issuer}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedIssuer === issuer ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Certificates Grid */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 p-1">
        {filteredCerts.map((cert, index) => {
          const viewCertificateLink = cert.viewUrl || cert.certificateImage || cert.verifyUrl

          return (
            <Reveal
              key={cert.id || cert.title}
              delay={index * 0.07}
              className="relative z-10 transition-[z-index] duration-150 hover:z-40 h-full"
            >
              <article
                onMouseMove={updateCardGlow}
                onMouseLeave={resetCardTilt}
                className="certificate-card red-corner glass-panel group relative z-10 flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-8 transition-[border-color,box-shadow,z-index] duration-300 hover:z-40 hover:border-red-400/45 border border-red-400/15 bg-black/40 m-0.5"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                <div className="relative z-10 space-y-6">
                  {/* Top HUD Index Bar */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-red-400/10">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-300 flex items-center gap-2">
                      <span>CERTIFICATE 0{index + 1}</span>
                      <span className="text-slate-600">//</span>
                      <span className="text-slate-400 font-normal">CREDENTIAL LOG</span>
                    </p>

                    <div className="flex items-center gap-2">
                      {cert.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Featured
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* 🏆 Header with Trophy & Title */}
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/30 text-2xl group-hover:scale-105 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                      <span role="img" aria-label="trophy">🏆</span>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug group-hover:text-red-200 transition-colors">
                        {cert.title}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata Spec Box: Issued by | Date | Credential ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-red-400/15 bg-black/40 font-mono text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                          Issued by
                        </span>
                        <span className="font-semibold text-slate-200 truncate block">
                          {cert.issuer || 'Accredited Org'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                          Date
                        </span>
                        <span className="font-semibold text-slate-200 truncate block">
                          {cert.date || 'Completed'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 min-w-0 sm:border-l sm:border-white/5 sm:pl-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                            Credential ID
                          </span>
                          <span className="font-semibold text-slate-200 truncate block font-mono text-[11px]">
                            {cert.credentialId || 'ID Logged'}
                          </span>
                        </div>
                      </div>

                      {cert.credentialId && (
                        <button
                          onClick={(e) => handleCopyCredential(cert.credentialId, e)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                          title="Copy Credential ID"
                        >
                          {copiedId === cert.credentialId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* About the Certificate */}
                  {cert.about && (
                    <div className="space-y-1.5">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-red-400" />
                        About the Certificate
                      </p>
                      <p className="leading-7 text-slate-300 text-sm sm:text-[15px]">
                        {cert.about}
                      </p>
                    </div>
                  )}

                  {/* Skills Covered */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                        Skills Covered
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-full border border-red-400/20 bg-red-500/[0.055] px-3.5 py-1.5 text-xs font-mono text-slate-200 hover:border-red-400/40 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificate Holographic Preview (Click opens in new tab) */}
                  {cert.certificateImage && (
                    <div className="space-y-2">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                        Certificate Document
                      </p>
                      <a
                        href={viewCertificateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/doc block relative rounded-2xl overflow-hidden border border-red-400/20 bg-black/60 shadow-lg cursor-pointer transition-all duration-300 hover:border-red-500/60"
                        title="Click to view full certificate details in a new tab"
                      >
                        <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                          <img
                            src={cert.certificateImage}
                            alt={cert.title}
                            className="w-full h-full object-cover object-center group-hover/doc:scale-105 transition-transform duration-500 opacity-90 group-hover/doc:opacity-100"
                          />
                          {/* Cyber HUD Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end justify-between p-4">
                            <div className="flex items-center gap-2 text-xs font-mono text-white font-semibold">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              <span className="group-hover/doc:text-red-300 transition-colors">
                                Click to open details in new tab
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/80 text-slate-300 border border-white/10 group-hover/doc:border-red-500/40">
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3 text-red-400" />
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                </div>

                {/* Dual Action Buttons */}
                <div className="relative z-10 mt-7 flex flex-wrap gap-3 border-t border-red-400/15 pt-5">
                  {viewCertificateLink && (
                    <a
                      href={viewCertificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-black/40 px-5 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 hover:border-red-400/60 cursor-pointer shadow-sm hover:text-white"
                    >
                      <Eye className="w-4 h-4 text-red-400" />
                      <span>View Certificate</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                    </a>
                  )}

                  {cert.verifyUrl ? (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition shadow-[0_0_24px_rgba(239,68,68,0.35)] hover:shadow-[0_0_32px_rgba(239,68,68,0.6)] cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Credential</span>
                    </a>
                  ) : (
                    <div className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/15 px-4 py-2.5 text-xs font-mono text-slate-500">
                      <span>Verification on Request</span>
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
