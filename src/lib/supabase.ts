import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const message = 'Supabase credentials not found.';
  if (import.meta.env.PROD) {
    console.error(`${message} Cloud sync is disabled for this build.`);
  } else {
    console.warn(`${message} Using localStorage fallback in development.`);
  }
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
