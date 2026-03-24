import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import lessons from "../data/lessons";
import { completeLevel } from "../data/progress";
import CodeSimulation from "../components/CodeSimulation";
import DragDropBuilder from "../components/DragDropBuilder";
import SpeedCoding from "../components/SpeedCoding";
import {
  createMAB,
  selectArm,
  updateMAB,
  MODALITIES,
  REWARD_TYPES,
} from "../mab/engine";
import { startSession, endSession, saveSession } from "../mab/sessionTracker";

/**
 * LESSON PAGE — Version 2
 * =======================
 * Plays a specific concept at a specific difficulty level.
 *
 * URL: /lesson/:conceptId/:level
 * Example: /lesson/variables/2
 *
 * Flow:
 * 1. MAB picks a teaching modality and reward type
 * 2. Steps are shown one at a time in that modality
 * 3. User answers each step, gets feedback
 * 4. After all steps → navigate to reward page
 */
function LessonPage() {
  const { conceptId, level } = useParams();
  const levelNum = parseInt(level, 10);
  const navigate = useNavigate();

  // Find the concept and level data
  const concept = lessons.find((l) => l.id === conceptId);
  const levelData = concept?.levels?.find((l) => l.level === levelNum);

  // MAB picks modality and reward type for this session
  const { modality, rewardType } = useMemo(() => {
    const savedModalityMAB = localStorage.getItem("kidcode_modalityMAB");
    const savedRewardMAB = localStorage.getItem("kidcode_rewardMAB");

    const modalityMAB = savedModalityMAB
      ? JSON.parse(savedModalityMAB)
      : createMAB(MODALITIES, 0.3);

    const rewardMAB = savedRewardMAB
      ? JSON.parse(savedRewardMAB)
      : createMAB(REWARD_TYPES, 0.3);

    const chosenModality = selectArm(modalityMAB);
    const chosenReward = selectArm(rewardMAB);

    return { modality: chosenModality, rewardType: chosenReward };
  }, [conceptId, levelNum]);

  // Track which step we're on
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [session] = useState(() =>
    startSession(conceptId, levelNum, modality, rewardType)
  );

  // Handle when the user picks an answer
  const handleAnswer = (chosenIndex) => {
    if (feedback !== null) return;

    const step = levelData.steps[currentStep];
    const isCorrect = chosenIndex === step.correctIndex;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    setFeedback(isCorrect ? "correct" : "incorrect");
  };

  // Handle moving to the next step or finishing
  const handleNext = () => {
    if (currentStep < levelData.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setFeedback(null);
    } else {
      // Level complete!
      const completed = true;
      const finalSession = endSession(session, completed);
      saveSession(finalSession);

      // Update MAB
      const reward = correctCount / levelData.steps.length;

      const savedModalityMAB = localStorage.getItem("kidcode_modalityMAB");
      const savedRewardMAB = localStorage.getItem("kidcode_rewardMAB");

      const modalityMAB = savedModalityMAB
        ? JSON.parse(savedModalityMAB)
        : createMAB(MODALITIES, 0.3);
      const rewardMAB = savedRewardMAB
        ? JSON.parse(savedRewardMAB)
        : createMAB(REWARD_TYPES, 0.3);

      updateMAB(modalityMAB, modality, reward);
      updateMAB(rewardMAB, rewardType, reward);

      localStorage.setItem("kidcode_modalityMAB", JSON.stringify(modalityMAB));
      localStorage.setItem("kidcode_rewardMAB", JSON.stringify(rewardMAB));

      // Mark level complete in progress system
      completeLevel(conceptId, levelNum);

      // Navigate to reward page
      navigate("/reward", {
        state: {
          rewardType,
          conceptTitle: concept.title,
          levelTitle: levelData.title,
          levelNum,
          correctCount,
          totalSteps: levelData.steps.length,
          conceptId,
        },
      });
    }
  };

  // Error state: concept or level not found
  if (!concept || !levelData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4 font-mono">
            // 404 — level not found
          </p>
          <Link
            to="/"
            className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
          >
            cd /home →
          </Link>
        </div>
      </div>
    );
  }

  const step = levelData.steps[currentStep];

  // Pick the right component based on MAB-selected modality
  const ModeComponent =
    modality === "codeSimulation"
      ? CodeSimulation
      : modality === "dragDrop"
        ? DragDropBuilder
        : SpeedCoding;

  // Modality display labels
  const modalityLabels = {
    codeSimulation: "Code Simulation",
    dragDrop: "Drag & Drop",
    speedCoding: "Speed Coding",
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Top bar */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-300 font-mono text-sm transition-colors"
          >
            ← back
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-200">
              <span
                className={`font-mono text-transparent bg-clip-text bg-gradient-to-r ${concept.color}`}
              >
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
            style={{
              width: `${((currentStep + (feedback !== null ? 1 : 0)) / levelData.steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Lesson content — rendered by the selected modality */}
      <ModeComponent step={step} onAnswer={handleAnswer} feedback={feedback} />

      {/* Next button — only shown after answering */}
      {feedback !== null && (
        <div className="max-w-3xl mx-auto mt-6 text-center">
          <button
            onClick={handleNext}
            className={`bg-gradient-to-r ${concept.color} text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
          >
            {currentStep < levelData.steps.length - 1
              ? "Next →"
              : "Claim Reward →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default LessonPage;
