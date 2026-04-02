import { useState, useEffect } from "react";
import { shuffleOptions } from "../utils/shuffleOptions";

/**
 * PUZZLE MODE COMPONENT
 * =====================
 * Presents the lesson step as a visual puzzle.
 * No narration — just a clean question with big colourful option buttons.
 * Feels more like a quiz/game.
 *
 * Props:
 *   step       – the current lesson step object
 *   onAnswer   – callback when the child picks an option (receives the index)
 *   feedback   – null, "correct", or "incorrect"
 */

// Colours for each option button (to make it visually distinct)
const OPTION_COLORS = [
  { bg: "bg-pink-100", border: "border-pink-400", hover: "hover:bg-pink-200", text: "text-pink-800" },
  { bg: "bg-blue-100", border: "border-blue-400", hover: "hover:bg-blue-200", text: "text-blue-800" },
  { bg: "bg-yellow-100", border: "border-yellow-400", hover: "hover:bg-yellow-200", text: "text-yellow-800" },
];

function PuzzleMode({ step, onAnswer, feedback }) {
  const [shuffled, setShuffled] = useState(
    () => shuffleOptions(step.options, step.correctIndex)
  );
  useEffect(() => {
    setShuffled(shuffleOptions(step.options, step.correctIndex));
  }, [step.instruction]); // eslint-disable-line react-hooks/exhaustive-deps
  const { shuffledOptions, newCorrectIndex, indexMap } = shuffled;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Puzzle icon header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">🧩</div>
        <span className="inline-block bg-blue-100 text-blue-700 font-bold px-4 py-1 rounded-full text-sm">
          PUZZLE TIME
        </span>
      </div>

      {/* Question in a big card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg mb-8 border-4 border-dashed border-blue-300">
        <p className="text-gray-800 font-bold text-xl md:text-2xl text-center">
          {step.instruction}
        </p>
      </div>

      {/* Option buttons — big, colourful, easy to tap */}
      <div className="space-y-4">
        {shuffledOptions.map((option, index) => {
          const colors = OPTION_COLORS[index % OPTION_COLORS.length];

          let buttonStyle = `${colors.bg} border-3 ${colors.border} ${colors.hover} ${colors.text}`;

          if (feedback !== null) {
            if (index === newCorrectIndex) {
              buttonStyle = "bg-green-200 border-3 border-green-500 text-green-800";
            } else {
              buttonStyle = "bg-gray-100 border-3 border-gray-200 text-gray-400";
            }
          }

          return (
            <button
              key={index}
              onClick={() => feedback === null && onAnswer(indexMap[index])}
              disabled={feedback !== null}
              className={`
                w-full p-5 rounded-2xl text-lg md:text-xl font-bold
                transition-all duration-200 text-center
                border-3
                ${buttonStyle}
                ${feedback === null ? "cursor-pointer active:scale-95 hover:scale-102" : "cursor-default"}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback !== null && (
        <div
          className={`mt-8 p-5 rounded-2xl text-center ${
            feedback === "correct"
              ? "bg-green-50 border-2 border-green-300"
              : "bg-orange-50 border-2 border-orange-300"
          }`}
        >
          <p className="text-lg font-medium">
            {feedback === "correct" ? "🎉 " : "🤔 "}
            {step.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default PuzzleMode;
