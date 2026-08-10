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

export function TerminalGames({ game }) {
  if (game === 'tictactoe') return <TicTacToeGame />
  if (game === 'snake') return <SnakeGame />
  if (game === 'pong') return <PongGame />
  if (game === 'memory') return <MemoryGame />
  if (game === '2048' || game === 'tetris') return <Game2048 />
  return <TicTacToeGame />
}
