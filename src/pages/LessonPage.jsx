import { useState, useMemo, useCallback } from "react";
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
  calculateRewardScore,
  MODALITIES,
  REWARD_TYPES,
  SUPPORT_STRATEGIES,
} from "../mab/engine";
import { startSession, endSession, saveSession } from "../mab/sessionTracker";

/**
 * LESSON PAGE — v5 Single-MAB (Support Strategy only)
 * =====================================================
 * Desktop: Game scene on LEFT, code/questions on RIGHT
 * Mobile: Stacked vertically (game on top, code below)
 *
 * Only the support strategy is MAB-optimised (learning signal).
 * Modality and reward type are randomly assigned each session
 * to avoid confounding the learning signal.
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

  // ── MAB arm selection ────────────────────────────────────────────
  // Support strategy: MAB-optimised (learning signal)
  // Modality + reward type: randomly assigned to avoid confounding
  const { modality, rewardType, supportStrategy } = useMemo(() => {
    const savedSupportMAB = localStorage.getItem("kidcode_supportMAB");
    const supportMAB = savedSupportMAB ? JSON.parse(savedSupportMAB) : createMAB(SUPPORT_STRATEGIES, 0.3);

    return {
      modality: MODALITIES[Math.floor(Math.random() * MODALITIES.length)],
      rewardType: REWARD_TYPES[Math.floor(Math.random() * REWARD_TYPES.length)],
      supportStrategy: selectArm(supportMAB),
    };
  }, [conceptId, levelNum]); // eslint-disable-line react-hooks/exhaustive-deps

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [session] = useState(() => startSession(conceptId, levelNum, modality, rewardType, supportStrategy));
  const [sceneResult, setSceneResult] = useState(null);

  // ── Per-question tracking state ─────────────────────────────────
  const [attempts, setAttempts] = useState(0);       // attempts on current question
  const [hintCount, setHintCount] = useState(0);     // hints used on current question
  const [hintVisible, setHintVisible] = useState(false);
  const [showWorkedExample, setShowWorkedExample] = useState(
    supportStrategy === "worked_example_first"
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [stepScaffoldPhase, setStepScaffoldPhase] = useState(0); // for step_by_step_scaffold

  // Aggregate tracking
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalHints, setTotalHints] = useState(0);
  const [stepDetails, setStepDetails] = useState([]);

  // ── Hint text generator ─────────────────────────────────────────
  const getHintForStep = useCallback((step) => {
    // Use step-specific hint if provided (preferred)
    if (step.hint) return step.hint;
    if (step.explanation) {
      const firstSentence = step.explanation.split(".")[0] + ".";
      return firstSentence;
    }
    return "Think about what each line of code does, step by step.";
  }, []);

  // ── Worked example builder ───────────────────────────────────────
  // If step has a custom workedExample, use it.
  // Otherwise annotate the codeSnippet with the correct output.
  const getWorkedExample = useCallback((step) => {
    if (step.workedExample) return step.workedExample;
    const code = step.codeSnippet || "";
    const answer = step.options?.[step.correctIndex] ?? "";
    return `${code}\n# ↳ Output: ${answer}`;
  }, []);

  // ── Support strategy: should hint show initially? ───────────────
  const shouldShowHintInitially = supportStrategy === "hint_first";

  // ── Handle requesting a hint ────────────────────────────────────
  const requestHint = useCallback(() => {
    setHintVisible(true);
    setHintCount((prev) => prev + 1);
  }, []);

  // ── Handle answer ───────────────────────────────────────────────
  const handleAnswer = (chosenIndex) => {
    if (feedback !== null && supportStrategy !== "explain_after_error") return;

    // If we're showing explanation after error and user is retrying
    if (showExplanation) {
      setShowExplanation(false);
    }

    const step = levelData.steps[currentStep];
    const isCorrect = chosenIndex === step.correctIndex;
    const currentAttempt = attempts + 1;
    setAttempts(currentAttempt);
    setTotalAttempts((prev) => prev + 1);

    if (isCorrect) {
      const isFirstTry = currentAttempt === 1;
      if (isFirstTry) setFirstTryCount((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);

      // Calculate per-question reward score
      const reward = calculateRewardScore({
        correct: true,
        firstTry: isFirstTry,
        attempts: currentAttempt,
        hintCount,
      });

      // Record step detail
      setStepDetails((prev) => [...prev, {
        stepIndex: currentStep,
        correct: true,
        firstTry: isFirstTry,
        attempts: currentAttempt,
        hintCount,
        rewardScore: reward,
      }]);

      // Update support strategy MAB after each question
      const savedSupportMAB = localStorage.getItem("kidcode_supportMAB");
      const supportMAB = savedSupportMAB ? JSON.parse(savedSupportMAB) : createMAB(SUPPORT_STRATEGIES, 0.3);
      updateMAB(supportMAB, supportStrategy, reward);
      localStorage.setItem("kidcode_supportMAB", JSON.stringify(supportMAB));

      setFeedback("correct");
      setSceneResult("correct");
    } else {
      // Wrong answer handling depends on strategy
      if (supportStrategy === "explain_after_error" && currentAttempt === 1) {
        // Show explanation and let them retry (don't set feedback yet)
        setShowExplanation(true);
        setSceneResult("incorrect");
        return;
      }

      if (supportStrategy === "try_first_then_hint" && currentAttempt === 1 && !hintVisible) {
        // Auto-show hint after first wrong attempt
        setHintVisible(true);
        setHintCount((prev) => prev + 1);
        setTotalHints((prev) => prev + 1);
        setSceneResult("incorrect");
        // Don't lock in feedback — let them try again
        return;
      }

      // Record incorrect step detail
      setStepDetails((prev) => [...prev, {
        stepIndex: currentStep,
        correct: false,
        firstTry: false,
        attempts: currentAttempt,
        hintCount,
        rewardScore: 0,
      }]);

      // Update support MAB with 0 reward for incorrect
      const savedSupportMAB = localStorage.getItem("kidcode_supportMAB");
      const supportMAB = savedSupportMAB ? JSON.parse(savedSupportMAB) : createMAB(SUPPORT_STRATEGIES, 0.3);
      updateMAB(supportMAB, supportStrategy, 0);
      localStorage.setItem("kidcode_supportMAB", JSON.stringify(supportMAB));

      setFeedback("incorrect");
      setSceneResult("incorrect");
    }
  };

  // ── Handle next question ────────────────────────────────────────
  const handleNext = () => {
    if (currentStep < levelData.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setFeedback(null);
      setSceneResult(null);
      // Reset per-question state
      setAttempts(0);
      setHintCount(0);
      setHintVisible(supportStrategy === "hint_first");
      setShowWorkedExample(supportStrategy === "worked_example_first");
      setShowExplanation(false);
      setStepScaffoldPhase(0);
    } else {
      // ── Lesson complete: finalize session ──
      const avgReward = stepDetails.length > 0
        ? stepDetails.reduce((sum, d) => sum + d.rewardScore, 0) / stepDetails.length
        : 0;

      // Update session with final metrics
      session.correctCount = correctCount;
      session.totalSteps = levelData.steps.length;
      session.firstTryCount = firstTryCount;
      session.totalAttempts = totalAttempts;
      session.totalHints = totalHints;
      session.scaffoldUsed = supportStrategy === "step_by_step_scaffold";
      session.rewardScore = Math.round(avgReward * 100) / 100;
      session.stepDetails = stepDetails;

      const finalSession = endSession(session, true);
      saveSession(finalSession);

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

  // ── Support strategy UI elements ────────────────────────────────
  const strategyBadgeColor = {
    worked_example_first:  "text-amber-400 bg-amber-500/10 border-amber-500/20",
    hint_first:            "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    try_first_then_hint:   "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    step_by_step_scaffold: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    explain_after_error:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  }[supportStrategy] || "text-gray-400 bg-gray-500/10 border-gray-500/20";

  const strategyShortLabel = {
    worked_example_first:  "EXAMPLE FIRST",
    hint_first:            "HINT FIRST",
    try_first_then_hint:   "TRY → HINT",
    step_by_step_scaffold: "SCAFFOLD",
    explain_after_error:   "EXPLAIN ON ERROR",
  }[supportStrategy] || "STANDARD";

  // Can the learner retry this question? (depends on strategy)
  const canRetry = feedback === null && (
    (supportStrategy === "try_first_then_hint" && attempts > 0 && attempts < 3) ||
    (supportStrategy === "explain_after_error" && showExplanation)
  );

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
        {/* LEFT: Game Scene — takes 55% for prominence */}
        <div className="lg:w-[55%] flex flex-col">
          <GameScene
            sceneId={sceneId}
            result={sceneResult}
            hero={hero}
            gameAction={step.gameAction}
            sceneConfig={step.sceneConfig}
          />
        </div>

        {/* RIGHT: Learning Description + Code Challenge */}
        <div className="lg:w-[45%] flex flex-col gap-4">
          {/* Learning context card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            {/* Worked Example (shown before question for worked_example_first) */}
            {showWorkedExample && step.codeSnippet && (
              <div className="mb-3 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                <p className="text-amber-400 text-[10px] font-mono uppercase tracking-wider mb-2">Worked Example</p>
                <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {getWorkedExample(step)}
                </pre>
                <button
                  onClick={() => setShowWorkedExample(false)}
                  className="mt-2 text-amber-400 text-xs font-mono hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Got it, show question →
                </button>
              </div>
            )}

            {/* Step-by-step scaffold guidance — concept-aware */}
            {supportStrategy === "step_by_step_scaffold" && feedback === null && (
              <div className="mb-3 bg-violet-500/5 border border-violet-500/20 rounded-lg p-3">
                <p className="text-violet-400 text-[10px] font-mono uppercase tracking-wider mb-1">Step-by-Step Guide</p>
                <p className="text-gray-400 text-xs">
                  {conceptId === "variables" && stepScaffoldPhase === 0 && "Step 1: Read each line top to bottom. What value does each variable end up holding?"}
                  {conceptId === "variables" && stepScaffoldPhase === 1 && "Step 2: Find the print() call. What variable or expression is inside it?"}
                  {conceptId === "variables" && stepScaffoldPhase === 2 && "Step 3: What value was stored in that variable when print() ran? Select your answer."}
                  {conceptId === "loops" && stepScaffoldPhase === 0 && "Step 1: What does range() or the list contain? Count how many times the loop will run."}
                  {conceptId === "loops" && stepScaffoldPhase === 1 && "Step 2: What happens inside the loop each iteration? Track any variables that change."}
                  {conceptId === "loops" && stepScaffoldPhase === 2 && "Step 3: Based on all iterations, what is the final output? Select your answer."}
                  {conceptId === "conditions" && stepScaffoldPhase === 0 && "Step 1: What values are the variables assigned to?"}
                  {conceptId === "conditions" && stepScaffoldPhase === 1 && "Step 2: Evaluate the condition — is it True or False with those values?"}
                  {conceptId === "conditions" && stepScaffoldPhase === 2 && "Step 3: Which branch runs (if or else)? Select the correct output."}
                </p>
                {stepScaffoldPhase < 2 && (
                  <button
                    onClick={() => setStepScaffoldPhase((p) => p + 1)}
                    className="mt-1 text-violet-400 text-xs font-mono hover:text-violet-300 transition-colors cursor-pointer"
                  >
                    Next step →
                  </button>
                )}
              </div>
            )}

            {/* Explanation after error */}
            {showExplanation && step.explanation && (
              <div className="mb-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-emerald-400 text-[10px] font-mono uppercase tracking-wider mb-1">Let&apos;s Review</p>
                <p className="text-gray-300 text-xs leading-relaxed">{step.explanation}</p>
                <p className="text-emerald-400 text-xs font-mono mt-2">Try again with this in mind ↓</p>
              </div>
            )}

            {/* Story context */}
            {step.storyContext && !showWorkedExample && (
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {step.storyContext}
              </p>
            )}
            {/* Instruction */}
            {!step.storyContext && !showWorkedExample && (
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {step.instruction}
              </p>
            )}

            {/* Hint box (visible based on strategy or user request) */}
            {(hintVisible || shouldShowHintInitially) && !showWorkedExample && (
              <div className="mb-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2.5">
                <p className="text-yellow-400 text-[10px] font-mono uppercase tracking-wider mb-1">Hint</p>
                <p className="text-gray-400 text-xs">{getHintForStep(step)}</p>
              </div>
            )}

            {/* Badges: modality + strategy */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {modalityLabel}
              </span>
              <span className={`text-[10px] font-mono ${strategyBadgeColor} border px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                {strategyShortLabel}
              </span>
              {step.storyContext && (
                <span className="text-gray-500 text-xs">{step.instruction}</span>
              )}
            </div>

            {/* Hint request button (for try_first strategies) */}
            {!hintVisible && !shouldShowHintInitially && feedback === null && !showWorkedExample && (
              <button
                onClick={() => { requestHint(); setTotalHints((p) => p + 1); }}
                className="mt-2 text-yellow-500/60 text-xs font-mono hover:text-yellow-400 transition-colors cursor-pointer"
              >
                Need a hint?
              </button>
            )}
          </div>

          {/* Code challenge */}
          <div className="flex-1">
            <ModeComponent
              step={step}
              onAnswer={handleAnswer}
              feedback={canRetry ? null : feedback}
              hero={hero}
            />
          </div>

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
