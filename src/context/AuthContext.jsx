import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { setCurrentUser as setHeroUser, loadHeroFromCloud } from "../data/hero";
import { setCurrentUser as setProgressUser, loadProgressFromCloud } from "../data/progress";
import { setCurrentUser as setSessionUser } from "../mab/sessionTracker";

const AuthContext = createContext(null);

// ─── Skill-level localStorage helpers (keyed by userId so users don't share) ──
function skillLevelKey(userId) {
  return userId ? `kidcode_skill_level_${userId}` : null;
}
function readCachedSkillLevel(userId) {
  const key = skillLevelKey(userId);
  return key ? localStorage.getItem(key) : null;
}
function writeCachedSkillLevel(userId, level) {
  const key = skillLevelKey(userId);
  if (!key) return;
  if (level) localStorage.setItem(key, level);
  else localStorage.removeItem(key);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [skillLevel, setSkillLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  async function initUser(supabaseUser) {
    if (!supabaseUser) {
      setHeroUser(null);
      setProgressUser(null);
      setSessionUser(null);
      setUser(null);
      setIsAdmin(false);
      setSkillLevel(null);
      return;
    }

    setUser(supabaseUser);
    setHeroUser(supabaseUser.id);
    setProgressUser(supabaseUser.id);
    setSessionUser(supabaseUser.id);

    // Restore skill level from localStorage immediately (fast, no network wait)
    const cached = readCachedSkillLevel(supabaseUser.id);
    if (cached) setSkillLevel(cached);

    // Load cloud data into localStorage
    await loadHeroFromCloud(supabaseUser.id);
    await loadProgressFromCloud(supabaseUser.id);

    // Insert profile on first login only — never overwrite existing data
    const meta = supabaseUser.user_metadata || {};
    try {
      await supabase.from("profiles").upsert({
        id: supabaseUser.id,
        nus_id: meta.nus_id ?? null,
        first_name: meta.first_name ?? null,
        last_name: meta.last_name ?? null,
      }, { onConflict: "id", ignoreDuplicates: true });
    } catch {
      // non-critical — profile may already exist
    }

    // Fetch role + skill level from profiles table
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role, skill_level")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    console.log("[Auth] profile →", profile, "err →", profileErr);
    setIsAdmin(profile?.role === "admin");

    // Use DB value if present; otherwise keep whatever is already in state/cache
    const dbLevel = profile?.skill_level ?? null;
    const resolved = dbLevel || cached || null;
    if (resolved) {
      setSkillLevel(resolved);
      writeCachedSkillLevel(supabaseUser.id, resolved);
    }
  }

  useEffect(() => {
    if (!supabase) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    const fallback = setTimeout(() => setLoading(false), 6000);

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        clearTimeout(fallback);
        try {
          await initUser(session?.user ?? null);
        } catch (err) {
          console.error("initUser error:", err);
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        clearTimeout(fallback);
        console.error("getSession error:", err);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // TOKEN_REFRESHED — silent JWT rotation, nothing changed.
        // INITIAL_SESSION — handled by getSession() above.
        // SIGNED_OUT     — can fire spuriously; explicit logout handled in signOut().
        if (
          event === "TOKEN_REFRESHED" ||
          event === "INITIAL_SESSION" ||
          event === "SIGNED_OUT"
        ) return;

        setLoading(true);
        try {
          await initUser(session?.user ?? null);
        } catch (err) {
          console.error("initUser error:", err);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(fallback);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = (email, password, firstName, lastName, nusId) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, nus_id: nusId },
      },
    });

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

  const updateSkillLevel = async (level) => {
    if (!user || !supabase) return;
    // Persist to localStorage immediately so it survives any React state reset
    writeCachedSkillLevel(user.id, level);
    setSkillLevel(level);
    // Sync to DB (best-effort)
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, skill_level: level }, { onConflict: "id" });
    if (error) console.error("updateSkillLevel error:", error);
  };

  const continueAsGuest = () => {
    setHeroUser(null);
    setProgressUser(null);
    setSessionUser(null);
    setIsGuest(true);
  };

  const signOut = async () => {
    // Clear localStorage cache for this user's skill level
    if (user) writeCachedSkillLevel(user.id, null);
    // Clear all auth state so ProtectedRoute redirects to /login
    setUser(null);
    setIsAdmin(false);
    setSkillLevel(null);
    setIsGuest(false);
    setHeroUser(null);
    setProgressUser(null);
    setSessionUser(null);
    if (supabase) await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user, isAdmin, isGuest, skillLevel, loading,
      signIn, signUp, signInWithGoogle,
      continueAsGuest, signOut, updateSkillLevel,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext) ?? {
    user: null, isAdmin: false, isGuest: true, skillLevel: null, loading: false,
    signIn: async () => ({}), signUp: async () => ({}),
    signInWithGoogle: async () => ({}),
    continueAsGuest: () => {}, signOut: async () => {},
    updateSkillLevel: async () => {},
  };
}
