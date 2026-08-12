import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mcebmeplbhcfbkrywqdq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZWJtZXBsYmhjZmJrcnl3cWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NDk3NTUsImV4cCI6MjEwMjEyNTc1NX0.U6wVnk-uHAfkFaAcWQrk5fIWj3MR4nW3EjhcRCACq08'

export const isSupabaseConfigured = true

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
