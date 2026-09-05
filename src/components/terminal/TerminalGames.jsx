import { useEffect, useState } from 'react'

// 1. TIC TAC TOE GAME
export function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [winner, setWinner] = useState(null)
  const [score, setScore] = useState({ player: 0, ai: 0 })

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return squares.includes(null) ? null : 'Draw'
  }

  const handleClick = (e, i) => {
    e.stopPropagation()
    if (board[i] || winner) return

    const nextBoard = [...board]
    nextBoard[i] = 'X'

    const winX = checkWinner(nextBoard)
    if (winX) {
      setBoard(nextBoard)
      setWinner(winX)
      if (winX === 'X') setScore((s) => ({ ...s, player: s.player + 1 }))
      return
    }

    const emptyIndices = nextBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null)

    if (emptyIndices.length > 0) {
      const aiMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
      const boardWithO = [...nextBoard]
      boardWithO[aiMove] = 'O'
      setBoard(boardWithO)
      const winO = checkWinner(boardWithO)
      if (winO) {
        setWinner(winO)
        if (winO === 'O') setScore((s) => ({ ...s, ai: s.ai + 1 }))
      }
    } else {
      setBoard(nextBoard)
      setWinner('Draw')
    }
  }

  const resetGame = (e) => {
    if (e) e.stopPropagation()
    setBoard(Array(9).fill(null))
    setWinner(null)
  }

  return (
    <div className="my-3 inline-block rounded-2xl border border-cyan-500/40 bg-black/95 p-4 font-mono shadow-2xl">
      <div className="flex items-center justify-between gap-4 text-xs font-bold text-cyan-400 mb-3">
        <span>🎮 TIC TAC TOE</span>
        <span className="text-slate-300 text-[11px]">
          Player (X): <strong className="text-cyan-400">{score.player}</strong> | AI (O): <strong className="text-red-400">{score.ai}</strong>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 w-44 h-44 mx-auto">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={(e) => handleClick(e, idx)}
            className={`flex items-center justify-center border text-xl font-black rounded-xl transition-all cursor-pointer select-none ${
              cell === 'X'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                : cell === 'O'
                ? 'bg-red-950/80 border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-500 hover:border-cyan-400/60 hover:bg-slate-800'
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="mt-3 text-center text-xs font-bold">
          {winner === 'Draw' ? (
            <span className="text-amber-400">🤝 Game Draw!</span>
          ) : winner === 'X' ? (
            <span className="text-emerald-400">🎉 You Won!</span>
          ) : (
            <span className="text-red-400">💀 AI Won!</span>
          )}
        </div>
      )}

      <div className="mt-3 flex justify-center">
        <button
          onClick={resetGame}
          className="text-xs bg-cyan-500/20 text-cyan-300 px-4 py-1.5 rounded-lg border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer font-bold"
        >
          {winner ? 'Play Again' : 'Reset Grid'}
        </button>
      </div>
    </div>
  )
}

// 2. SNAKE GAME WITH TOUCH/KEYBOARD CONTROLS
export function SnakeGame() {
  const [snake, setSnake] = useState([[2, 2], [2, 1]])
  const [food, setFood] = useState([5, 5])
  const [dir, setDir] = useState([0, 1])
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (gameOver) return
    const handleKey = (e) => {
      if (e.key === 'ArrowUp' && dir[0] !== 1) setDir([-1, 0])
      if (e.key === 'ArrowDown' && dir[0] !== -1) setDir([1, 0])
      if (e.key === 'ArrowLeft' && dir[1] !== 1) setDir([0, -1])
      if (e.key === 'ArrowRight' && dir[1] !== -1) setDir([0, 1])
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [dir, gameOver])

  useEffect(() => {
    if (gameOver) return
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = [prevSnake[0][0] + dir[0], prevSnake[0][1] + dir[1]]
        if (head[0] < 0 || head[0] >= 10 || head[1] < 0 || head[1] >= 10) {
          setGameOver(true)
          return prevSnake
        }
        if (prevSnake.some(([r, c]) => r === head[0] && c === head[1])) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((s) => s + 10)
          setFood([Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)])
        } else {
          newSnake.pop()
        }
        return newSnake
      })
    }, 220)
    return () => clearInterval(interval)
  }, [dir, food, gameOver])

  const changeDir = (e, d) => {
    e.stopPropagation()
    if (d[0] !== -dir[0] && d[1] !== -dir[1]) setDir(d)
  }

  const restart = (e) => {
    if (e) e.stopPropagation()
    setSnake([[2, 2], [2, 1]])
    setDir([0, 1])
    setScore(0)
    setGameOver(false)
  }

  return (
    <div className="my-3 inline-block rounded-2xl border border-emerald-500/40 bg-black/95 p-4 font-mono shadow-2xl">
      <div className="flex justify-between items-center text-xs font-bold text-emerald-400 mb-2">
        <span>🐍 SNAKE GAME</span>
        <span>Score: {score}</span>
      </div>

      <div className="grid grid-cols-10 gap-0.5 w-44 h-44 bg-slate-950 p-1 border border-slate-800 rounded-xl mx-auto">
        {Array.from({ length: 100 }).map((_, idx) => {
          const r = Math.floor(idx / 10)
          const c = idx % 10
          const isSnake = snake.some(([sr, sc]) => sr === r && sc === c)
          const isFood = food[0] === r && food[1] === c
          return (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-xs ${
                isSnake ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : isFood ? 'bg-red-500 animate-pulse rounded-full' : 'bg-slate-900/40'
              }`}
            />
          )
        })}
      </div>

      {/* Direction Buttons */}
      <div className="mt-3 flex flex-col items-center gap-1">
        <button onClick={(e) => changeDir(e, [-1, 0])} className="px-3 py-1 bg-slate-800 text-xs rounded hover:bg-emerald-500/20 text-emerald-300 border border-slate-700">▲</button>
        <div className="flex gap-2">
          <button onClick={(e) => changeDir(e, [0, -1])} className="px-3 py-1 bg-slate-800 text-xs rounded hover:bg-emerald-500/20 text-emerald-300 border border-slate-700">◀</button>
          <button onClick={(e) => changeDir(e, [1, 0])} className="px-3 py-1 bg-slate-800 text-xs rounded hover:bg-emerald-500/20 text-emerald-300 border border-slate-700">▼</button>
          <button onClick={(e) => changeDir(e, [0, 1])} className="px-3 py-1 bg-slate-800 text-xs rounded hover:bg-emerald-500/20 text-emerald-300 border border-slate-700">▶</button>
        </div>
      </div>

      {gameOver && <div className="mt-2 text-center text-xs text-red-400 font-bold">💀 Game Over! Final Score: {score}</div>}
      <div className="mt-2 flex justify-center">
        <button onClick={restart} className="text-xs bg-emerald-500/20 text-emerald-300 px-4 py-1 rounded-md border border-emerald-500/40 cursor-pointer font-bold">
          {gameOver ? 'Try Again' : 'Reset'}
        </button>
      </div>
    </div>
  )
}

