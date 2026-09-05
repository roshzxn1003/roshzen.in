import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

const QUICK_ACTIONS = [
  { cmd: 'projects', label: 'Projects', icon: '⚡' },
  { cmd: 'skills', label: 'Skills', icon: '🧠' },
  { cmd: 'ask', label: 'Ask AI', icon: '🤖' },
  { cmd: 'github', label: 'GitHub', icon: '🐙' },
  { cmd: 'music', label: 'Lo-Fi Beats', icon: '🎵' },
  { cmd: 'neofetch', label: 'SysInfo', icon: '💻' },
  { cmd: 'games', label: 'Games', icon: '🎮' },
  { cmd: 'crt', label: 'CRT', icon: '📺' },
  { cmd: 'theme random', label: 'Theme', icon: '🎨' },
  { cmd: 'contact', label: 'Contact', icon: '☕' },
]

// Toggle flag: Deactivated per user request (preserved for instant reactivation)
const ENABLE_QUICK_ACTIONS = false

function TerminalInput({
  value,
  onChange,
  onSubmit,
  onHistoryPrevious,
  onHistoryNext,
  onAutocomplete,
  onInterrupt,
  onClearScreen,
  onEof,
  onSuspend,
  focused,
  focusTick = 0,
  onFocus,
  playSound,
  autoCompleteSuggestions = [],
}) {
  const inputRef = useRef(null)
  const [cursorPos, setCursorPos] = useState(value.length)

  const syncCursorPos = () => {
    setTimeout(() => {
      if (inputRef.current) {
        setCursorPos(inputRef.current.selectionStart ?? value.length)
      }
    }, 0)
  }

  // Force focus input whenever focused or focusTick triggers
  useEffect(() => {
    if (focused || focusTick > 0) {
      inputRef.current?.focus()
      syncCursorPos()
    }
  }, [focused, focusTick])

  useEffect(() => {
    syncCursorPos()
  }, [value])

  const handleRowClick = () => {
    if (onFocus) onFocus()
    inputRef.current?.focus()
    syncCursorPos()
  }

  const handleChange = (e) => {
    onChange(e.target.value)
    if (playSound) playSound('typing')
    syncCursorPos()
  }

  const handleSelect = () => {
    syncCursorPos()
  }

  const handleKeyDown = (event) => {
    const isCtrl = event.ctrlKey || event.metaKey
    const key = event.key.toLowerCase()

    // 1. CTRL + C (SIGINT - Interrupt)
    if (isCtrl && key === 'c') {
      event.preventDefault()
      if (onInterrupt) onInterrupt(value)
      syncCursorPos()
      return
    }

    // 2. CTRL + L (Clear Screen)
    if (isCtrl && key === 'l') {
      event.preventDefault()
      if (onClearScreen) onClearScreen()
      syncCursorPos()
      return
    }

    // 3. CTRL + U (Erase line before cursor)
    if (isCtrl && key === 'u') {
      event.preventDefault()
      const inputEl = inputRef.current
      if (inputEl) {
        const selStart = inputEl.selectionStart || 0
        const newValue = value.slice(selStart)
        onChange(newValue)
        setTimeout(() => {
          inputEl.setSelectionRange(0, 0)
          syncCursorPos()
        }, 0)
      } else {
        onChange('')
      }
      return
    }

    // 4. CTRL + K (Erase line after cursor)
    if (isCtrl && key === 'k') {
      event.preventDefault()
      const inputEl = inputRef.current
      if (inputEl) {
        const selStart = inputEl.selectionStart || 0
        const newValue = value.slice(0, selStart)
        onChange(newValue)
        syncCursorPos()
      } else {
        onChange('')
      }
      return
    }

    // 5. CTRL + W (Erase word before cursor)
    if (isCtrl && key === 'w') {
      event.preventDefault()
      const inputEl = inputRef.current
      if (inputEl) {
        const pos = inputEl.selectionStart || 0
        const before = value.slice(0, pos)
        const after = value.slice(pos)
        const trimmedBefore = before.replace(/\s+$/, '')
        const lastSpace = trimmedBefore.lastIndexOf(' ')
        const newBefore = lastSpace === -1 ? '' : trimmedBefore.slice(0, lastSpace + 1)
        const newValue = newBefore + after
        onChange(newValue)
        setTimeout(() => {
          inputEl.setSelectionRange(newBefore.length, newBefore.length)
          syncCursorPos()
        }, 0)
      }
      return
    }

    // 6. CTRL + A (Move cursor to start of line)
    if (isCtrl && key === 'a') {
      event.preventDefault()
      inputRef.current?.setSelectionRange(0, 0)
      syncCursorPos()
      return
    }

    // 7. CTRL + E (Move cursor to end of line)
    if (isCtrl && key === 'e') {
      event.preventDefault()
      const len = value.length
      inputRef.current?.setSelectionRange(len, len)
      syncCursorPos()
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
      setCursorPos(0)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      onHistoryPrevious()
      syncCursorPos()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      onHistoryNext()
      syncCursorPos()
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      onAutocomplete()
      syncCursorPos()
      return
    }

    if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Backspace', 'Delete'].includes(event.key)) {
      syncCursorPos()
    }
  }

  // Render text with dynamic block blinker positioned at exact cursorPos
  const renderVisualContent = () => {
    const pos = Math.min(Math.max(0, cursorPos), value.length)
    const before = value.slice(0, pos)
    const charAtCursor = value[pos]
    const after = value.slice(pos + 1)

    return (
      <span className="dt-input-value flex items-center">
        <span>{before}</span>
        <span className={`dt-cursor ${focused ? 'is-focused' : ''}`}>
          {charAtCursor === ' ' ? '\u00A0' : charAtCursor || '\u00A0'}
        </span>
        <span>{after}</span>
      </span>
    )
  }

  return (
    <div className="relative w-full">
      {/* Autocomplete Suggestions Popup when typing */}
      {autoCompleteSuggestions.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-1.5 rounded-lg border border-red-500/20 bg-black/90 p-2 text-xs font-mono text-slate-300 select-none">
          <span className="text-[10px] font-bold text-red-400">TAB Suggestions:</span>
          {autoCompleteSuggestions.map((sug) => (
            <span
              key={sug}
              onClick={(e) => {
                e.stopPropagation()
                onChange(sug)
                inputRef.current?.focus()
                syncCursorPos()
              }}
              className="rounded bg-slate-800 px-2 py-0.5 text-red-300 hover:bg-red-500/20 hover:text-white cursor-pointer"
            >
              {sug}
            </span>
          ))}
        </div>
      )}

      {/* Quick Action Pills Dock (Deactivated per user request; set ENABLE_QUICK_ACTIONS = true to restore) */}
      {ENABLE_QUICK_ACTIONS && !value && (
        <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 select-none scrollbar-none opacity-85 hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles size={11} className="text-amber-400" />
            <span>Quick:</span>
          </span>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.cmd}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (playSound) playSound('enter')
                onSubmit(action.cmd)
                inputRef.current?.focus()
              }}
              className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className={`dt-input-row${focused ? ' is-focused' : ''}`} onClick={handleRowClick}>
        <span className="dt-prompt">arun@roshzen:~$</span>
        <div className="dt-input-visual" aria-hidden="true">
          {renderVisualContent()}
        </div>
        <input
          ref={inputRef}
          className="dt-hidden-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          onKeyUp={syncCursorPos}
          onFocus={onFocus}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Terminal command input"
        />
      </div>
    </div>
  )
}

export default TerminalInput
