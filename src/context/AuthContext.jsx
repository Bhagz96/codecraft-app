import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { setCurrentUser as setHeroUser, loadHeroFromCloud } from "../data/hero";
import { setCurrentUser as setProgressUser, loadProgressFromCloud, loadReviewsFromCloud } from "../data/progress";
import { SUPPORT_STRATEGIES } from "../mab/engine";
import { setCurrentUser as setSessionUser } from "../mab/sessionTracker";

const AuthContext = createContext(null);

// ─── Skill-level localStorage helpers (kept for DB read compatibility) ────────
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

// ─── Instruction-mode localStorage helpers (Beta) ─────────────────────────────
function instructionModeKey(userId) {
  return userId ? `kidcode_instruction_mode_${userId}` : null;
}
function readCachedInstructionMode(userId) {
  const key = instructionModeKey(userId);
  return key ? localStorage.getItem(key) : null;
}
function writeCachedInstructionMode(userId, mode) {
  const key = instructionModeKey(userId);
  if (!key) return;
  if (mode) localStorage.setItem(key, mode);
  else localStorage.removeItem(key);
}
function randomInstructionMode() {
  return SUPPORT_STRATEGIES[Math.floor(Math.random() * SUPPORT_STRATEGIES.length)];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [skillLevel, setSkillLevel] = useState(null);
  const [instructionMode, setInstructionMode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tracks the user ID that was fully initialized by initUser.
  // onAuthStateChange uses this to skip re-initialization when the
  // same user is already loaded — preventing transient state resets
  // that would incorrectly redirect authenticated users to /skill-level.
  const initializedUserIdRef = useRef(null);

  async function initUser(supabaseUser) {
    if (!supabaseUser) {
      initializedUserIdRef.current = null;
      setHeroUser(null);
      setProgressUser(null);
      setSessionUser(null);
      setUser(null);
      setIsAdmin(false);
      setSkillLevel(null);
      setInstructionMode(null);
      return;
    }

    setUser(supabaseUser);
    setHeroUser(supabaseUser.id);
    setProgressUser(supabaseUser.id);
    setSessionUser(supabaseUser.id);

    // Restore instruction mode from localStorage immediately (fast, no network wait)
    const cachedMode = readCachedInstructionMode(supabaseUser.id);
    if (cachedMode) setInstructionMode(cachedMode);

    // Restore skill level from localStorage immediately (fast, no network wait)
    const cached = readCachedSkillLevel(supabaseUser.id);
    if (cached) setSkillLevel(cached);

    // Load cloud data into localStorage.
    await loadHeroFromCloud(supabaseUser.id, supabaseUser.user_metadata ?? {});
    await loadProgressFromCloud(supabaseUser.id);
    await loadReviewsFromCloud(supabaseUser.id);

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

    // Fetch role, skill_level, and instruction_mode from profiles table
    // instruction_mode column may not exist yet — fall back gracefully
    let profile = null;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("role, skill_level, instruction_mode")
        .eq("id", supabaseUser.id)
        .maybeSingle();
      profile = data;
    } catch {
      // Column may not exist yet — try without instruction_mode
      try {
        const { data } = await supabase
          .from("profiles")
          .select("role, skill_level")
          .eq("id", supabaseUser.id)
          .maybeSingle();
        profile = data;
      } catch { /* non-critical */ }
    }

    setIsAdmin(profile?.role === "admin");

    // Resolve skill level (DB value preferred over cache)
    const dbLevel = profile?.skill_level ?? null;
    const resolvedLevel = dbLevel || cached || null;
    if (resolvedLevel) {
      setSkillLevel(resolvedLevel);
      writeCachedSkillLevel(supabaseUser.id, resolvedLevel);
    }

    // Resolve instruction mode — assign randomly on first login if not set
    let resolvedMode = profile?.instruction_mode || cachedMode || null;
    if (!resolvedMode) {
      resolvedMode = randomInstructionMode();
      // Persist the assignment to DB immediately so it's permanent
      supabase.from("profiles")
        .update({ instruction_mode: resolvedMode })
        .eq("id", supabaseUser.id)
        .then(() => {}, () => {});
    }
    setInstructionMode(resolvedMode);
    writeCachedInstructionMode(supabaseUser.id, resolvedMode);

    initializedUserIdRef.current = supabaseUser.id;
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
        // INITIAL_SESSION — duplicate of getSession(), skip.
        // TOKEN_REFRESHED — silent JWT rotation, nothing changed.
        // USER_UPDATED    — fired by updateUser() (hero metadata); skip.
        // SIGNED_OUT      — can fire spuriously; explicit logout handled in signOut().
        if (
          event === "INITIAL_SESSION" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED"    ||
          event === "SIGNED_OUT"
        ) return;

        // Skip if this is the same user already fully initialized by getSession().
        // Supabase often echoes SIGNED_IN during navigation (e.g. background
        // token refresh); re-running initUser would transiently clear isAdmin /
        // skillLevel before the async DB fetch completes, causing incorrect
        // redirects to /skill-level for existing users and admins.
        if (session?.user?.id && session.user.id === initializedUserIdRef.current) return;

        // Genuine new sign-in (different user, OAuth redirect, cross-tab login).
        // Silently update auth state without a loading screen.
        try {
          await initUser(session?.user ?? null);
        } catch (err) {
          console.error("initUser error:", err);
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
    if (user) writeCachedSkillLevel(user.id, null);
    if (user) writeCachedInstructionMode(user.id, null);
    // Clear all auth state so ProtectedRoute redirects to /login
    setUser(null);
    setIsAdmin(false);
    setSkillLevel(null);
    setInstructionMode(null);
    setIsGuest(false);
    setHeroUser(null);
    setProgressUser(null);
    setSessionUser(null);
    if (supabase) await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user, isAdmin, isGuest, skillLevel, instructionMode, loading,
      signIn, signUp, signInWithGoogle,
      continueAsGuest, signOut, updateSkillLevel,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext) ?? {
    user: null, isAdmin: false, isGuest: true, skillLevel: null,
    instructionMode: null, loading: false,
    signIn: async () => ({}), signUp: async () => ({}),
    signInWithGoogle: async () => ({}),
    continueAsGuest: () => {}, signOut: async () => {},
    updateSkillLevel: async () => {},
  };
}
