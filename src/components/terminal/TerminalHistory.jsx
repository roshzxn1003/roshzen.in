import { useEffect, useState } from 'react'
import { AiChatBox, FakeHacker, GitHubCard, InteractiveContactCard, LiveClock, LoFiPlayerCard, QrCodeGenerator, Stopwatch } from './InteractiveComponents'
import { TerminalGames } from './TerminalGames'
import { soundFX } from './sound'

const renderCommand = (command) => {
  const [base, ...args] = command.split(' ')

  return (
    <>
      <span className="dt-command-name">{base}</span>
      {args.length > 0 && <span className="dt-command-args"> {args.join(' ')}</span>}
    </>
  )
}

const renderComponent = (compKey) => {
  if (compKey === 'clock') return <LiveClock />
  if (compKey === 'contact') return <InteractiveContactCard />
  if (compKey.startsWith('stopwatch:')) {
    const action = compKey.split(':')[1]
    return <Stopwatch action={action} />
  }
  if (compKey.startsWith('hack:')) {
    const target = compKey.split(':')[1]
    return <FakeHacker target={target} />
  }
  if (compKey.startsWith('qr:')) {
    const firstColon = compKey.indexOf(':')
    const secondColon = compKey.indexOf(':', firstColon + 1)
    const text = compKey.substring(firstColon + 1, secondColon)
    const url = compKey.substring(secondColon + 1)
    return <QrCodeGenerator text={text} url={url} />
  }
  if (compKey.startsWith('game:')) {
    const game = compKey.split(':')[1]
    return <TerminalGames game={game} />
  }
  if (compKey.startsWith('ai:')) {
    const question = compKey.substring(3)
    return <AiChatBox question={question} />
  }
  if (compKey.startsWith('lofi') || compKey.startsWith('music')) {
    const action = compKey.includes(':') ? compKey.split(':')[1] : 'play'
    return <LoFiPlayerCard action={action} />
  }
  if (compKey === 'github') {
    return <GitHubCard />
  }
  return null
}

function TypewriterWelcome({ lines, soundEnabled = true }) {
  const [displayedLines, setDisplayedLines] = useState([''])
  const [currentLineIdx, setCurrentLineIdx] = useState(0)
  const [currentCharIdx, setCurrentCharIdx] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  // Skip typing if user clicks or presses any key
  useEffect(() => {
    if (isFinished) return

    const handleSkip = () => {
      setIsFinished(true)
      setDisplayedLines(lines)
    }

    window.addEventListener('keydown', handleSkip)
    window.addEventListener('mousedown', handleSkip)
    return () => {
      window.removeEventListener('keydown', handleSkip)
      window.removeEventListener('mousedown', handleSkip)
    }
  }, [isFinished, lines])

  // Auto-scroll terminal container while typing
  useEffect(() => {
    if (!isFinished) {
      const container = document.querySelector('.dt-body')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }, [displayedLines, isFinished])

  useEffect(() => {
    if (isFinished) return

    const currentLineTarget = lines[currentLineIdx] || ''

    if (currentCharIdx < currentLineTarget.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev]
          next[currentLineIdx] = currentLineTarget.slice(0, currentCharIdx + 1)
          return next
        })
        setCurrentCharIdx((c) => c + 1)

        // Mechanical typing audio click on non-space characters
        if (soundEnabled && currentLineTarget[currentCharIdx] && currentLineTarget[currentCharIdx] !== ' ') {
          soundFX.playTyping()
        }
      }, 18)

      return () => clearTimeout(timer)
    } else {
      // Current line finished
      if (currentLineIdx + 1 < lines.length) {
        const pauseTimer = setTimeout(() => {
          setCurrentLineIdx((l) => l + 1)
          setCurrentCharIdx(0)
          setDisplayedLines((prev) => [...prev, ''])
        }, 110)

        return () => clearTimeout(pauseTimer)
      } else {
        // All lines finished
        setIsFinished(true)
      }
    }
  }, [currentCharIdx, currentLineIdx, isFinished, lines, soundEnabled])

  const linesToRender = isFinished ? lines : displayedLines

  return (
    <div className="dt-output dt-output-system dt-output-welcome">
      {linesToRender.map((line, idx) => (
        <div className="dt-output-line" key={idx}>
          <span>{line}</span>
          {!isFinished && idx === currentLineIdx && (
            <span className="dt-cursor ml-1" />
          )}
        </div>
      ))}
      {!isFinished && (
        <div className="text-[10px] text-slate-500 mt-1 opacity-60 select-none animate-pulse">
          [Press any key or click to skip]
        </div>
      )}
    </div>
  )
}

function TerminalHistory({ entries, soundEnabled = true }) {
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

        if (entry.type === 'welcome') {
          return (
            <TypewriterWelcome
              key={entry.id}
              lines={entry.lines}
              soundEnabled={soundEnabled}
            />
          )
        }

        if (entry.type === 'component') {
          return (
            <div className="dt-output dt-output-component my-2" key={entry.id}>
              {entry.lines.map((compKey, idx) => (
                <div key={`${entry.id}-${idx}`}>{renderComponent(compKey)}</div>
              ))}
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
