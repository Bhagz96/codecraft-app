import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client when both credentials are present.
// When missing (local dev without .env), auth is skipped and the app
// runs in guest mode. All callers must null-check before using.
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          // Prevents concurrent lock acquisition issues in some environments
          lock: async (_name, _acquireTimeout, fn) => fn(),
        },
      })
    : null;