// 3. RETRO PONG GAME
export function PongGame() {
  const [playerY, setPlayerY] = useState(40)
  const [aiY, setAiY] = useState(40)
  const [ball, setBall] = useState({ x: 50, y: 50, dx: 3, dy: 2 })
  const [score, setScore] = useState({ player: 0, ai: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setBall((prev) => {
        let { x, y, dx, dy } = prev
        let newX = x + dx
        let newY = y + dy

        if (newY <= 5 || newY >= 95) dy = -dy

        // Player paddle collision
        if (newX <= 10 && newY >= playerY && newY <= playerY + 25) {
          dx = Math.abs(dx) + 0.2
        }
        // AI paddle collision
        if (newX >= 90 && newY >= aiY && newY <= aiY + 25) {
          dx = -Math.abs(dx) - 0.2
        }

        // Score check
        if (newX <= 0) {
          setScore((s) => ({ ...s, ai: s.ai + 1 }))
          return { x: 50, y: 50, dx: 3, dy: (Math.random() > 0.5 ? 2 : -2) }
        }
        if (newX >= 100) {
          setScore((s) => ({ ...s, player: s.player + 1 }))
          return { x: 50, y: 50, dx: -3, dy: (Math.random() > 0.5 ? 2 : -2) }
        }

        // AI movement
        setAiY((prevAi) => Math.max(0, Math.min(75, prevAi + (newY - prevAi - 12) * 0.15)))

        return { x: newX, y: newY, dx, dy }
      })
    }, 45)

    return () => clearInterval(interval)
  }, [playerY, aiY])

  const movePlayer = (e, delta) => {
    e.stopPropagation()
    setPlayerY((prev) => Math.max(0, Math.min(75, prev + delta)))
  }

  return (
    <div className="my-3 inline-block rounded-2xl border border-indigo-500/40 bg-black/95 p-4 font-mono shadow-2xl">
      <div className="flex justify-between items-center text-xs font-bold text-indigo-400 mb-2">
        <span>🏓 PONG (You: {score.player} | CPU: {score.ai})</span>
      </div>

      <div className="relative w-56 h-36 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mx-auto">
        <div className="absolute left-1/2 top-0 bottom-0 border-r border-dashed border-slate-800" />
        {/* Player Paddle */}
        <div className="absolute left-1.5 w-2 bg-indigo-400 rounded-sm shadow-[0_0_8px_#818cf8]" style={{ top: `${playerY}%`, height: '25%' }} />
        {/* AI Paddle */}
        <div className="absolute right-1.5 w-2 bg-rose-500 rounded-sm shadow-[0_0_8px_#f43f5e]" style={{ top: `${aiY}%`, height: '25%' }} />
        {/* Ball */}
        <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#ffffff]" style={{ left: `${ball.x}%`, top: `${ball.y}%` }} />
      </div>

      <div className="mt-3 flex justify-center gap-3">
        <button onClick={(e) => movePlayer(e, -15)} className="px-4 py-1 bg-slate-800 text-xs rounded hover:bg-indigo-500/20 text-indigo-300 border border-slate-700 font-bold">▲ Move Up</button>
        <button onClick={(e) => movePlayer(e, 15)} className="px-4 py-1 bg-slate-800 text-xs rounded hover:bg-indigo-500/20 text-indigo-300 border border-slate-700 font-bold">▼ Move Down</button>
      </div>
    </div>
  )
}

