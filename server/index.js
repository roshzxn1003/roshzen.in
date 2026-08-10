import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config() // fallback to .env

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const DATA_FILE = path.join(__dirname, 'submissions.json')

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['POST', 'GET'],
}))
app.use(express.json())

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// ── Helpers ───────────────────────────────────────────────────────────────────
function readSubmissions() {
  if (!fs.existsSync(DATA_FILE)) return []
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeSubmissions(submissions) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf-8')
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { message } = req.body
  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required.' })
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ success: false, error: 'API key is missing on the server.' })
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are a helpful AI assistant inside a developer's portfolio terminal. Keep responses concise, helpful, and terminal-friendly. Only output plain text or basic formatting."
      }
    })
    return res.json({ success: true, text: response.text })
  } catch (error) {
    console.error('Chat API Error:', error)
    return res.status(500).json({ success: false, error: 'Failed to communicate with AI.' })
  }
})

// POST /api/contact  — receive a new submission
app.post('/api/contact', (req, res) => {
  const { name, email, projectType, message } = req.body

  // Validate
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' })
  }
  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' })
  }
  if (message.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'Message must be at least 10 characters.' })
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    projectType: projectType?.trim() || 'Not specified',
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  }

  const submissions = readSubmissions()
  submissions.unshift(entry)       // newest first
  writeSubmissions(submissions)

  console.log(`\n📬 New submission [${entry.id}]`)
  console.log(`   From   : ${entry.name} <${entry.email}>`)
  console.log(`   Type   : ${entry.projectType}`)
  console.log(`   Message: ${entry.message.slice(0, 80)}${entry.message.length > 80 ? '…' : ''}\n`)

  return res.status(201).json({ success: true, message: 'Message received! I\'ll get back to you soon.' })
})

// GET /api/submissions — view all saved submissions (dev use)
app.get('/api/submissions', (_req, res) => {
  res.json(readSubmissions())
})

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Contact API running on http://localhost:${PORT}`)
  console.log(`   POST /api/contact       — submit a message`)
  console.log(`   POST /api/chat          — interact with Gemini AI`)
  console.log(`   GET  /api/submissions   — view all saved messages`)
  console.log(`   Submissions file: ${DATA_FILE}\n`)
})
