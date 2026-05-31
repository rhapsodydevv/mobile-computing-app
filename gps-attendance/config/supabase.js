// config/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wibyyjdukskpqxktpllk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYnl5amR1a3NrcHF4a3RwbGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxODI4MTMsImV4cCI6MjA5NTc1ODgxM30.O_QaGRfamLllZXyQnTTydw93tibjuXrC2KrU9jMmXEo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

