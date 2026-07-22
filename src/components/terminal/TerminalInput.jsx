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
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (focused) inputRef.current?.focus()
  }, [focused])

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
    <div className={`dt-input-row${focused ? ' is-focused' : ''}`} onClick={onFocus}>
      <span className="dt-prompt">arun@roshzen:~$</span>
      <div className="dt-input-visual" aria-hidden="true">
        <span className="dt-input-value">{value ? renderInput(value) : null}</span>
        <span className="dt-cursor" />
      </div>
      <input
        ref={inputRef}
        className="dt-hidden-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label="Terminal command input"
      />
    </div>
  )
}

export default TerminalInput
