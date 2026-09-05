import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uijwztgrkkcuyltnqfkx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpand6dGdya2tjdXlsdG5xZmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTA0NjcsImV4cCI6MjEwMDk4NjQ2N30.R0sITYMCyJdxOcloZQGAV_zaJw7PgCQPzIIf8qYZr4U'

export const isSupabaseConfigured = true

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
