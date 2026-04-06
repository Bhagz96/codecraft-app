import { createClient } from "@supabase/supabase-js";

const url        = import.meta.env.VITE_SUPABASE_URL;
const anonKey    = import.meta.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

const clientOptions = {
  auth: {
    // Prevents concurrent lock acquisition issues in some environments
    lock: async (_name, _acquireTimeout, fn) => fn(),
  },
};

// Standard client — used by students and the app at large.
// Returns null when env vars are absent (guest mode, tests).
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, clientOptions)
    : null;

// Service-role client — bypasses RLS, admin-only reads.
// Returns null when the service key isn't configured (safe fallback).
export const supabaseAdmin =
  url && serviceKey
    ? createClient(url, serviceKey, { ...clientOptions, auth: { persistSession: false } })
    : null;
