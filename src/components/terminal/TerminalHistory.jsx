const renderCommand = (command) => {
  const [base, ...args] = command.split(' ')

  return (
    <>
      <span className="dt-command-name">{base}</span>
      {args.length > 0 && <span className="dt-command-args"> {args.join(' ')}</span>}
    </>
  )
}

function TerminalHistory({ entries }) {
  return (
    <div className="dt-history" aria-live="polite">
      {entries.map((entry) => {
        if (entry.kind === 'command') {
          return (
            <div className="dt-row dt-row-command" key={entry.id}>
              <span className="dt-prompt">arun@roshzen:~$</span>
              <span className="dt-command">{renderCommand(entry.command)}</span>
            </div>
          )
        }

        return (
          <div className={`dt-output dt-output-${entry.type}`} key={entry.id}>
            {entry.lines.map((line, index) => (
              <div className="dt-output-line" key={`${entry.id}-${index}`}>
                {line}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default TerminalHistory
