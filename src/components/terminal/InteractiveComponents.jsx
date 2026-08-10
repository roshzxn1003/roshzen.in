import { useEffect, useState } from 'react'
import { ArrowUpRight, ExternalLink, GitBranch, Globe2, Mail, MessageSquare, QrCode } from 'lucide-react'

// 1. LIVE CLOCK
export function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="my-2 rounded-xl border border-red-500/30 bg-black/60 p-4 font-mono shadow-[0_0_20px_rgba(239,68,68,0.15)]">
      <div className="text-xs uppercase tracking-widest text-red-400">System Live Clock</div>
      <div className="my-1 text-3xl font-black text-white tracking-wider">
        {time.toLocaleTimeString()}
      </div>
      <div className="text-xs text-slate-400">
        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
}

// 2. STOPWATCH
export function Stopwatch({ action }) {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (action === 'pause') setIsActive(false)
    if (action === 'resume' || action === 'start') setIsActive(true)
    if (action === 'reset') {
      setSeconds(0)
      setIsActive(false)
    }
  }, [action])

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600)
    const mins = Math.floor((totalSec % 3600) / 60)
    const secs = totalSec % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="my-2 rounded-xl border border-emerald-500/30 bg-black/60 p-4 font-mono">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-emerald-400">Terminal Stopwatch</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-300 animate-pulse' : 'bg-slate-700 text-slate-300'}`}>
          {isActive ? 'RUNNING' : 'PAUSED'}
        </span>
      </div>
      <div className="my-2 text-4xl font-black text-emerald-300 tracking-wider">
        {formatTime(seconds)}
      </div>
      <div className="text-[11px] text-slate-400">
        Use <code className="text-emerald-400">timer pause</code>, <code className="text-emerald-400">timer resume</code>, <code className="text-emerald-400">timer reset</code>
      </div>
    </div>
  )
}

// 3. FAKE HACKING ANIMATION
export function FakeHacker({ target = 'NASA' }) {
  const [step, setStep] = useState(0)

  const steps = [
    `Connecting to target server: [${target.toUpperCase()}]...`,
    'Bypassing firewall security protocols...',
    'Injecting payload into root mainframe buffer...',
    'Decrypting RSA-4096 SSL certificates...',
    'Downloading classified repository logs...',
    'Access Granted! Mainframe compromised 🚀',
  ]

  useEffect(() => {
    if (step < steps.length - 1) {
      const timeout = setTimeout(() => {
        setStep((prev) => prev + 1)
      }, 750)
      return () => clearTimeout(timeout)
    }
  }, [step, steps.length])

  return (
    <div className="my-2 rounded-xl border border-green-500/30 bg-black/80 p-4 font-mono text-green-400">
      <div className="text-xs text-green-500/70 font-bold mb-2">⚡ HACKER SIMULATOR v4.2</div>
      {steps.slice(0, step + 1).map((msg, i) => (
        <div key={i} className="my-1 flex items-center gap-2 text-xs">
          <span className="text-green-500">❯</span>
          <span>{msg}</span>
        </div>
      ))}
      {step < steps.length - 1 && (
        <div className="mt-2 h-1.5 w-full bg-green-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

// 4. REAL QR GENERATOR
export function QrCodeGenerator({ text, url }) {
  const targetUrl = url || 'https://github.com/roshzxn1003'
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl)}&color=000000&bgcolor=ffffff`
  const fallbackQrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(targetUrl)}`

  const [imgSrc, setImgSrc] = useState(qrApiUrl)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setImgSrc(qrApiUrl)
    setLoading(true)
  }, [targetUrl])

  return (
    <div className="my-3 inline-flex flex-col items-center rounded-2xl border border-red-500/30 bg-black/90 p-4 text-center font-mono shadow-xl transition-all hover:border-red-500/60">
      <div className="mb-2 text-xs font-bold text-red-400 tracking-wider flex items-center gap-1.5">
        <QrCode size={14} className="text-red-400" />
        <span>SCANNABLE QR CODE: {(text || 'LINK').toUpperCase()}</span>
      </div>
      
      <div className="relative bg-white p-3 rounded-xl shadow-lg border border-slate-200 group min-w-[160px] min-h-[160px] flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-xl text-xs text-slate-500 font-sans">
            Generating QR...
          </div>
        )}
        <img
          src={imgSrc}
          alt={`Original QR Code for ${text || 'link'}`}
          className="w-40 h-40 object-contain rounded transition-transform group-hover:scale-105"
          onLoad={() => setLoading(false)}
          onError={() => {
            if (imgSrc !== fallbackQrUrl) {
              setImgSrc(fallbackQrUrl)
            } else {
              setLoading(false)
            }
          }}
        />
      </div>

      <div className="mt-2.5 text-[11px] text-slate-400 max-w-[220px]">
        Scan with your phone camera
      </div>

      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 underline font-medium"
      >
        <span className="max-w-[200px] truncate">{targetUrl}</span>
        <ExternalLink size={12} />
      </a>
    </div>
  )
}

// 5. INTERACTIVE CONTACT CARD
export function InteractiveContactCard() {
  return (
    <div className="my-3 rounded-2xl border border-red-500/30 bg-black/80 p-5 font-mono">
      <div className="mb-3 text-xs font-bold uppercase tracking-widest text-red-400">
        Connect with Arun Roshan
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href="https://github.com/roshzxn1003"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-white transition-all"
        >
          <span className="flex items-center gap-2">
            <GitBranch size={15} className="text-red-400" />
            <span>GitHub Profile</span>
          </span>
          <ArrowUpRight size={14} className="text-slate-400" />
        </a>

        <a
          href="https://www.linkedin.com/in/arun-roshan-gj/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-200 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white transition-all"
        >
          <span className="flex items-center gap-2">
            <Globe2 size={15} className="text-blue-400" />
            <span>LinkedIn Profile</span>
          </span>
          <ArrowUpRight size={14} className="text-slate-400" />
        </a>

        <a
          href="mailto:arunroshan1003@gmail.com"
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-white transition-all"
        >
          <span className="flex items-center gap-2">
            <Mail size={15} className="text-emerald-400" />
            <span>Email Me</span>
          </span>
          <ArrowUpRight size={14} className="text-slate-400" />
        </a>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs text-slate-200 hover:border-green-500/50 hover:bg-green-500/10 hover:text-white transition-all"
        >
          <span className="flex items-center gap-2">
            <MessageSquare size={15} className="text-green-400" />
            <span>WhatsApp Direct</span>
          </span>
          <ArrowUpRight size={14} className="text-slate-400" />
        </a>
      </div>
    </div>
  )
}

// 6. AI CHAT BOX
export function AiChatBox({ question }) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAi = async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: question }),
        });
        const data = await res.json();
        if (data.success) {
          setResponse(data.text);
        } else {
          setError(true);
          setResponse(data.error || 'Failed to get response.');
        }
      } catch (err) {
        setError(true);
        setResponse('Network error communicating with AI.');
      } finally {
        setLoading(false);
      }
    };
    fetchAi();
  }, [question]);

  return (
    <div className="my-2 rounded-xl border border-blue-500/30 bg-black/80 p-4 font-mono">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-400">🤖 AI Assistant</span>
      </div>
      <div className="text-slate-300 text-sm whitespace-pre-wrap">
        {loading ? (
          <span className="animate-pulse">Typing...</span>
        ) : (
          <span className={error ? 'text-red-400' : ''}>{response}</span>
        )}
      </div>
    </div>
  );
}
