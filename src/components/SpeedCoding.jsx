/**
 * SPEED CODING MODE
 * =================
 * Fill-in-the-blank code completion under time pressure with streak bonuses.
 *
 * Displays a code template with blanks. User selects chips to fill them.
 * Timer counts down, streak multiplier rewards consecutive correct answers.
 *
 * Props:
 *   step       – the current lesson step object
 *   onAnswer   – callback when user submits (receives correctIndex if correct, -1 if wrong)
 *   feedback   – null, "correct", or "incorrect"
 */

import { useState, useEffect, useRef } from "react";

const TIME_LIMIT = 20; // seconds per question

function SpeedCoding({ step, onAnswer, feedback }) {
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedBlanks, setSelectedBlanks] = useState({});
  const timerRef = useRef(null);

  // Get blanks from step data, or fall back to simple mode
  const blanks = step.blanks || [];
  const hasBlankMode = blanks.length > 0 && step.codeTemplate;

  // Countdown timer
  useEffect(() => {
    if (feedback !== null) return;

    setTimeLeft(TIME_LIMIT);
    setSelectedBlanks({});

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onAnswer(-1); // Time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [step, feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update score on correct answer
  useEffect(() => {
    if (feedback === "correct") {
      const multiplier = Math.min(streak + 1, 5);
      const points = Math.round((timeLeft / TIME_LIMIT) * 100) * multiplier;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
    } else if (feedback === "incorrect") {
      setStreak(0);
    }
  }, [feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle selecting an option for a blank
  const handleBlankSelect = (blankIndex, optionIndex) => {
    if (feedback !== null) return;
    setSelectedBlanks((prev) => ({ ...prev, [blankIndex]: optionIndex }));
  };

  // Handle submitting all blanks
  const handleSubmit = () => {
    if (feedback !== null) return;

    if (hasBlankMode) {
      // Check all blanks are filled and correct
      const allCorrect = blanks.every(
        (blank, i) => selectedBlanks[i] === blank.correctIndex
      );
      const allFilled = blanks.every((_, i) => selectedBlanks[i] !== undefined);

      if (!allFilled) return; // Don't submit until all blanks are filled

      clearInterval(timerRef.current);
      onAnswer(allCorrect ? step.correctIndex : -1);
    }
  };

  // Handle clicking a standard option (fallback for simple steps)
  const handleOptionClick = (index) => {
    if (feedback !== null) return;
    clearInterval(timerRef.current);
    onAnswer(index);
  };

  // Timer colour
  const timerColor =
    timeLeft > 14 ? "bg-green-500" : timeLeft > 7 ? "bg-yellow-500" : "bg-red-500";
  const timerGlow =
    timeLeft > 14 ? "" : timeLeft > 7 ? "glow-orange" : "shadow-[0_0_20px_rgba(239,68,68,0.5)]";
  const timerWidth = (timeLeft / TIME_LIMIT) * 100;

  // Streak display
  const multiplier = Math.min(streak + 1, 5);

  // Render the code template with interactive blanks
  const renderCodeTemplate = () => {
    if (!step.codeTemplate) return null;

    const parts = step.codeTemplate.split("___");
    return (
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden mb-6">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          <span className="text-xs text-gray-500 ml-2 font-mono">challenge.js</span>
        </div>

        <div className="p-4 font-mono text-sm leading-loose whitespace-pre-wrap">
          {parts.map((part, i) => (
            <span key={i}>
              <span className="text-gray-300">{part}</span>
              {i < parts.length - 1 && blanks[i] && (
                <span
                  className={`inline-block min-w-[60px] px-2 py-0.5 mx-1 rounded border-b-2 text-center ${
                    selectedBlanks[i] !== undefined
                      ? "bg-orange-500/20 border-orange-400 text-orange-300"
                      : "bg-[#1c2333] border-orange-500/50 text-gray-500 animate-pulse-neon"
                  }`}
                >
                  {selectedBlanks[i] !== undefined
                    ? blanks[i].options[selectedBlanks[i]]
                    : "???"}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header: mode badge + score + streak */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-orange-400 text-2xl">⚡</span>
          <span className="bg-orange-500/20 text-orange-400 font-semibold px-3 py-1 rounded-full text-sm border border-orange-500/30">
            SPEED CODING
          </span>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <span className="bg-purple-500/20 text-purple-400 font-bold px-3 py-1 rounded-full text-sm border border-purple-500/30">
              {multiplier}x STREAK
            </span>
          )}
          <span className="bg-[#161b22] text-orange-400 font-mono font-bold px-4 py-1 rounded-full text-sm border border-orange-500/30">
            {score} pts
          </span>
        </div>
      </div>

      {/* Timer bar */}
      {feedback === null && (
        <div className={`mb-6 ${timerGlow} rounded-full`}>
          <div className="bg-[#161b22] rounded-full h-3 overflow-hidden border border-[#30363d]">
            <div
              className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`}
              style={{ width: `${timerWidth}%` }}
            />
          </div>
          <p className="text-center text-gray-500 text-xs mt-1 font-mono">
            {timeLeft}s
          </p>
        </div>
      )}

      {/* Instruction */}
      <div className="bg-[#161b22] border border-orange-500/20 rounded-xl p-4 mb-5">
        <p className="text-orange-300 font-semibold text-center">
          {step.instruction}
        </p>
      </div>

      {/* Code template with blanks (if available) */}
      {hasBlankMode && renderCodeTemplate()}

      {/* Blank option chips (if in blank mode) */}
      {hasBlankMode && feedback === null && (
        <div className="space-y-3 mb-4">
          {blanks.map((blank, blankIndex) => (
            <div key={blankIndex} className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 text-xs font-mono w-16 flex-shrink-0">
                Blank {blankIndex + 1}:
              </span>
              {blank.options.map((option, optIndex) => (
                <button
                  key={optIndex}
                  onClick={() => handleBlankSelect(blankIndex, optIndex)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-sm transition-all duration-150 ${
                    selectedBlanks[blankIndex] === optIndex
                      ? "bg-orange-500/30 border border-orange-400 text-orange-300"
                      : "bg-[#1c2333] border border-[#30363d] text-gray-400 hover:border-orange-500/50 hover:text-gray-200"
                  } cursor-pointer active:scale-95`}
                >
                  {option}
                </button>
              ))}
            </div>
          ))}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!blanks.every((_, i) => selectedBlanks[i] !== undefined)}
            className={`w-full mt-2 p-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              blanks.every((_, i) => selectedBlanks[i] !== undefined)
                ? "bg-orange-500/20 border border-orange-500/50 text-orange-300 hover:bg-orange-500/30 cursor-pointer"
                : "bg-[#161b22] border border-[#30363d] text-gray-600 cursor-not-allowed"
            }`}
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Standard options (fallback if no blanks) */}
      {!hasBlankMode && (
        <div className="space-y-3">
          {step.options.map((option, index) => {
            let buttonStyle =
              "bg-[#161b22] hover:bg-[#1c2333] border border-[#30363d] hover:border-orange-500/50 text-gray-200";

            if (feedback !== null) {
              if (index === step.correctIndex) {
                buttonStyle =
                  "bg-green-500/10 border border-green-500/50 text-green-400 glow-green";
              } else {
                buttonStyle =
                  "bg-[#161b22] border border-[#30363d] text-gray-600";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={feedback !== null}
                className={`
                  w-full p-4 rounded-xl text-left font-mono text-sm
                  transition-all duration-150
                  ${buttonStyle}
                  ${feedback === null ? "cursor-pointer active:scale-[0.98]" : "cursor-default"}
                `}
              >
                <span className="mr-2 inline-flex w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 text-xs items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback */}
      {feedback !== null && (
        <div
          className={`mt-6 p-5 rounded-xl border ${
            feedback === "correct"
              ? "bg-green-500/5 border-green-500/30"
              : "bg-orange-500/5 border-orange-500/30"
          }`}
        >
          {feedback === "correct" && (
            <p className="text-xl font-bold text-green-400 mb-2 font-mono">
              +{Math.round((timeLeft / TIME_LIMIT) * 100) * multiplier} pts
              {streak > 0 && (
                <span className="text-purple-400 text-sm ml-2">({multiplier}x streak!)</span>
              )}
            </p>
          )}
          <p
            className={`text-sm leading-relaxed ${
              feedback === "correct" ? "text-green-300" : "text-orange-300"
            }`}
          >
            {feedback === "correct" ? "✓ " : "✗ "}
            {step.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default SpeedCoding;
