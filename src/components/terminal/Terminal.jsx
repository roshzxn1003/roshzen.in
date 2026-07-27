import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Minimize2 } from 'lucide-react'
import {
  executeCommand,
  getCommandSuggestions,
  getWelcomeEntry,
} from './command'
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

function Terminal() {
  const [entries, setEntries] = useState(() => [createOutputEntry(getWelcomeEntry())])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(null)
  const [themeName, setThemeName] = useState('default')
  const [matrixActive, setMatrixActive] = useState(false)
  const [focused, setFocused] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const bodyRef = useRef(null)
  const terminalRef = useRef(null)

  const toggleFullscreen = useCallback(() => {
    setFullscreen((prev) => !prev)
  }, [])

  const closeFullscreen = useCallback(() => {
    setFullscreen(false)
  }, [])

  useEffect(() => {
    if (!fullscreen) return
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

  const theme = terminalThemes[themeName]
  const suggestions = useMemo(() => getCommandSuggestions(), [])

  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [entries, input])

  const clearTerminal = () => {
    setEntries([])
  }

  const submitCommand = () => {
    const command = input.trim()
    if (!command) return

    setInput('')
    setHistory((previous) => [...previous, command])
    setHistoryIndex(null)

    const context = {
      clearTerminal,
      setTheme: setThemeName,
      setMatrixActive,
      toggleFullscreen,
      fullscreen,
    }

    const output = executeCommand(command, context)

    if (command.toLowerCase() === 'clear') return

    setEntries((previous) => [
      ...previous,
      createCommandEntry(command),
      ...output.map(createOutputEntry),
    ])
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

  const autocomplete = () => {
    const typed = input.trim().toLowerCase()
    if (!typed) return

    const match = suggestions.find((command) => command.startsWith(typed))
    if (match) setInput(match)
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
      <div className="dt-header">
        <div className="dt-window-controls">
          <span className="dt-control dt-close" title="Close" />
          <span
            className="dt-control dt-minimize dt-minimize-btn"
            onClick={(e) => { e.stopPropagation(); closeFullscreen() }}
            role="button"
            tabIndex={0}
            aria-label="Minimize"
            title="Minimize"
          />
          <span
            className="dt-control dt-maximize dt-maximize-btn"
            onClick={(e) => { e.stopPropagation(); toggleFullscreen() }}
            role="button"
            tabIndex={0}
            aria-label="Maximize"
            title="Maximize Fullscreen"
          />
        </div>
        <div className="dt-title">
          <span>arun@roshzen</span>
          <strong>{themeName}</strong>
        </div>
        <div className="dt-activity">
          {fullscreen ? (
            <button className="dt-exit-fullscreen" onClick={closeFullscreen} aria-label="Exit fullscreen">
              <Minimize2 size={14} />
              <span>Exit</span>
            </button>
          ) : (
            <>
              <span className="dt-pulse" />
              ACTIVE
            </>
          )}
        </div>
      </div>

      <div className="dt-body" ref={bodyRef}>
        <TerminalHistory entries={entries} />
        <TerminalInput
          value={input}
          onChange={setInput}
          onSubmit={submitCommand}
          onHistoryPrevious={showPreviousCommand}
          onHistoryNext={showNextCommand}
          onAutocomplete={autocomplete}
          focused={focused}
          onFocus={() => setFocused(true)}
        />
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
