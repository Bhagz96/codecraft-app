import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import lessons from "../data/lessons";
import { completeLevel } from "../data/progress";
import { getHero, awardXP } from "../data/hero";
import { injectHeroIntoLevel } from "../data/lessonTemplates";
import CodeSimulation from "../components/CodeSimulation";
import DragDropBuilder from "../components/DragDropBuilder";
import SpeedCoding from "../components/SpeedCoding";
import ConceptIntro from "../components/ConceptIntro";
import GameScene from "../components/game/GameScene";
import {
  createMAB,
  selectArm,
  updateMAB,
  MODALITIES,
  REWARD_TYPES,
} from "../mab/engine";
import { startSession, endSession, saveSession } from "../mab/sessionTracker";

/**
 * LESSON PAGE — v3 Side-by-Side Layout
 * ======================================
 * Desktop: Game scene on LEFT, code/questions on RIGHT
 * Mobile: Stacked vertically (game on top, code below)
 */

function getSceneId(conceptId, level) {
  if (conceptId === "variables") return level === 1 ? "hero-spawn" : "mountain-camp";
  if (conceptId === "loops") return "mountain-trail";
  if (conceptId === "conditions") return "mountain-obstacle";
  return "hero-spawn";
}

function LessonPage() {
  const { conceptId, level } = useParams();
  const levelNum = parseInt(level, 10);
  const navigate = useNavigate();

  const concept = lessons.find((l) => l.id === conceptId);
  const rawLevelData = concept?.levels?.find((l) => l.level === levelNum);

  const [hero, setHero] = useState(() => getHero());

  const levelData = useMemo(
    () => injectHeroIntoLevel(rawLevelData, hero),
    [rawLevelData, hero]
  );

  const [showIntro, setShowIntro] = useState(true);

  const { modality, rewardType } = useMemo(() => {
    const savedModalityMAB = localStorage.getItem("kidcode_modalityMAB");
    const savedRewardMAB = localStorage.getItem("kidcode_rewardMAB");
    const modalityMAB = savedModalityMAB ? JSON.parse(savedModalityMAB) : createMAB(MODALITIES, 0.3);
    const rewardMAB = savedRewardMAB ? JSON.parse(savedRewardMAB) : createMAB(REWARD_TYPES, 0.3);
    return { modality: selectArm(modalityMAB), rewardType: selectArm(rewardMAB) };
  }, [conceptId, levelNum]);

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [session] = useState(() => startSession(conceptId, levelNum, modality, rewardType));
  const [sceneResult, setSceneResult] = useState(null);

  const handleAnswer = (chosenIndex) => {
    if (feedback !== null) return;
    const step = levelData.steps[currentStep];
    const isCorrect = chosenIndex === step.correctIndex;
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    const result = isCorrect ? "correct" : "incorrect";
    setFeedback(result);
    setSceneResult(result);
  };

  const handleNext = () => {
    if (currentStep < levelData.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setFeedback(null);
      setSceneResult(null);
    } else {
      const finalSession = endSession(session, true);
      saveSession(finalSession);

      const reward = correctCount / levelData.steps.length;
      const savedModalityMAB = localStorage.getItem("kidcode_modalityMAB");
      const savedRewardMAB = localStorage.getItem("kidcode_rewardMAB");
      const modalityMAB = savedModalityMAB ? JSON.parse(savedModalityMAB) : createMAB(MODALITIES, 0.3);
      const rewardMAB = savedRewardMAB ? JSON.parse(savedRewardMAB) : createMAB(REWARD_TYPES, 0.3);
      updateMAB(modalityMAB, modality, reward);
      updateMAB(rewardMAB, rewardType, reward);
      localStorage.setItem("kidcode_modalityMAB", JSON.stringify(modalityMAB));
      localStorage.setItem("kidcode_rewardMAB", JSON.stringify(rewardMAB));

      completeLevel(conceptId, levelNum);
      const xpAmount = correctCount * 20 + levelNum * 10;
      const updatedHero = awardXP(xpAmount);
      setHero(updatedHero);

      navigate("/reward", {
        state: {
          rewardType,
          conceptTitle: concept.title,
          levelTitle: levelData.title,
          levelNum,
          correctCount,
          totalSteps: levelData.steps.length,
          conceptId,
          xpEarned: xpAmount,
          completion: levelData.completion || null,
        },
      });
    }
  };

  // Error state
  if (!concept || !levelData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4 font-mono">// 404 — level not found</p>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors">cd /home →</Link>
        </div>
      </div>
    );
  }

  // Concept intro
  if (showIntro) {
    return (
      <ConceptIntro
        concept={concept}
        levelData={levelData}
        heroName={hero?.name}
        heroColor={hero?.color}
        onStart={() => setShowIntro(false)}
      />
    );
  }

  const rawStep = levelData.steps[currentStep];
  const step = {
    ...rawStep,
    instruction: rawStep.instructions?.[modality] || rawStep.instruction,
  };

  const sceneId = levelData.sceneId || getSceneId(conceptId, levelNum);

  const ModeComponent =
    modality === "codeSimulation" ? CodeSimulation
    : modality === "dragDrop" ? DragDropBuilder
    : SpeedCoding;

  const modalityLabel = {
    codeSimulation: "CODE SIMULATION",
    dragDrop: "DRAG & DROP",
    speedCoding: "SPEED CODING",
  }[modality] || "CHALLENGE";

  return (
    <div className="min-h-screen px-4 py-4 lg:py-6">
      {/* Top bar — full width */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex items-center justify-between mb-3">
          <Link to="/" className="text-gray-500 hover:text-gray-300 font-mono text-sm transition-colors">
            ← back
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-200">
              <span className={`font-mono text-transparent bg-clip-text bg-gradient-to-r ${concept.color}`}>
                {concept.icon}
              </span>{" "}
              {concept.title}
            </h1>
            <p className="text-xs text-gray-500 font-mono">
              Level {levelNum} — {levelData.title}
            </p>
          </div>
          <span className="text-sm text-gray-500 font-mono">
            {currentStep + 1}/{levelData.steps.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-[#161b22] rounded-full h-2 overflow-hidden border border-[#30363d]">
          <div
            className={`h-full bg-gradient-to-r ${concept.color} rounded-full transition-all duration-500`}
            style={{ width: `${((currentStep + (feedback !== null ? 1 : 0)) / levelData.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* === SIDE-BY-SIDE LAYOUT === */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* LEFT: Game Scene */}
        <div className="lg:w-1/2 flex flex-col">
          <GameScene
            sceneId={sceneId}
            result={sceneResult}
            hero={hero}
            gameAction={step.gameAction}
            sceneConfig={step.sceneConfig}
          />
        </div>

        {/* RIGHT: Learning Description + Code Challenge */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          {/* Learning context card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            {/* Story context */}
            {step.storyContext && (
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {step.storyContext}
              </p>
            )}
            {/* Explanation hint (shown before answering) */}
            {!step.storyContext && (
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {step.instruction}
              </p>
            )}

            {/* Modality badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {modalityLabel}
              </span>
              {step.storyContext && (
                <span className="text-gray-500 text-xs">{step.instruction}</span>
              )}
            </div>
          </div>

          {/* Code challenge */}
          <div className="flex-1">
            <ModeComponent
              step={step}
              onAnswer={handleAnswer}
              feedback={feedback}
              hero={hero}
            />
          </div>

          {/* Explanation (after answering) */}
          {feedback !== null && step.explanation && (
            <div className={`rounded-xl p-4 border ${
              feedback === "correct"
                ? "bg-green-500/5 border-green-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}>
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className={`font-bold ${feedback === "correct" ? "text-green-400" : "text-red-400"}`}>
                  {feedback === "correct" ? "Correct! " : "Not quite. "}
                </span>
                {step.explanation}
              </p>
            </div>
          )}

          {/* Next button */}
          {feedback !== null && (
            <div className="text-center lg:text-right">
              <button
                onClick={handleNext}
                className={`bg-gradient-to-r ${concept.color} text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer`}
              >
                {currentStep < levelData.steps.length - 1 ? "Next →" : "Claim Reward →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
