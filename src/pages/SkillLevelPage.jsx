import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    emoji: "🌱",
    tagline: "Just starting out",
    description: "I'm new to Python and programming. I want to learn the basics from scratch.",
    border: "border-green-500/40",
    bg: "bg-green-500/10",
    selectedBg: "bg-green-500/20",
    glow: "hover:shadow-green-500/20",
    badge: "text-green-400",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    emoji: "⚡",
    tagline: "Know the basics",
    description: "I understand variables, loops, and conditions. I want to level up my skills.",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    selectedBg: "bg-cyan-500/20",
    glow: "hover:shadow-cyan-500/20",
    badge: "text-cyan-400",
  },
  {
    id: "expert",
    label: "Expert",
    emoji: "🔥",
    tagline: "Python pro",
    description: "I'm confident in Python. I want advanced challenges and complex problems.",
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
    selectedBg: "bg-orange-500/20",
    glow: "hover:shadow-orange-500/20",
    badge: "text-orange-400",
  },
];

export default function SkillLevelPage() {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user, updateSkillLevel } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.first_name || "there";

  async function handleContinue() {
    if (!selected || saving) return;
    setSaving(true);
    await updateSkillLevel(selected);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#0d1117]">
      <div className="text-center mb-10 max-w-lg">
        <div className="text-5xl mb-4">👋</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 mb-3">
          Hey, {firstName}!
        </h1>
        <p className="text-gray-300 font-mono text-sm leading-relaxed">
          Before we start your quest, tell us your current Python knowledge.
          <br />
          <span className="text-gray-500">We&apos;ll tailor your experience to match.</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {LEVELS.map((lvl) => {
          const isSelected = selected === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => setSelected(lvl.id)}
              className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer
                ${lvl.border}
                ${isSelected ? lvl.selectedBg : lvl.bg}
                ${isSelected ? "scale-[1.02] shadow-lg " + lvl.glow : "hover:scale-[1.01] " + lvl.glow}
              `}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2 pt-0.5">
                  <span className="text-2xl">{lvl.emoji}</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? "border-white bg-white" : "border-gray-600"
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#0d1117]" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-base font-mono ${lvl.badge}`}>{lvl.label}</span>
                    <span className="text-gray-500 text-xs font-mono">— {lvl.tagline}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{lvl.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 w-full max-w-md">
        <button
          onClick={handleContinue}
          disabled={!selected || saving}
          className={`w-full py-3.5 rounded-xl font-semibold font-mono text-sm transition-all duration-200 ${
            !selected
              ? "bg-[#161b22] border border-[#30363d] text-gray-600 cursor-not-allowed"
              : saving
              ? "bg-[#161b22] border border-[#30363d] text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] cursor-pointer"
          }`}
        >
          {saving
            ? "Saving..."
            : selected
            ? `Start as ${LEVELS.find((l) => l.id === selected)?.label} →`
            : "Select your level to continue"}
        </button>
      </div>

      <p className="mt-4 text-gray-600 text-xs font-mono text-center">
        You can update this in your profile settings later.
      </p>
    </div>
  );
}
