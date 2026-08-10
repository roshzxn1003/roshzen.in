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
