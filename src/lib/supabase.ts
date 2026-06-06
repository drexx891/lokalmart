import { createClient } from '@supabase/supabase-js';

// === Supabase Client untuk Server-Side (menggunakan Service Role Key) ===
// Digunakan di API routes dan server actions — BYPASS RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';



// Client admin (server-side only, bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Client publik (client-side, respects RLS)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);
