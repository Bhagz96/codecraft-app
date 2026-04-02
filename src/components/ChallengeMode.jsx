import { useState, useEffect, useMemo } from "react";
import { shuffleOptions } from "../utils/shuffleOptions";

/**
 * CHALLENGE MODE COMPONENT
 * ========================
 * Presents the lesson step as a timed game.
 * A countdown timer adds urgency and a scoring element.
 * Kids earn more points for answering faster.
 *
 * Props:
 *   step       – the current lesson step object
 *   onAnswer   – callback when the child picks an option (receives the index)
 *   feedback   – null, "correct", or "incorrect"
 */

const TIME_LIMIT = 15; // seconds per question

function ChallengeMode({ step, onAnswer, feedback }) {
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);

  // Shuffle once per step so the correct answer isn't always option 1
  const { shuffledOptions, newCorrectIndex, indexMap } = useMemo(
    () => shuffleOptions(step.options, step.correctIndex),
    [step] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Countdown timer — runs when feedback is null (question is active)
  useEffect(() => {
    if (feedback !== null) return; // Stop timer when answered

    // Reset timer for each new question
    setTimeLeft(TIME_LIMIT);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up — auto-submit wrong answer
          onAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up timer when component unmounts or feedback changes
    return () => clearInterval(timer);
  }, [step, feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate score when correct
  useEffect(() => {
    if (feedback === "correct") {
      // More points for faster answers (max 100 points)
      const points = Math.round((timeLeft / TIME_LIMIT) * 100);
      setScore((prev) => prev + points);
    }
  }, [feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer bar colour changes as time runs out
  const timerColor =
    timeLeft > 10 ? "bg-green-500" : timeLeft > 5 ? "bg-yellow-500" : "bg-red-500";

  const timerWidth = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Challenge header with score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-4xl">⚡</span>
          <span className="bg-orange-100 text-orange-700 font-bold px-4 py-1 rounded-full text-sm">
            CHALLENGE MODE
          </span>
        </div>
        <div className="bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-full">
          Score: {score}
        </div>
      </div>

      {/* Timer bar */}
      {feedback === null && (
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`}
              style={{ width: `${timerWidth}%` }}
            />
          </div>
          <p className="text-center text-gray-500 text-sm mt-1">
            {timeLeft} seconds left!
          </p>
        </div>
      )}

      {/* Question */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 mb-6 border-2 border-orange-200">
        <p className="text-gray-800 font-bold text-xl text-center">
          {step.instruction}
        </p>
      </div>

      {/* Options — styled like game buttons */}
      <div className="grid grid-cols-1 gap-3">
        {shuffledOptions.map((option, index) => {
          let buttonStyle =
            "bg-white hover:bg-orange-50 border-2 border-orange-300 hover:border-orange-500 text-gray-800";

          if (feedback !== null) {
            if (index === newCorrectIndex) {
              buttonStyle = "bg-green-200 border-2 border-green-500 text-green-800";
            } else {
              buttonStyle = "bg-gray-100 border-2 border-gray-200 text-gray-400";
            }
          }

          return (
            <button
              key={index}
              onClick={() => feedback === null && onAnswer(indexMap[index])}
              disabled={feedback !== null}
              className={`
                w-full p-4 rounded-xl text-lg font-bold
                transition-all duration-150 text-left
                ${buttonStyle}
                ${feedback === null ? "cursor-pointer active:scale-95" : "cursor-default"}
              `}
            >
              <span className="mr-2 inline-block w-8 h-8 rounded-full bg-orange-200 text-orange-800 text-center leading-8 text-sm font-bold">
                {index + 1}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback with score earned */}
      {feedback !== null && (
        <div
          className={`mt-6 p-5 rounded-2xl text-center ${
            feedback === "correct"
              ? "bg-green-50 border-2 border-green-300"
              : "bg-orange-50 border-2 border-orange-300"
          }`}
        >
          {feedback === "correct" && (
            <p className="text-2xl font-bold text-green-600 mb-2">
              +{Math.round((timeLeft / TIME_LIMIT) * 100)} points!
            </p>
          )}
          <p className="text-lg font-medium">
            {feedback === "correct" ? "🏆 " : "⏰ "}
            {step.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default ChallengeMode;
