import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function nusIdToEmail(nusId) {
  return `${nusId.trim().toLowerCase()}@nus.edu.sg`;
}

function isValidNusId(id) {
  return /^[a-zA-Z]\d{7}[a-zA-Z]?$/.test(id.trim());
}

function resolveEmail(val) {
  if (isEmail(val)) return val.trim().toLowerCase();
  return nusIdToEmail(val);
}

export default function LoginPage() {
  const location = useLocation();
  const isAdminLogin = location.state?.from === "admin";

  const [mode, setMode] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nusId, setNusId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  function switchMode(m) {
    setMode(m);
    setError("");
    setSuccessMsg("");
    setFirstName(""); setLastName(""); setNusId("");
    setPassword(""); setConfirmPassword("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccessMsg("");

    if (!nusId.trim()) {
      setError("Please enter your NUS ID or email.");
      return;
    }
    if (mode === "signup" && !isValidNusId(nusId)) {
      setError("Please use your NUS ID (e.g. E1234567) to sign up.");
      return;
    }
    if (mode === "signup") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
    }

    setLoading(true);
    const email = resolveEmail(nusId);

    try {
      if (mode === "login") {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(
            err.message === "Invalid login credentials"
              ? "Incorrect NUS ID or password."
              : err.message
          );
        } else {
          navigate(isAdminLogin ? "/admin" : "/");
        }
      } else {
        const { error: err } = await signUp(
          email, password,
          firstName.trim(), lastName.trim(),
          nusId.trim().toUpperCase()
        );
        if (err) {
          setError(err.message);
        } else {
          setSuccessMsg("Account created! Please check your email to confirm, then log in.");
          switchMode("login");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  function handleGuest() {
    continueAsGuest();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0d1117]">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 mb-2">
          CodeCraft
        </h1>
        <p className="text-gray-400 text-sm font-mono">
          {isAdminLogin
            ? "Admin access — log in to continue."
            : mode === "login" ? "Welcome back. Continue your quest." : "Create an account to start your quest."}
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 w-full max-w-sm">
        {/* Mode toggle — hidden for admin login (login only) */}
        {!isAdminLogin && (
          <div className="flex bg-[#0d1117] rounded-xl p-1 mb-6 border border-[#30363d]">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-mono font-semibold transition-all duration-200 cursor-pointer ${
                  mode === m
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-900/30 border border-green-700/50 text-green-400 text-sm font-mono leading-relaxed">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">First Name</label>
                <input
                  type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  required placeholder="Jane"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/60 placeholder-gray-600 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Last Name</label>
                <input
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  required placeholder="Doe"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/60 placeholder-gray-600 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">NUS ID</label>
            <input
              type="text" value={nusId} onChange={(e) => setNusId(e.target.value)}
              required placeholder="E1234567"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/60 placeholder-gray-600 transition-colors"
            />
            <p className="text-gray-600 text-xs font-mono mt-1">e.g. E1234567 or A0123456B</p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required placeholder="••••••••"
              minLength={mode === "signup" ? 8 : 1}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/60 placeholder-gray-600 transition-colors"
            />
            {mode === "signup" && <p className="text-gray-600 text-xs font-mono mt-1">Minimum 8 characters</p>}
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Confirm Password</label>
              <input
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                required placeholder="••••••••"
                className={`w-full bg-[#0d1117] border rounded-lg px-4 py-2.5 text-gray-100 font-mono text-sm focus:outline-none placeholder-gray-600 transition-colors ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-[#30363d] focus:border-cyan-500/60"
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-400 text-xs font-mono mt-1">Passwords don&apos;t match</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (mode === "signup" && confirmPassword !== password && confirmPassword.length > 0)}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 mt-1 ${
              loading
                ? "bg-[#0d1117] border border-[#30363d] text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            }`}
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        {/* Divider + Guest — hidden for admin login */}
        {!isAdminLogin && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#30363d]" />
              <span className="text-gray-600 text-xs font-mono">or</span>
              <div className="flex-1 h-px bg-[#30363d]" />
            </div>
            <button
              onClick={handleGuest}
              className="w-full py-2.5 rounded-xl border border-[#30363d] text-gray-400 text-sm font-mono hover:text-gray-200 hover:border-[#484f58] transition-all duration-200 cursor-pointer"
            >
              Continue as Guest
            </button>
            <p className="text-gray-700 text-xs font-mono text-center mt-2">
              Progress saves locally — not synced to account
            </p>
          </>
        )}

        {isAdminLogin && (
          <p className="text-gray-700 text-xs font-mono text-center mt-4">
            Use your admin credentials to access the dashboard.
          </p>
        )}
      </div>

      {!isAdminLogin && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs font-mono">
            Admin? Log in above — you&apos;ll be redirected automatically.
          </p>
        </div>
      )}
    </div>
  );
}
