#!/usr/bin/env node

import { Command } from 'commander'
import { createClient } from '@supabase/supabase-js'
import open from 'open'
import fs from 'fs'
import path from 'path'
import os from 'os'
import readline from 'readline'

// Supabase Credentials
const SUPABASE_URL = 'https://uijwztgrkkcuyltnqfkx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpand6dGdya2tjdXlsdG5xZmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTA0NjcsImV4cCI6MjEwMDk4NjQ2N30.R0sITYMCyJdxOcloZQGAV_zaJw7PgCQPzIIf8qYZr4U'
const TARGET_HUB_URL = process.env.ROSHZEN_HUB_URL || 'http://localhost:5173/links'

const SESSION_FILE = path.join(os.homedir(), '.roshzen-links-session.json')
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Helper: Prompt text securely
function promptInput(query, hidden = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    if (hidden) {
      process.stdout.write(query)
      let input = ''
      process.stdin.on('data', (char) => {
        char = char + ''
        switch (char) {
          case '\n':
          case '\r':
          case '\u0004':
            process.stdin.pause()
            break
          default:
            process.stdout.write('*')
            input += char
            break
        }
      })
      rl.on('close', () => {
        console.log()
        resolve(input.trim())
      })
    } else {
      rl.question(query, (answer) => {
        rl.close()
        resolve(answer.trim())
      })
    }
  })
}

// Session Helpers
function saveSession(session) {
  fs.writeFileSync(
    SESSION_FILE,
    JSON.stringify(
      {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user: { email: session.user.email, id: session.user.id },
        expires_at: session.expires_at,
      },
      null,
      2
    ),
    { mode: 0o600 }
  )
}

function loadSession() {
  if (!fs.existsSync(SESSION_FILE)) return null
  try {
    const raw = fs.readFileSync(SESSION_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function clearSession() {
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE)
  }
}

const program = new Command()
program
  .name('roshzen-links')
  .description('RoshZen Private LinkHub CLI Command Center')
  .version('1.0.0')

// 1. COMMAND: LOGIN
program
  .command('login')
  .description('Authenticate securely with Supabase Auth')
  .action(async () => {
    console.log('\n⚡ RoshZen Private LinkHub Terminal Authentication')
    console.log('---------------------------------------------------')

    const email = await promptInput('Admin Email: ')
    const password = await promptInput('Master Password: ', true)

    if (!email || !password) {
      console.error('❌ Error: Email and password are required.')
      process.exit(1)
    }

    console.log('\nAuthenticating with Supabase...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error(`❌ Authentication failed: ${error.message}`)
      process.exit(1)
    }

    saveSession(data.session)
    console.log(`\n✅ Login successful! Session active as [${data.user.email}]`)
    console.log(`📁 Secure token stored at: ${SESSION_FILE}\n`)
  })

// 2. COMMAND: OPEN
program
  .command('open')
  .description('Open private LinkHub in default web browser')
  .action(async () => {
    const session = loadSession()
    if (!session) {
      console.log('⚠️  No active CLI session found. Please log in first:')
      console.log('   $ roshzen-links login\n')
      process.exit(1)
    }

    console.log(`⚡ Opening RoshZen Private LinkHub (${TARGET_HUB_URL})...`)
    try {
      await open(TARGET_HUB_URL)
      console.log('✅ Browser launched successfully.\n')
    } catch (err) {
      console.error(`❌ Failed to launch browser: ${err.message}`)
    }
  })

// 3. COMMAND: LIST
program
  .command('list')
  .description('List all registered links in terminal')
  .action(async () => {
    console.log('\n⚡ Fetching RoshZen Private Links...')

    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      console.error(`❌ Failed to fetch links: ${error.message}`)
      process.exit(1)
    }

    if (!links || links.length === 0) {
      console.log('No links found.')
      return
    }

    console.log('\n' + '='.repeat(80))
    console.log(
      'POSITION | STATUS   | TITLE                    | URL'
    )
    console.log('='.repeat(80))

    links.forEach((l) => {
      const pos = (l.position || 0).toString().padEnd(8)
      const status = (l.is_active ? 'ACTIVE  ' : 'DISABLED').padEnd(9)
      const title = (l.title || '').padEnd(24).substring(0, 24)
      console.log(`${pos} | ${status} | ${title} | ${l.url}`)
    })

    console.log('='.repeat(80) + '\n')
  })

// 4. COMMAND: ADD
program
  .command('add <title> <url> [description]')
  .description('Add a new link card')
  .action(async (title, url, description = '') => {
    const session = loadSession()
    if (!session) {
      console.error('❌ Authentication required. Please run: roshzen-links login')
      process.exit(1)
    }

    console.log(`\n⚡ Adding new link card: "${title}" -> ${url}`)
    const { data, error } = await supabase.from('links').insert([
      {
        user_id: session.user.id,
        title,
        url,
        description,
        is_active: true,
        position: 99,
      },
    ]).select()

    if (error) {
      console.error(`❌ Failed to add link: ${error.message}`)
      process.exit(1)
    }

    console.log(`✅ Link added successfully! ID: ${data[0].id}\n`)
  })

// 5. COMMAND: REMOVE
program
  .command('remove <id>')
  .description('Delete a link by ID')
  .action(async (id) => {
    const session = loadSession()
    if (!session) {
      console.error('❌ Authentication required. Please run: roshzen-links login')
      process.exit(1)
    }

    console.log(`\n⚡ Deleting link ID: ${id}...`)
    const { error } = await supabase.from('links').delete().eq('id', id)

    if (error) {
      console.error(`❌ Failed to delete link: ${error.message}`)
      process.exit(1)
    }

    console.log(`✅ Link deleted successfully.\n`)
  })

// 6. COMMAND: LOGOUT
program
  .command('logout')
  .description('End CLI session and clear local tokens')
  .action(() => {
    clearSession()
    console.log('✅ Session ended. CLI logged out successfully.\n')
  })

program.parse(process.argv)
