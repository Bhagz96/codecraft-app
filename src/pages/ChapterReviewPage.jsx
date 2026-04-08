/**
 * CHAPTER REVIEW PAGE (Beta)
 * ==========================
 * End-of-concept assessment shown after all 5 lessons of a concept are complete.
 *
 * Rules:
 *  - NO hints, NO worked examples, NO scaffolding, NO explanations
 *  - One representative question per level (last step of each level)
 *  - Records performance to Supabase sessions table (support_strategy = "review")
 *  - Marks the concept as reviewed in progress tracking
 *
 * Purpose: measure how users assigned to different instruction modes perform
 * after completing their full concept journey.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import lessons from "../data/lessons";
import { injectHeroIntoLevel } from "../data/lessonTemplates";
import { getHero } from "../data/hero";
import { completeReview } from "../data/progress";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useAudio } from "../hooks/useAudio";
import { AudioControl } from "../components/AudioControl";

// Pick the representative question from each level:
// last step (most complex) of each level's steps array.
function buildReviewQuestions(concept) {
  return concept.levels.map((lvl) => {
    const step = lvl.steps[lvl.steps.length - 1];
    return {
      levelNum: lvl.level,
      levelTitle: lvl.title,
      ...step,
    };
  });
}

function ChapterReviewPage() {
  const { conceptId } = useParams();
  const navigate = useNavigate();
  const { user, instructionMode } = useAuth();
  const { startMusic, isMuted, toggleMute, musicVolume, setMusicVolume } = useAudio();

  const concept = lessons.find((l) => l.id === conceptId);
  const hero = getHero();
  const heroName = hero?.name || "Hero";

  const rawQuestions = concept ? buildReviewQuestions(concept) : [];
  // Inject hero name into question text
  const questions = rawQuestions.map((q) => ({
    ...q,
    instruction: q.instruction?.replace(/\{heroName\}/g, heroName) ?? q.instruction,
    traceQuestion: q.traceQuestion?.replace(/\{heroName\}/g, heroName) ?? q.traceQuestion,
  }));

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState([]); // { correct: bool, firstTry: bool }
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => { startMusic("mystery"); }, [isMuted, startMusic]);

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-gray-400 font-mono">
        // concept not found
      </div>
    );
  }

  const question = questions[current];
  const totalQ = questions.length;
  const progressPct = Math.round((current / totalQ) * 100);

  function handleSelect(idx) {
    if (locked) return;
    setSelected(idx);
    setLocked(true);
    const isCorrect = idx === question.correctIndex;
    setResults((prev) => [...prev, { correct: isCorrect, firstTry: true }]);
  }

  function handleNext() {
    if (current < totalQ - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setLocked(false);
    } else {
      finishReview();
    }
  }

  function finishReview() {
    const correctCount = results.filter((r) => r.correct).length + (selected === question.correctIndex ? 1 : 0);
    const totalSteps = totalQ;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    // Mark as reviewed in localStorage + Supabase
    completeReview(conceptId);

    // Save review session to Supabase sessions table
    if (supabase && user) {
      const sessionRecord = {
        user_id: user.id,
        concept_id: conceptId,
        level: 0,           // sentinel: 0 = chapter review
        modality: "review",
        support_strategy: "review",
        completed: true,
        correct_count: correctCount,
        total_steps: totalSteps,
        first_try_count: correctCount,
        total_attempts: totalSteps,
        total_hints: 0,
        scaffold_used: false,
        reward_score: totalSteps > 0 ? +(correctCount / totalSteps).toFixed(3) : 0,
        time_spent: timeSpent,
        timestamp: new Date().toISOString(),
      };
      supabase.from("sessions").insert(sessionRecord).then(() => {}, () => {});
    }

    setDone(true);
  }

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    const pct = Math.round((correct / totalQ) * 100);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] px-4 py-12">
        <AudioControl isMuted={isMuted} onToggle={toggleMute} volume={musicVolume} onVolumeChange={setMusicVolume} />
        <div className="max-w-lg w-full text-center">
          <div className="text-6xl mb-6">{pct === 100 ? "🏆" : pct >= 60 ? "⭐" : "📚"}</div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-2 font-mono">
            {concept.title} Review Complete
          </h1>
          <p className="text-gray-400 font-mono text-sm mb-8">
            {pct === 100 ? "Perfect score! Concept fully mastered." : pct >= 60 ? "Good work! Solid understanding." : "Keep practising — revisit the lessons to strengthen your knowledge."}
          </p>

          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8">
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-1">
              {correct}/{totalQ}
            </div>
            <div className="text-gray-500 font-mono text-sm">{pct}% correct</div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Back to Quest →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <AudioControl isMuted={isMuted} onToggle={toggleMute} volume={musicVolume} onVolumeChange={setMusicVolume} />

      {/* Header */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-violet-400 font-mono text-xs uppercase tracking-widest">Chapter Review</span>
            <h2 className="text-lg font-bold text-gray-100 font-mono">{concept.title}</h2>
          </div>
          <span className="text-gray-500 font-mono text-sm">{current + 1} / {totalQ}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-[#30363d] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 font-mono mt-1">
          Level {question.levelNum}: {question.levelTitle} — no hints available
        </p>
      </div>

      {/* Question card */}
      <div className="w-full max-w-2xl">
        {/* Instruction */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 mb-4">
          <p className="text-gray-200 font-mono text-sm leading-relaxed">
            {question.traceQuestion || question.instruction}
          </p>
        </div>

        {/* Code snippet (shown for all questions in review) */}
        {question.codeSnippet && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 mb-4 font-mono text-sm">
            <div className="flex gap-1.5 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-gray-600 text-xs ml-2">review.py</span>
            </div>
            <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap text-xs">
              {question.codeSnippet.replace(/\{heroName\}/g, heroName)}
            </pre>
          </div>
        )}

        {/* Answer options */}
        <div className="flex flex-col gap-3">
          {question.options?.map((opt, idx) => {
            let style = "bg-[#161b22] border border-[#30363d] text-gray-200 hover:border-violet-500/50 cursor-pointer";
            if (locked) {
              if (idx === question.correctIndex) style = "bg-green-500/15 border border-green-500 text-green-300";
              else if (idx === selected) style = "bg-red-500/15 border border-red-500 text-red-300";
              else style = "bg-[#161b22] border border-[#30363d] text-gray-600";
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl font-mono text-sm transition-all duration-150 ${style}`}
              >
                {opt.replace?.(/\{heroName\}/g, heroName) ?? opt}
              </button>
            );
          })}
        </div>

        {/* No hint / no explanation — assessment only */}
        {locked && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-200 font-mono text-sm cursor-pointer"
            >
              {current < totalQ - 1 ? "Next →" : "Finish Review →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterReviewPage;
