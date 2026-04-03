/**
 * CONCEPT INTRO — Animated introduction cards before a level starts.
 * ==================================================================
 * Shows a bite-sized, engaging intro to the concept being taught.
 * 4 quick animated slides:
 *   1. "What you'll learn" — concept name + icon
 *   2. "Why it matters"   — one real-world reason
 *   3. "Code preview"     — tiny code snippet to get excited about
 *   4. "Ready?"           — start button
 *
 * Props:
 *   concept      – the concept object (title, icon, color, etc.)
 *   levelData    – the level object (level number, title)
 *   heroName     – player's hero name
 *   onStart      – callback when user clicks "Start Level"
 */

import { useState, useEffect } from "react";
import PixelHero from "./game/PixelHero";

// Concept-specific intro content
const INTRO_CONTENT = {
  variables: {
    whyItMatters: "Every game stores data — your hero's name, health, score. Variables are the containers that hold it all.",
    codePreview: 'hero = "{heroName}"\nhealth = 100\nprint(hero)',
    funFact: "Every app you've ever used relies on variables — from TikTok to Spotify.",
  },
  loops: {
    whyItMatters: "Want your hero to attack 10 enemies? Loops repeat code so you don't write the same line 10 times.",
    codePreview: "for i in range(5):\n    attack(enemy)",
    funFact: "Video game engines run a loop 60 times per second to animate everything on screen.",
  },
  conditions: {
    whyItMatters: "Games are all about decisions. If your hero has enough health, fight. Otherwise, retreat. That's conditions.",
    codePreview: 'if health > 50:\n    fight()\nelse:\n    heal()',
    funFact: "AI chatbots, game NPCs, and traffic lights all use conditional logic.",
  },
};

// Level-specific subtitles
const LEVEL_INTROS = {
  1: "Let's start with the basics",
  2: "Time to level up your skills",
  3: "Things are getting interesting",
  4: "You're becoming an expert",
  5: "The ultimate challenge awaits",
};

function ConceptIntro({ concept, levelData, heroName, heroColor, onStart }) {
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState(false);

  // Read intro from concept data first (extensible), fall back to hardcoded
  const content = concept?.intro || INTRO_CONTENT[concept?.id] || INTRO_CONTENT.variables;
  const levelIntro = LEVEL_INTROS[levelData?.level] || "Let's go!";

  // Inject hero name into code preview
  const codePreview = content.codePreview.replaceAll("{heroName}", heroName || "Hero");

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance first slide after a brief moment
  useEffect(() => {
    if (slide === 0) {
      const timer = setTimeout(() => setSlide(1), 2000);
      return () => clearTimeout(timer);
    }
  }, [slide]);

  const goNext = () => setSlide((prev) => Math.min(prev + 1, 3));
  const goPrev = () => setSlide((prev) => Math.max(prev - 1, 0));

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="max-w-lg w-full">

        {/* ============== SLIDE 0: What You'll Learn ============== */}
        {slide === 0 && (
          <div className="text-center animate-fade-in">
            {/* Concept icon */}
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${concept.color} text-white text-3xl font-mono font-bold mb-6`}>
              {concept.icon}
            </div>

            <h1 className="text-3xl font-extrabold text-gray-100 mb-2">
              {concept.title}
            </h1>
            <p className="text-gray-400 text-sm font-mono mb-1">
              Level {levelData.level} — {levelData.title}
            </p>
            <p className="text-gray-500 text-sm">
              {levelIntro}
            </p>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === slide ? `bg-gradient-to-r ${concept.color}` : "bg-gray-700"}`} />
              ))}
            </div>

            <button
              onClick={goNext}
              className="mt-6 text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors"
            >
              tap to continue →
            </button>
          </div>
        )}

        {/* ============== SLIDE 1: Why It Matters ============== */}
        {slide === 1 && (
          <div className="animate-fade-in">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Why it matters</span>
              <p className="text-xl text-gray-100 font-semibold mt-3 mb-4 leading-relaxed">
                {content.whyItMatters}
              </p>
              <div className="bg-[#0d1117] rounded-lg p-3 border border-[#30363d]">
                <span className="text-xs text-gray-500 font-mono">💡 Fun fact: </span>
                <span className="text-xs text-gray-400">{content.funFact}</span>
              </div>
            </div>

            {/* Dots + nav */}
            <div className="flex justify-center gap-2 mt-6">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === slide ? `bg-gradient-to-r ${concept.color}` : "bg-gray-700"}`} />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={goPrev} className="text-gray-600 hover:text-gray-400 text-sm font-mono transition-colors">← back</button>
              <button onClick={goNext} className="text-gray-400 hover:text-gray-200 text-sm font-mono transition-colors">next →</button>
            </div>
          </div>
        )}

        {/* ============== SLIDE 2: Code Preview ============== */}
        {slide === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-4">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Code preview</span>
              <p className="text-gray-300 text-sm mt-1">Here's a taste of what you'll be writing:</p>
            </div>

            {/* Code block */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                <span className="text-xs text-gray-500 ml-2 font-mono">preview.py</span>
              </div>
              <div className="p-4 font-mono text-sm leading-relaxed">
                {codePreview.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-gray-600 w-6 text-right mr-4 select-none">{i + 1}</span>
                    <span className="text-gray-300 whitespace-pre">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero mini-display */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <PixelHero color={heroColor || "#00d4ff"} size={40} animation="idle" />
              <span className="text-sm text-gray-400 font-mono">
                {heroName || "Hero"} is ready to learn!
              </span>
            </div>

            {/* Dots + nav */}
            <div className="flex justify-center gap-2 mt-4">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === slide ? `bg-gradient-to-r ${concept.color}` : "bg-gray-700"}`} />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={goPrev} className="text-gray-600 hover:text-gray-400 text-sm font-mono transition-colors">← back</button>
              <button onClick={goNext} className="text-gray-400 hover:text-gray-200 text-sm font-mono transition-colors">next →</button>
            </div>
          </div>
        )}

        {/* ============== SLIDE 3: Ready? ============== */}
        {slide === 3 && (
          <div className="text-center animate-fade-in">
            <div className="mb-6">
              <PixelHero color={heroColor || "#00d4ff"} size={80} animation="victory" />
            </div>

            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              Ready, {heroName || "Hero"}?
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {concept.title} — Level {levelData.level}: {levelData.title}
            </p>

            <button
              onClick={onStart}
              className={`bg-gradient-to-r ${concept.color} text-white font-bold px-10 py-4 rounded-2xl text-lg hover:shadow-lg hover:shadow-cyan-500/20 transform hover:scale-105 transition-all duration-200`}
            >
              Start Level →
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === slide ? `bg-gradient-to-r ${concept.color}` : "bg-gray-700"}`} />
              ))}
            </div>
            <button onClick={goPrev} className="mt-3 text-gray-600 hover:text-gray-400 text-sm font-mono transition-colors">← back</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConceptIntro;
