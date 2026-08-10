import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bell, Minimize2, Volume2, VolumeX } from 'lucide-react'
import {
  executeCommand,
  getCommandSuggestions,
  getDynamicSuggestions,
  getWelcomeEntry,
} from './command'
import { soundFX } from './sound'
import TerminalHistory from './TerminalHistory'
import TerminalInput from './TerminalInput'
import { terminalThemes } from './theme'
import './terminal.css'

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const createOutputEntry = (output) => ({
  id: createId(),
  kind: 'output',
  type: output.type,
  lines: output.lines,
})

const createCommandEntry = (command) => ({
  id: createId(),
  kind: 'command',
  command,
})

function MatrixRain({ active }) {
  const columns = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        delay: `${(index % 9) * 0.24}s`,
        duration: `${2.5 + (index % 7) * 0.22}s`,
        text: Array.from({ length: 16 }, () => (Math.random() > 0.5 ? '1' : '0')).join(''),
      })),
    [],
  )

  if (!active) return null

  return (
    <div className="dt-matrix" aria-hidden="true">
      {columns.map((column) => (
        <span
          key={column.id}
          style={{
            left: `${(column.id / columns.length) * 100}%`,
            animationDelay: column.delay,
            animationDuration: column.duration,
          }}
        >
          {column.text}
        </span>
      ))}
    </div>
  )
}

