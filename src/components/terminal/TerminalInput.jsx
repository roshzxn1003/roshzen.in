import { useEffect, useRef } from 'react'

const renderInput = (value) => {
  const [base, ...args] = value.split(' ')

  return (
    <>
      <span className="dt-command-name">{base}</span>
      {args.length > 0 && <span className="dt-command-args"> {args.join(' ')}</span>}
    </>
  )
}

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
  onFocus,
  playSound,
  autoCompleteSuggestions = [],
}) {
  const inputRef = useRef(null)

  // Force focus input whenever focused state is true or clicked
  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused, value])

  const handleRowClick = (e) => {
    // Prevent button or link clicks inside history/game from losing focus
    if (onFocus) onFocus()
    inputRef.current?.focus()
  }

  const handleChange = (e) => {
    onChange(e.target.value)
    if (playSound) playSound('typing')
  }

  const handleKeyDown = (event) => {
    const isCtrl = event.ctrlKey || event.metaKey
    const key = event.key.toLowerCase()

    // 1. CTRL + C (SIGINT - Interrupt / Cancel command / Stop process)
    if (isCtrl && key === 'c') {
      event.preventDefault()
      if (onInterrupt) onInterrupt(value)
      return
    }

    // 2. CTRL + L (Clear Screen)
    if (isCtrl && key === 'l') {
      event.preventDefault()
      if (onClearScreen) onClearScreen()
      return
    }

    // 3. CTRL + U (Erase line from cursor to start)
    if (isCtrl && key === 'u') {
      event.preventDefault()
      const inputEl = inputRef.current
      if (inputEl) {
        const selStart = inputEl.selectionStart || 0
        const newValue = value.slice(selStart)
        onChange(newValue)
        setTimeout(() => {
          inputEl.setSelectionRange(0, 0)
        }, 0)
      } else {
        onChange('')
      }
      return
    }

    // 4. CTRL + K (Erase line from cursor to end)
    if (isCtrl && key === 'k') {
      event.preventDefault()
      const inputEl = inputRef.current
      if (inputEl) {
        const selStart = inputEl.selectionStart || 0
        const newValue = value.slice(0, selStart)
        onChange(newValue)
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
        }, 0)
      }
      return
    }

    // 6. CTRL + A (Move cursor to start of line)
    if (isCtrl && key === 'a') {
      event.preventDefault()
      inputRef.current?.setSelectionRange(0, 0)
      return
    }

    // 7. CTRL + E (Move cursor to end of line)
    if (isCtrl && key === 'e') {
      event.preventDefault()
      const len = value.length
      inputRef.current?.setSelectionRange(len, len)
      return
    }

    // 8. CTRL + D (EOF / Delete character)
    if (isCtrl && key === 'd') {
      event.preventDefault()
      if (!value) {
        if (onEof) onEof()
      } else {
        const inputEl = inputRef.current
        if (inputEl) {
          const pos = inputEl.selectionStart || 0
          if (pos < value.length) {
            const newValue = value.slice(0, pos) + value.slice(pos + 1)
            onChange(newValue)
            setTimeout(() => {
              inputEl.setSelectionRange(pos, pos)
            }, 0)
          }
        }
      }
      return
    }

    // 9. CTRL + Z (Suspend process)
    if (isCtrl && key === 'z') {
      event.preventDefault()
      if (onSuspend) onSuspend()
      return
    }

    // 10. CTRL + R (Reverse search history)
    if (isCtrl && key === 'r') {
      event.preventDefault()
      if (onHistoryPrevious) onHistoryPrevious()
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      onHistoryPrevious()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      onHistoryNext()
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      onAutocomplete()
    }
  }

  return (
    <div className="relative">
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
              }}
              className="rounded bg-slate-800 px-2 py-0.5 text-red-300 hover:bg-red-500/20 hover:text-white cursor-pointer"
            >
              {sug}
            </span>
          ))}
        </div>
      )}

      <div className={`dt-input-row${focused ? ' is-focused' : ''}`} onClick={handleRowClick}>
        <span className="dt-prompt">arun@roshzen:~$</span>
        <div className="dt-input-visual" aria-hidden="true">
          <span className="dt-input-value">{value ? renderInput(value) : null}</span>
          <span className="dt-cursor" />
        </div>
        <input
          ref={inputRef}
          className="dt-hidden-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