// 4. MEMORY CARD MATCHING GAME
export function MemoryGame() {
  const icons = ['⚛️', '🐍', '🚀', '💻', '⚡', '🎮', '🔥', '🎨']
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])

  const initGame = () => {
    const deck = [...icons, ...icons].sort(() => Math.random() - 0.5).map((val, id) => ({ id, val }))
    setCards(deck)
    setFlipped([])
    setMatched([])
  }

  useEffect(() => {
    initGame()
  }, [])

  const handleCardClick = (e, idx) => {
    e.stopPropagation()
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return

    const newFlipped = [...flipped, idx]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (cards[first].val === cards[second].val) {
        setMatched((prev) => [...prev, first, second])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }

  return (
    <div className="my-3 inline-block rounded-2xl border border-purple-500/40 bg-black/95 p-4 font-mono shadow-2xl">
      <div className="flex justify-between items-center text-xs font-bold text-purple-400 mb-2">
        <span>🃏 MEMORY MATCH ({matched.length / 2}/8 Pairs)</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 w-48 h-48 mx-auto">
        {cards.map((card, idx) => {
          const isOpen = flipped.includes(idx) || matched.includes(idx)
          return (
            <button
              key={idx}
              onClick={(e) => handleCardClick(e, idx)}
              className={`flex items-center justify-center text-base rounded-xl border transition-all cursor-pointer ${
                isOpen ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.4)]' : 'bg-slate-900 border-slate-700 hover:border-purple-500/50'
              }`}
            >
              {isOpen ? card.val : '❓'}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex justify-center">
        <button onClick={initGame} className="text-xs bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-lg border border-purple-500/40 hover:bg-purple-500/30 transition-all cursor-pointer font-bold">
          Shuffle Deck
        </button>
      </div>
    </div>
  )
}

// 5. 2048 TILE GAME
export function Game2048() {
  const [grid, setGrid] = useState([
    [0, 2, 0, 0],
    [0, 0, 4, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ])
  const [score, setScore] = useState(6)

  const slideLeft = (row) => {
    let arr = row.filter((val) => val !== 0)
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2
        setScore((s) => s + arr[i])
        arr[i + 1] = 0
      }
    }
    arr = arr.filter((val) => val !== 0)
    while (arr.length < 4) arr.push(0)
    return arr
  }

  const move = (e, dir) => {
    if (e) e.stopPropagation()
    let newGrid = [...grid.map((r) => [...r])]

    // Helper function to swap rows and columns
const transpose = (matrix) => 
  matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

if (dir === 'LEFT') {
  newGrid = newGrid.map((row) => slideLeft(row));
} else if (dir === 'RIGHT') {
  newGrid = newGrid.map((row) => slideLeft([...row].reverse()).reverse());
} else if (dir === 'UP') {
  newGrid = transpose(newGrid);
  newGrid = newGrid.map((row) => slideLeft(row));
  newGrid = transpose(newGrid);
} else if (dir === 'DOWN') {
  newGrid = transpose(newGrid);
  newGrid = newGrid.map((row) => slideLeft([...row].reverse()).reverse());
  newGrid = transpose(newGrid);
}     
    // Add random 2 tile
    const emptyPos = []
    newGrid.forEach((r, ri) => r.forEach((c, ci) => { if (c === 0) emptyPos.push([ri, ci]) }))
    if (emptyPos.length > 0) {
      const [r, c] = emptyPos[Math.floor(Math.random() * emptyPos.length)]
      newGrid[r][c] = 2
    }
    setGrid(newGrid)
  }

  const restart = (e) => {
    if (e) e.stopPropagation()
    setGrid([
      [0, 2, 0, 0],
      [0, 0, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    setScore(6)
  }

  return (
    <div className="my-3 inline-block rounded-2xl border border-amber-500/40 bg-black/95 p-4 font-mono shadow-2xl">
      <div className="flex justify-between items-center text-xs font-bold text-amber-400 mb-2">
        <span>🧩 2048 PUZZLE</span>
        <span>Score: {score}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 w-44 h-44 bg-slate-950 p-2 rounded-xl border border-slate-800 mx-auto">
        {grid.flat().map((val, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center font-black rounded-lg text-xs transition-all ${
              val === 0
                ? 'bg-slate-900/60 text-transparent'
                : val === 2
                ? 'bg-amber-200 text-slate-900 font-bold'
                : val === 4
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-orange-500 text-white font-extrabold shadow-[0_0_8px_#f97316]'
            }`}
          >
            {val || ''}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-col items-center gap-1">
        <div className="flex gap-2">
          <button onClick={(e) => move(e, 'UP')} className="px-3 py-1 bg-slate-800 text-xs rounded text-amber-300 border border-slate-700 font-bold">◀ Up</button>
          <button onClick={(e) => move(e, 'RIGHT')} className="px-3 py-1 bg-slate-800 text-xs rounded text-amber-300 border border-slate-700 font-bold">Right ▶</button>
          <button onClick={(e) => move(e, 'LEFT')} className="px-3 py-1 bg-slate-800 text-xs rounded text-amber-300 border border-slate-700 font-bold">◀ Left</button>
          <button onClick={(e) => move(e, 'DOWN')} className="px-3 py-1 bg-slate-800 text-xs rounded text-amber-300 border border-slate-700 font-bold">Down ▶</button>
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <button onClick={restart} className="text-xs bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-lg border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer font-bold">
          Restart 2048
        </button>
      </div>
    </div>
  )
}

// 6. DEVELOPER CODING QUIZ GAME
const QUIZ_QUESTIONS = [
  {
    category: 'react',
    difficulty: 'Intermediate',
    question: 'What is the primary difference between useEffect and useLayoutEffect in React?',
    options: [
      'useLayoutEffect fires synchronously after DOM mutations before paint',
      'useEffect only runs on the server during SSR',
      'useLayoutEffect is deprecated in React 19',
      'useEffect cannot access DOM element refs',
    ],
    answer: 0,
    explanation: 'useLayoutEffect runs synchronously immediately after React mutates the DOM, allowing layout measurements before browser paint.',
  },
  {
    category: 'react',
    difficulty: 'Advanced',
    question: 'In React 19, what does the new useActionState hook provide?',
    options: [
      'Automatic pending state, form action handler, and optimistic updates',
      'A replacement for React Router URL query parameters',
      'Direct WebSocket subscription management',
      'Canvas 2D context rendering bindings',
    ],
    answer: 0,
    explanation: 'useActionState handles async form actions, providing pending status, result data, and error states without boilerplate.',
  },
  {
    category: 'js',
    difficulty: 'Intermediate',
    question: 'What will `[1, 2, 3] + [4, 5, 6]` evaluate to in JavaScript?',
    options: [
      '"1,2,34,5,6"',
      '[1, 2, 3, 4, 5, 6]',
      'NaN',
      'TypeError: invalid array concatenation',
    ],
    answer: 0,
    explanation: 'The + operator coerces arrays to strings via .toString() ("1,2,3" + "4,5,6" = "1,2,34,5,6").',
  },
  {
    category: 'js',
    difficulty: 'Beginner',
    question: 'Which operator is used for Nullish Coalescing in modern JavaScript (ES2020+)?',
    options: [
      '?? (returns right-hand side only if left is null or undefined)',
      '|| (returns right-hand side on any falsy value)',
      '?: (ternary conditional operator)',
      '&&= (logical AND assignment)',
    ],
    answer: 0,
    explanation: '?? only falls back when the left operand is null or undefined, preserving 0, false, and empty strings.',
  },
  {
    category: 'python',
    difficulty: 'Beginner',
    question: 'What is the output of bool([]) and bool([0]) in Python?',
    options: [
      'False and True',
      'False and False',
      'True and True',
      'True and False',
    ],
    answer: 0,
    explanation: 'Empty collections [] evaluate to False (falsy), while a list containing an element [0] is non-empty and evaluates to True.',
  },
  {
    category: 'python',
    difficulty: 'Intermediate',
    question: 'What is the key difference between a Python list and a tuple?',
    options: [
      'Tuples are immutable and hashable; lists are mutable',
      'Lists are faster for iteration than tuples',
      'Tuples cannot store mixed data types',
      'Lists use parenthesis () while tuples use brackets []',
    ],
    answer: 0,
    explanation: 'Tuples cannot be changed once created (immutable), which makes them usable as dictionary keys when hashable.',
  },
  {
    category: 'git',
    difficulty: 'Intermediate',
    question: 'Which command safely modifies the message of the most recent unpushed commit?',
    options: [
      'git commit --amend',
      'git reset --hard HEAD~1',
      'git revert HEAD',
      'git rebase --abort',
    ],
    answer: 0,
    explanation: 'git commit --amend combines staged changes with the previous commit and allows editing the commit message.',
  },
  {
    category: 'css',
    difficulty: 'Intermediate',
    question: 'Which CSS property hints the browser to promote an element to its own GPU composite layer?',
    options: [
      'will-change: transform',
      'display: inline-block',
      'box-sizing: border-box',
      'overflow-x: scroll',
    ],
    answer: 0,
    explanation: 'will-change informs the browser of expected animations so it can optimize layers in advance via GPU rendering.',
  },
  {
    category: 'web',
    difficulty: 'Advanced',
    question: 'What does the "LCP" (Largest Contentful Paint) Core Web Vital metric measure?',
    options: [
      'Render time of the largest image or text block visible in the viewport',
      'Total payload size of all compressed JavaScript bundles',
      'Time elapsed between user click and server response',
      'Number of layout shifts occurring during scroll',
    ],
    answer: 0,
    explanation: 'LCP measures perceived loading speed by recording when the main content block has finished rendering (target < 2.5s).',
  },
]

export function DeveloperQuizGame({ initialCategory = 'all' }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem('roshzen_quiz_highscore') || '0', 10)
  })

  const filteredQuestions = selectedCategory === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory || q.category === 'all')

  const currentQ = filteredQuestions[questionIndex % filteredQuestions.length]
  const totalQuestions = Math.min(5, filteredQuestions.length)

  const handleSelectOption = (e, optIdx) => {
    e.stopPropagation()
    if (selectedAnswer !== null) return

    setSelectedAnswer(optIdx)
    const isCorrect = optIdx === currentQ.answer

    if (isCorrect) {
      const newScore = score + 1
      const newStreak = streak + 1
      setScore(newScore)
      setStreak(newStreak)
      if (newScore > highScore) {
        setHighScore(newScore)
        try {
          localStorage.setItem('roshzen_quiz_highscore', newScore.toString())
        } catch {
          // Ignore
        }
      }
    } else {
      setStreak(0)
    }
  }

  const handleNext = (e) => {
    e.stopPropagation()
    if (questionIndex + 1 >= totalQuestions) {
      setIsCompleted(true)
    } else {
      setQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
    }
  }

  const handleRestart = (e) => {
    e.stopPropagation()
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setStreak(0)
    setIsCompleted(false)
  }

  const getRankBadge = (finalScore, total) => {
    const pct = (finalScore / total) * 100
    if (pct === 100) return { title: '🏆 10x Fullstack Architect', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' }
    if (pct >= 80) return { title: '⚡ Senior Developer', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' }
    if (pct >= 60) return { title: '🚀 Frontend Engineer', color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' }
    return { title: '🌱 Code Apprentice', color: 'text-slate-300 border-slate-700 bg-slate-800/40' }
  }

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'react', label: 'React' },
    { id: 'js', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'git', label: 'Git' },
    { id: 'css', label: 'CSS' },
  ]

  return (
    <div className="my-3 rounded-2xl border border-red-500/30 bg-black/90 p-4 font-mono text-slate-200 shadow-2xl transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-500/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-bold text-xs tracking-wider">⚡ DEVELOPER CODING QUIZ</span>
          <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] text-red-300 border border-red-500/30">
            {currentQ.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {streak > 1 && (
            <span className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
              🔥 {streak} Streak
            </span>
          )}
          <span className="text-emerald-400 font-bold">Score: {score}/{totalQuestions}</span>
          <span className="text-slate-500">Best: {highScore}</span>
        </div>
      </div>

      {/* Category Pills */}
      {!isCompleted && (
        <div className="my-2.5 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedCategory(cat.id)
                handleRestart(e)
              }}
              className={`px-2.5 py-1 text-[10px] rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-500/25 text-white border-red-400 font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Game Card */}
      {!isCompleted ? (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Question {questionIndex + 1} of {totalQuestions}</span>
            <span className="uppercase text-[10px] text-red-400 font-semibold">{currentQ.category}</span>
          </div>

          <p className="text-sm font-semibold text-white leading-relaxed mb-3.5">
            {currentQ.question}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2">
            {currentQ.options.map((opt, optIdx) => {
              const isChosen = selectedAnswer === optIdx
              const isCorrectOpt = optIdx === currentQ.answer
              let btnStyle = 'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-red-500/40 hover:bg-red-500/10'

              if (selectedAnswer !== null) {
                if (isCorrectOpt) {
                  btnStyle = 'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                } else if (isChosen) {
                  btnStyle = 'border-red-500 bg-red-950/50 text-red-300 line-through'
                } else {
                  btnStyle = 'border-slate-900 bg-black/40 text-slate-600 opacity-60'
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={(e) => handleSelectOption(e, optIdx)}
                  disabled={selectedAnswer !== null}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className="font-bold shrink-0 text-[11px] px-1.5 py-0.5 rounded bg-black/50 border border-white/10">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation & Next */}
          {selectedAnswer !== null && (
            <div className="mt-3 rounded-xl border border-slate-800 bg-black/60 p-3 animate-fade-in">
              <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                {selectedAnswer === currentQ.answer ? (
                  <span className="text-emerald-400">✓ Correct!</span>
                ) : (
                  <span className="text-red-400">✗ Incorrect!</span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="mt-2.5 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 rounded-lg bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  {questionIndex + 1 >= totalQuestions ? 'View Results 🏆' : 'Next Question ❯'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results Card */
        <div className="mt-3 text-center py-4 animate-fade-in">
          <div className="text-3xl font-extrabold text-white mb-1">
            {score} / {totalQuestions}
          </div>
          <div className="text-xs text-slate-400 mb-3">
            You scored {Math.round((score / totalQuestions) * 100)}% accuracy
          </div>

          <div className={`inline-block px-3.5 py-1.5 rounded-xl border text-xs font-bold mb-4 ${getRankBadge(score, totalQuestions).color}`}>
            {getRankBadge(score, totalQuestions).title}
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function TerminalGames({ game }) {
  if (game && game.startsWith('quiz')) {
    const category = game.split(':')[1] || 'all'
    return <DeveloperQuizGame initialCategory={category} />
  }
  if (game === 'tictactoe') return <TicTacToeGame />
  if (game === 'snake') return <SnakeGame />
  if (game === 'pong') return <PongGame />
  if (game === 'memory') return <MemoryGame />
  if (game === '2048' || game === 'tetris') return <Game2048 />
  return <DeveloperQuizGame />
}
