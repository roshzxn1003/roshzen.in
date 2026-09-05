import { useEffect, useState } from 'react'
import { ArrowUpRight, ExternalLink, GitBranch, Globe2, Mail, MessageSquare, Music, Pause, Play, QrCode, Radio, Send, Sparkles } from 'lucide-react'
import { soundFX } from './sound'
import { generateKnowledgeResponse } from '../../utils/aiKnowledgeEngine.js'

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

// 6. AI CHAT BOX (Interactive Co-Pilot)
export function AiChatBox({ question }) {
  const isPickerOnly = !question || question === 'prompt_picker'
  const [currentQuery, setCurrentQuery] = useState(isPickerOnly ? '' : question)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(!isPickerOnly)
  const [provider, setProvider] = useState('Gemini 2.0')
  const [customInput, setCustomInput] = useState('')

  const SUGGESTED_CHIPS = [
    '🚀 What are Arun\'s top projects?',
    '⚡ What is his tech stack & experience?',
    '💼 Is Arun open to full-time or freelance hire?',
    '🧠 Tell me about his Love Vault & Zenith apps',
  ]

  const askAi = async (msg) => {
    if (!msg || !msg.trim()) return
    const cleaned = msg.trim()
    setCurrentQuery(cleaned)
    setLoading(true)
    soundFX.key?.()

    let answered = false
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const isLocalhostApi = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')
    const isRemoteClient = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'

    // If client is in production (e.g. roshzen.in) and apiUrl is localhost, don't stall waiting for dead localhost
    if (!isRemoteClient || !isLocalhostApi) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3500)

        const res = await fetch(`${apiUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: cleaned }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (res.ok) {
          const data = await res.json()
          if (data.success && data.text) {
            setResponse(data.text)
            setProvider('Gemini 2.0 Flash')
            answered = true
          }
        }
      } catch {
        // Backend offline or timeout — smoothly fall through to Knowledge Engine
      }
    }

    if (!answered) {
      // Instant intelligent portfolio engine response
      const fallbackResponse = generateKnowledgeResponse(cleaned)
      setResponse(fallbackResponse)
      setProvider('Portfolio Intelligence')
    }

    setLoading(false)
    soundFX.enter?.()
  }

  useEffect(() => {
    if (question && question !== 'prompt_picker') {
      askAi(question)
    }
  }, [question])

  const handleSubmitCustom = (e) => {
    e.preventDefault()
    if (customInput.trim()) {
      askAi(customInput.trim())
      setCustomInput('')
    }
  }

  return (
    <div className="my-2 rounded-xl border border-blue-500/30 bg-black/85 p-4 font-mono shadow-[0_0_25px_rgba(59,130,246,0.12)]">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-base">🤖</span>
          <div>
            <div className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
              <span>RoshZen AI Co-Pilot</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-normal border border-blue-500/30">
                {provider}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Ask anything about Arun's engineering skills, projects & background</div>
          </div>
        </div>
      </div>

      {currentQuery && (
        <div className="mb-3 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200">
          <span className="text-slate-400 font-bold mr-1.5">Prompt:</span>
          <span>{currentQuery}</span>
        </div>
      )}

      <div className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap min-h-[48px]">
        {loading ? (
          <div className="flex items-center gap-2 text-blue-400 py-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="animate-pulse">Thinking & generating response...</span>
          </div>
        ) : response ? (
          <div className="py-1 leading-relaxed text-slate-100">{response}</div>
        ) : (
          <div className="text-slate-400 py-1 italic">
            Select a quick prompt below or type your question:
          </div>
        )}
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles size={11} className="text-amber-400" />
          <span>Quick Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => askAi(chip)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-pointer text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Inline Follow-up Input */}
      <form onSubmit={handleSubmitCustom} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Ask a question or follow-up..."
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!customInput.trim() || loading}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>Ask</span>
          <Send size={12} />
        </button>
      </form>
    </div>
  )
}

// 7. LO-FI AMBIENT CODING SYNTHESIZER
export function LoFiPlayerCard({ action = 'play' }) {
  const [isPlaying, setIsPlaying] = useState(soundFX.isLoFiPlaying)
  const [bars, setBars] = useState([45, 80, 25, 90, 60, 75, 35, 95, 50, 85, 40, 70])

  useEffect(() => {
    if (action === 'play' || action === 'start') {
      const ok = soundFX.startLoFi()
      setIsPlaying(ok)
    } else if (action === 'stop' || action === 'pause') {
      soundFX.stopLoFi()
      setIsPlaying(false)
    }
  }, [action])

  useEffect(() => {
    let timer = null
    if (isPlaying) {
      timer = setInterval(() => {
        setBars(Array.from({ length: 14 }, () => Math.floor(Math.random() * 80) + 15))
      }, 120)
    } else {
      setBars(Array.from({ length: 14 }, () => 10))
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  const handleToggle = () => {
    soundFX.unlockAudio()
    const next = soundFX.toggleLoFi()
    setIsPlaying(next)
  }

  return (
    <div className="my-2 rounded-xl border border-purple-500/30 bg-black/85 p-4 font-mono shadow-[0_0_25px_rgba(168,85,247,0.15)]">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Radio size={18} className={isPlaying ? 'animate-pulse' : ''} />
          </div>
          <div>
            <div className="text-white font-bold text-xs flex items-center gap-2">
              <span>Lo-Fi Coding Radio</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${isPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {isPlaying ? 'Live Streaming' : 'Paused'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              🎵 "Midnight Cyber Code" — 72 BPM Chill Cyberpunk Synthesizer
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isPlaying
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500 hover:bg-purple-600/40'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause size={13} />
              <span>Pause Beats</span>
            </>
          ) : (
            <>
              <Play size={13} />
              <span>Play Lo-Fi</span>
            </>
          )}
        </button>
      </div>

      {/* Animated Soundwave Equalizer */}
      <div className="my-3 py-2 px-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-end justify-between h-12 gap-1.5">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t transition-all duration-100 ${
              isPlaying
                ? 'bg-gradient-to-t from-purple-600 via-pink-500 to-indigo-400 shadow-[0_0_6px_rgba(168,85,247,0.4)]'
                : 'bg-slate-800'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Generative Web Audio Synthesizer (0 KB download)</span>
        <span>Use: <code className="text-purple-300 font-bold">music play</code> / <code className="text-purple-300 font-bold">music stop</code></span>
      </div>
    </div>
  )
}

// 8. GITHUB DEVELOPER CARD
export function GitHubCard() {
  return (
    <div className="my-2 rounded-xl border border-slate-700/80 bg-black/85 p-4 font-mono shadow-[0_0_20px_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-md text-sm">
            AR
          </div>
          <div>
            <div className="text-white font-bold text-sm flex items-center gap-2">
              <span>Arun Roshan</span>
              <span className="text-xs text-slate-400 font-normal">@roshzxn1003</span>
            </div>
            <div className="text-xs text-slate-400">Full-Stack Engineer & Mobile App Developer</div>
          </div>
        </div>

        <a
          href="https://github.com/roshzxn1003"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors"
        >
          <span>Open Profile</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px] uppercase">Core Tech</div>
          <div className="text-white font-bold mt-0.5">React / Tailwind</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px] uppercase">Mobile</div>
          <div className="text-white font-bold mt-0.5">Flutter & Dart</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px] uppercase">Backend / DB</div>
          <div className="text-white font-bold mt-0.5">Node / Supabase</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-slate-400 text-[10px] uppercase">Availability</div>
          <div className="text-emerald-400 font-bold mt-0.5">Open for Hire</div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Featured projects: <a href="https://github.com/roshzxn1003/roshzen.in" target="_blank" rel="noreferrer" className="text-slate-300 underline hover:text-white">roshzen.in</a>, <code className="text-slate-300">finance-app</code>, <code className="text-slate-300">ai-agents</code></span>
      </div>
    </div>
  )
}