function BootSequence({ onComplete }) {
  const [bootLog, setBootLog] = useState([])

  const bootSteps = [
    'RoshZen BIOS v4.2.0 (C) 2026 RoshZen Corp.',
    'Memory Test: 32768MB OK',
    'Detecting Hardware: CPU Cores: 8, GPU: WebGL Accelerated',
    'Loading Kernel Image v6.10.0-custom...',
    'Mounting Virtual File System (VFS)... OK',
    'Starting System Daemon & React 19 Engine...',
    'Initializing RoshZen Hacker Terminal CLI...',
    'SYSTEM READY.',
  ]

  useEffect(() => {
    let index = 0
    soundFX.playBoot()
    const interval = setInterval(() => {
      if (index < bootSteps.length) {
        setBootLog((prev) => [...prev, bootSteps[index]])
        index++
      } else {
        clearInterval(interval)
        setTimeout(onComplete, 600)
      }
    }, 280)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 font-mono text-xs text-green-400 bg-black h-full flex flex-col justify-center">
      {bootLog.map((line, i) => (
        <div key={i} className="my-0.5 tracking-wider animate-fade-in">
          <span className="text-slate-500">[{ (i * 0.12).toFixed(2) }]</span> {line}
        </div>
      ))}
    </div>
  )
}

function Terminal() {
  const [entries, setEntries] = useState(() => [createOutputEntry(getWelcomeEntry())])
  const [input, setInput] = useState('')

  // Command history persistence (Max 100 commands) - Requirement #1
  const [history, setHistory] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('roshzen_term_history')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [historyIndex, setHistoryIndex] = useState(null)

  // Theme persistence - Requirement #19
  const [themeName, setThemeName] = useState(() => {
    if (typeof window === 'undefined') return 'default'
    try {
      return localStorage.getItem('roshzen_term_theme') || 'default'
    } catch {
      return 'default'
    }
  })

  // Sound effects & boot sequence
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isBooting, setIsBooting] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const visited = localStorage.getItem('roshzen_visited')
      if (!visited) {
        localStorage.setItem('roshzen_visited', 'true')
        return true
      }
      return false
    } catch {
      return false
    }
  })

  const [toastMessage, setToastMessage] = useState(null)
  const [matrixActive, setMatrixActive] = useState(false)
  const [focused, setFocused] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const bodyRef = useRef(null)
  const terminalRef = useRef(null)

  const handleSetTheme = (newTheme) => {
    setThemeName(newTheme)
    try {
      localStorage.setItem('roshzen_term_theme', newTheme)
    } catch {
      // Ignore
    }
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    soundFX.playNotification()
    setTimeout(() => setToastMessage(null), 3500)
  }

  const toggleFullscreen = useCallback(() => {
    setFullscreen((prev) => !prev)
  }, [])

  const closeFullscreen = useCallback(() => {
    setFullscreen(false)
  }, [])

  useEffect(() => {
    if (!fullscreen) return
    setFocused(true)
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handler = (e) => {
      if (e.key === 'Escape') closeFullscreen()
    }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      window.removeEventListener('keydown', handler)
    }
  }, [fullscreen, closeFullscreen])

  const theme = terminalThemes[themeName] || terminalThemes.default
  const suggestions = useMemo(() => getCommandSuggestions(), [])

  const lastTabPrefixRef = useRef(null)

  const handleInputChange = (val) => {
    lastTabPrefixRef.current = null
    setInput(val)
  }

  // Auto-complete match options (dynamic for base commands and subcommands)
  const matchingSuggestions = useMemo(() => {
    return getDynamicSuggestions(input)
  }, [input])

  const getLongestCommonPrefix = (strings) => {
    if (!strings || strings.length === 0) return ''
    let prefix = strings[0]
    for (let i = 1; i < strings.length; i++) {
      while (strings[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1)
        if (prefix === '') return ''
      }
    }
    return prefix
  }

  const autocomplete = () => {
    const raw = input.trimStart()
    if (!raw) return

    if (!lastTabPrefixRef.current) {
      lastTabPrefixRef.current = raw
    }

    const searchPrefix = lastTabPrefixRef.current
    const matches = getDynamicSuggestions(searchPrefix)
    if (matches.length === 0) return

    if (matches.length === 1) {
      const completed = matches[0]
      setInput(completed + (completed.includes(' ') ? '' : ' '))
      return
    }

    const lcp = getLongestCommonPrefix(matches)
    const currentTrimmed = input.trim()

    if (lcp && lcp.length > currentTrimmed.length && currentTrimmed.length === searchPrefix.trim().length) {
      setInput(lcp)
    } else {
      const currentIndex = matches.indexOf(currentTrimmed)
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % matches.length
      setInput(matches[nextIndex])
    }
  }

  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [entries, input])

  const clearTerminal = () => {
    setEntries([])
  }

  const playSound = (type) => {
    if (!soundEnabled) return
    if (type === 'typing') soundFX.playTyping()
    if (type === 'enter') soundFX.playEnter()
  }

  const submitCommand = () => {
    const command = input.trim()
    if (!command) return

    setInput('')
    const updatedHistory = [...history, command].slice(-100)
    setHistory(updatedHistory)
    setHistoryIndex(null)

    try {
      localStorage.setItem('roshzen_term_history', JSON.stringify(updatedHistory))
    } catch {
      // Ignore
    }

    const context = {
      clearTerminal,
      setTheme: handleSetTheme,
      themeName,
      setMatrixActive,
      toggleFullscreen,
      fullscreen,
      playSound,
      history: updatedHistory,
      showToast,
      setSoundEnabled,
      triggerBoot: () => setIsBooting(true),
    }

    const output = executeCommand(command, context)

    if (command.toLowerCase() === 'clear') return

    setEntries((previous) => [
      ...previous,
      createCommandEntry(command),
      ...output.map(createOutputEntry),
    ].slice(-120))
  }

  const showPreviousCommand = () => {
    if (history.length === 0) return

    const nextIndex = historyIndex === null ? history.length - 1 : Math.max(historyIndex - 1, 0)
    setHistoryIndex(nextIndex)
    setInput(history[nextIndex])
  }

  const showNextCommand = () => {
    if (history.length === 0 || historyIndex === null) return

    const nextIndex = historyIndex + 1
    if (nextIndex >= history.length) {
      setHistoryIndex(null)
      setInput('')
      return
    }

    setHistoryIndex(nextIndex)
    setInput(history[nextIndex])
  }

  const terminalStyle = {
    '--dt-accent': theme.accent,
    '--dt-accent-soft': theme.accentSoft,
    '--dt-accent-glow': theme.accentGlow,
    '--dt-bg': theme.background,
    '--dt-bg-solid': theme.backgroundSolid,
    '--dt-header': theme.header,
    '--dt-text': theme.text,
    '--dt-muted': theme.muted,
    '--dt-prompt': theme.prompt,
    '--dt-output': theme.output,
    '--dt-success': theme.success,
    '--dt-warning': theme.warning,
    '--dt-error': theme.error,
  }

  const terminalContent = (
    <section
      ref={terminalRef}
      className={`developer-terminal theme-${themeName}${fullscreen ? ' is-fullscreen' : ''}`}
      style={terminalStyle}
      onClick={() => setFocused(true)}
      aria-label="Interactive developer terminal"
    >
      <MatrixRain active={matrixActive} />

      {/* Terminal Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 right-6 z-[999] flex items-center gap-2 rounded-xl border border-red-500/40 bg-black/90 px-4 py-2 text-xs font-mono text-white shadow-2xl animate-slide-down">
          <Bell className="w-4 h-4 text-red-400 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Terminal Header Bar */}
      <div className="dt-header flex items-center justify-between px-4 py-2.5">
        <div className="dt-window-controls flex items-center gap-2">
          <span className="dt-control dt-close cursor-pointer" title="Close" />
          <span
            className="dt-control dt-minimize dt-minimize-btn cursor-pointer"
            onClick={(e) => { e.stopPropagation(); closeFullscreen() }}
            role="button"
            tabIndex={0}
            aria-label="Minimize"
            title="Minimize"
          />
          <span
            className="dt-control dt-maximize dt-maximize-btn cursor-pointer"
            onClick={(e) => { e.stopPropagation(); toggleFullscreen() }}
            role="button"
            tabIndex={0}
            aria-label="Maximize"
            title="Maximize Fullscreen"
          />
        </div>

        <div className="dt-title flex items-center gap-2 font-mono text-xs text-slate-300">
          <span>arun@roshzen: ~</span>
          <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] uppercase font-bold text-red-400 border border-red-500/30">
            {themeName}
          </span>
        </div>

        <div className="dt-activity flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 size={15} className="text-red-400" /> : <VolumeX size={15} />}
          </button>

          {fullscreen ? (
            <button className="dt-exit-fullscreen flex items-center gap-1 text-xs text-slate-300 hover:text-white" onClick={closeFullscreen} aria-label="Exit fullscreen">
              <Minimize2 size={14} />
              <span>Exit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400">
              <span className="dt-pulse bg-emerald-500 w-2 h-2 rounded-full animate-ping" />
              ONLINE
            </div>
          )}
        </div>
      </div>

      {/* Terminal Body Container */}
      <div className="dt-body" ref={bodyRef}>
        {isBooting ? (
          <BootSequence onComplete={() => setIsBooting(false)} />
        ) : (
          <>
            <TerminalHistory entries={entries} />
            <TerminalInput
              value={input}
              onChange={handleInputChange}
              onSubmit={submitCommand}
              onHistoryPrevious={showPreviousCommand}
              onHistoryNext={showNextCommand}
              onAutocomplete={autocomplete}
              focused={focused}
              onFocus={() => setFocused(true)}
              playSound={playSound}
              autoCompleteSuggestions={matchingSuggestions}
            />
          </>
        )}
      </div>
    </section>
  )

  if (fullscreen) {
    return (
      <>
        <div className="developer-terminal-placeholder" aria-hidden="true">
          <div className="dt-placeholder-content">
            <span className="dt-pulse" />
            <span>Terminal is in Full Screen mode</span>
            <button
              type="button"
              className="dt-placeholder-restore"
              onClick={closeFullscreen}
            >
              Restore window
            </button>
          </div>
        </div>
        {createPortal(
          <div className="dt-fullscreen-root">{terminalContent}</div>,
          document.body,
        )}
      </>
    )
  }

  return terminalContent
}

export default Terminal
