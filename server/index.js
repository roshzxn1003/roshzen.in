import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
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

// ── YTD (YouTube Downloader) API ──────────────────────────────────────────────
app.post('/api/ytd/info', (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ success: false, error: 'URL is required.' })

  const pythonExec = fs.existsSync(path.join(__dirname, '../.venv/bin/python3'))
    ? path.join(__dirname, '../.venv/bin/python3')
    : 'python3'

  const proc = spawn(pythonExec, ['-m', 'ytd', 'info', url], { cwd: path.join(__dirname, '..') })
  let stdout = ''
  let stderr = ''

  proc.stdout.on('data', (d) => { stdout += d.toString() })
  proc.stderr.on('data', (d) => { stderr += d.toString() })

  proc.on('close', (code) => {
    if (code === 0) {
      return res.json({ success: true, output: stdout })
    }
    return res.status(400).json({ success: false, error: stderr || stdout || 'Failed to extract video info' })
  })
})

app.post('/api/ytd/download', (req, res) => {
  const { url, quality = '720p', mediaType = 'video', audioFormat = 'mp3' } = req.body
  if (!url) return res.status(400).json({ success: false, error: 'URL is required.' })

  const pythonExec = fs.existsSync(path.join(__dirname, '../.venv/bin/python3'))
    ? path.join(__dirname, '../.venv/bin/python3')
    : 'python3'

  const downloadDir = path.join(os.homedir(), 'Downloads', 'YTD')
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true })
  }

  const args = mediaType === 'video'
    ? ['-m', 'ytd', 'video', url, '-q', quality, '--dir', downloadDir]
    : ['-m', 'ytd', 'audio', url, '-f', audioFormat || 'mp3', '--dir', downloadDir]

  const venvBin = path.join(__dirname, '../.venv/bin')
  const env = { ...process.env, PATH: `${venvBin}:${process.env.PATH || ''}` }

  const proc = spawn(pythonExec, args, { cwd: path.join(__dirname, '..'), env })
  let stdout = ''
  let stderr = ''

  proc.stdout.on('data', (d) => { stdout += d.toString() })
  proc.stderr.on('data', (d) => { stderr += d.toString() })

  proc.on('close', (code) => {
    if (code === 0) {
      try {
        const targetExt = mediaType === 'video' ? '.mp4' : (audioFormat === 'm4a' ? '.m4a' : '.mp3')
        const allFiles = fs.readdirSync(downloadDir).map((f) => ({
          name: f,
          time: fs.statSync(path.join(downloadDir, f)).mtime.getTime(),
        })).sort((a, b) => b.time - a.time)

        const matchingFiles = allFiles.filter((f) => f.name.toLowerCase().endsWith(targetExt))
        const latestFile = matchingFiles.length > 0 ? matchingFiles[0].name : (allFiles.length > 0 ? allFiles[0].name : null)

        return res.json({
          success: true,
          output: stdout,
          filename: latestFile,
          downloadUrl: latestFile ? `/api/ytd/file/${encodeURIComponent(latestFile)}` : null,
          localPath: latestFile ? path.join(downloadDir, latestFile) : null,
        })
      } catch (err) {
        return res.json({ success: true, output: stdout })
      }
    }
    return res.status(400).json({ success: false, error: stderr || stdout || 'Download failed' })
  })
})

// Endpoint to stream the downloaded file to the browser
app.get('/api/ytd/file/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename)
  const filePath = path.join(os.homedir(), 'Downloads', 'YTD', filename)
  if (fs.existsSync(filePath)) {
    return res.download(filePath, filename)
  }
  return res.status(404).json({ error: 'File not found on local disk' })
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
