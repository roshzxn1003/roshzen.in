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
  origin: process.env.FRONTEND_URL || '*',
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

  const systemInstruction = `You are the terminal AI Co-Pilot for Arun Roshan G J (roshzen.in / roshzxn1003), a Computer Science Engineering student and developer.
Key details about Arun:
- Role: CSE student, Frontend & Mobile app builder (React, Tailwind CSS, JavaScript, Flutter, Riverpod, Supabase).
- Top Projects:
  1. RoshZen Portfolio (roshzen.in) - Cyberpunk terminal portfolio with 30+ commands, retro scanlines, lo-fi synth, and games.
  2. Love Vault (zen-love-vault.lovable.app) - Private couple memories keepsake app with Supabase auth and encryption.
  3. Zenith Finance - Dual-space personal & family expense tracker in Flutter & Riverpod with Supabase realtime sync.
  4. Business landing pages, Link-in-Bio pages, and Python Daily concept.
- Contact: arunroshan1003@gmail.com, GitHub: roshzxn1003, LinkedIn: arun-roshan-gj.
- Status: Actively open to Software Engineering / Frontend Internships, Junior roles, and Freelance projects.
Style guide:
- Respond in a sharp, polite, terminal-hacker aesthetic.
- Keep responses concise, structured, and easy to read in a CLI terminal (bullet points, clear sections).
- Never disclose API keys or private credentials.`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: { systemInstruction }
    })
    return res.json({ success: true, text: response.text })
  } catch (error) {
    console.warn('Gemini 2.0 Flash failed, attempting Gemini 1.5 Flash fallback...', error.message)
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: message,
        config: { systemInstruction }
      })
      return res.json({ success: true, text: fallbackResponse.text })
    } catch (fallbackErr) {
      console.error('Chat API Error:', fallbackErr.message)
      return res.status(500).json({ success: false, error: 'Failed to communicate with AI: ' + (fallbackErr.message || 'API error') })
    }
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

// Serve static frontend build if dist folder exists
const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' })
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Contact API running on http://localhost:${PORT}`)
  console.log(`   POST /api/contact       — submit a message`)
  console.log(`   POST /api/chat          — interact with Gemini AI`)
  console.log(`   GET  /api/submissions   — view all saved messages`)
  console.log(`   Submissions file: ${DATA_FILE}\n`)
})
