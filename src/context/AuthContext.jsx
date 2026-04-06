import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { setCurrentUser as setHeroUser, loadHeroFromCloud } from "../data/hero";
import { setCurrentUser as setProgressUser, loadProgressFromCloud } from "../data/progress";
import { setCurrentUser as setSessionUser } from "../mab/sessionTracker";

const AuthContext = createContext(null);

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

    // Set user immediately so downstream hooks get the user ID right away
    setUser(supabaseUser);
    setHeroUser(supabaseUser.id);
    setProgressUser(supabaseUser.id);
    setSessionUser(supabaseUser.id);

    // Load this user's saved data from cloud into localStorage
    await loadHeroFromCloud(supabaseUser.id);
    await loadProgressFromCloud(supabaseUser.id);

    // Insert profile on first login only — never overwrite existing data
    const meta = supabaseUser.user_metadata || {};
    await supabase.from("profiles").upsert({
      id: supabaseUser.id,
      nus_id: meta.nus_id ?? null,
      first_name: meta.first_name ?? null,
      last_name: meta.last_name ?? null,
    }, { onConflict: "id", ignoreDuplicates: true }).catch(() => {});

    // Fetch role + skill level from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, skill_level")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    setIsAdmin(profile?.role === "admin");
    // Preserve skill level already set this session — prevents token refresh
    // from wiping a skill level the user just chose (if DB save is still pending)
    setSkillLevel((prev) => profile?.skill_level ?? prev);
  }

  useEffect(() => {
    // When Supabase isn't configured, run as guest automatically
    if (!supabase) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Fallback: force loading off after 6s if Supabase hangs
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
      async (_event, session) => {
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
    const { error } = await supabase
      .from("profiles")
      .update({ skill_level: level })
      .eq("id", user.id);
    if (!error) setSkillLevel(level);
  };

  const continueAsGuest = () => {
    setHeroUser(null);
    setProgressUser(null);
    setSessionUser(null);
    setIsGuest(true);
  };

  const signOut = async () => {
    setHeroUser(null);
    setProgressUser(null);
    setSessionUser(null);
    setIsGuest(false);
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

/**
 * Safe hook — returns guest defaults when used outside an AuthProvider
 * (e.g. in tests that don't wrap with AuthProvider).
 */
export function useAuth() {
  return useContext(AuthContext) ?? {
    user: null, isAdmin: false, isGuest: true, skillLevel: null, loading: false,
    signIn: async () => ({}), signUp: async () => ({}),
    signInWithGoogle: async () => ({}),
    continueAsGuest: () => {}, signOut: async () => {},
    updateSkillLevel: async () => {},
  };
}
