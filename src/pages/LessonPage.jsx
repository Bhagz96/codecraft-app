import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import lessons from "../data/lessons";
import StoryMode from "../components/StoryMode";
import PuzzleMode from "../components/PuzzleMode";
import ChallengeMode from "../components/ChallengeMode";
import {
  createMAB,
  selectArm,
  updateMAB,
  MODALITIES,
  REWARD_TYPES,
} from "../mab/engine";
import { startSession, endSession, saveSession } from "../mab/sessionTracker";

/**
 * LESSON PAGE
 * ===========
 * The main learning experience. This is where kids actually do the lessons.
 *
 * Flow:
 * 1. MAB engine picks a teaching modality and reward type
 * 2. The lesson steps are shown one at a time in that modality
 * 3. Child answers each step, gets feedback
 * 4. After all steps → navigate to reward page
 *
 * The MAB selection and session tracking happen invisibly — the child
 * just sees a fun lesson in whatever mode was picked for them.
 */
function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  // Find the lesson data
  const lesson = lessons.find((l) => l.id === lessonId);

  // MAB picks modality and reward type for this session
  // useMemo ensures these are picked once when the page loads, not on every re-render
  const { modality, rewardType } = useMemo(() => {
    // Load or create MAB instances from localStorage
    const savedModalityMAB = localStorage.getItem("kidcode_modalityMAB");
    const savedRewardMAB = localStorage.getItem("kidcode_rewardMAB");

    const modalityMAB = savedModalityMAB
      ? JSON.parse(savedModalityMAB)
      : createMAB(MODALITIES, 0.3); // 30% exploration rate to start

    const rewardMAB = savedRewardMAB
      ? JSON.parse(savedRewardMAB)
      : createMAB(REWARD_TYPES, 0.3);

    // Let the MAB choose
    const chosenModality = selectArm(modalityMAB);
    const chosenReward = selectArm(rewardMAB);

    return { modality: chosenModality, rewardType: chosenReward };
  }, [lessonId]);

  // Track which step we're on (0, 1, 2)
  const [currentStep, setCurrentStep] = useState(0);
  // Track feedback state for current step
  const [feedback, setFeedback] = useState(null);
  // Track how many questions the child got right
  const [correctCount, setCorrectCount] = useState(0);
  // Session tracking
  const [session] = useState(() => startSession(lessonId, modality, rewardType));

  // Handle when the child picks an answer
  const handleAnswer = (chosenIndex) => {
    if (feedback !== null) return; // Already answered

    const step = lesson.steps[currentStep];
    const isCorrect = chosenIndex === step.correctIndex;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    setFeedback(isCorrect ? "correct" : "incorrect");
  };

  // Handle moving to the next step (or finishing)
  const handleNext = () => {
    if (currentStep < lesson.steps.length - 1) {
      // Go to next step
      setCurrentStep((prev) => prev + 1);
      setFeedback(null);
    } else {
      // Lesson complete! Save session and go to rewards
      const completed = true;
      const finalSession = endSession(session, completed);
      saveSession(finalSession);

      // Update MAB with reward (1 for completed, scaled by correctness)
      const reward = correctCount / lesson.steps.length;

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

      // Navigate to reward page with the reward type
      navigate("/reward", {
        state: {
          rewardType,
          lessonTitle: lesson.title,
          correctCount,
          totalSteps: lesson.steps.length,
        },
      });
    }
  };

  // If lesson not found, show error
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">Oops! Lesson not found 😕</p>
          <Link to="/" className="text-purple-600 underline text-lg">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const step = lesson.steps[currentStep];

  // Pick the right component based on the MAB-selected modality
  const ModeComponent =
    modality === "story"
      ? StoryMode
      : modality === "puzzle"
        ? PuzzleMode
        : ChallengeMode;

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Top bar: back button, lesson title, progress */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 font-medium text-lg"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            {lesson.icon} {lesson.title}
          </h1>
          <span className="text-sm text-gray-500">
            {currentStep + 1} / {lesson.steps.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{
              width: `${((currentStep + (feedback !== null ? 1 : 0)) / lesson.steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* The lesson content — rendered by the selected modality component */}
      <ModeComponent step={step} onAnswer={handleAnswer} feedback={feedback} />

      {/* Next button — only shown after answering */}
      {feedback !== null && (
        <div className="max-w-2xl mx-auto mt-6 text-center">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl px-10 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {currentStep < lesson.steps.length - 1
              ? "Next Question →"
              : "Get My Reward! 🎁"}
          </button>
        </div>
      )}
    </div>
  );
}

export default LessonPage;
