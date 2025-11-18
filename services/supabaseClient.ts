
import { createClient } from '@supabase/supabase-js';

// Safely retrieve environment variables to prevent crashes
const getEnv = (key: string) => {
  let val = '';
  try {
    // Check for import.meta.env (Vite)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        val = import.meta.env[key] || '';
    }
  } catch (e) {
    // Ignore error
  }
  
  if (!val) {
    try {
      // Check for process.env (Standard Node/React)
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env) {
         // @ts-ignore
         val = process.env[key] || '';
      }
    } catch(e) {}
  }
  return val;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

const isConfigured = supabaseUrl && supabaseKey && supabaseUrl !== 'undefined' && supabaseKey !== 'undefined';

if (!isConfigured) {
    console.warn("Supabase URL or Key is missing. App will run in Mock/Offline mode. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use the database.");
}

// Use placeholders if keys are missing. The storageService will handle the connection errors by falling back to mock data.
export const supabase = createClient(
    isConfigured ? supabaseUrl : 'https://placeholder.supabase.co', 
    isConfigured ? supabaseKey : 'placeholder'
);
