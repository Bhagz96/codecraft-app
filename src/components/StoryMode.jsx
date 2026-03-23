/**
 * STORY MODE COMPONENT
 * ====================
 * Presents the lesson step as a narrated story.
 * A character "tells" the story, and the child picks an answer.
 *
 * Props:
 *   step       – the current lesson step object
 *   onAnswer   – callback when the child picks an option (receives the index)
 *   feedback   – null, "correct", or "incorrect" (set after answering)
 */
function StoryMode({ step, onAnswer, feedback }) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Narrator character */}
      <div className="flex items-start gap-4 mb-6">
        <div className="text-5xl flex-shrink-0">🐱</div>
        <div className="bg-white rounded-2xl rounded-tl-none p-5 shadow-md flex-1">
          <p className="text-gray-700 text-lg leading-relaxed">{step.story}</p>
        </div>
      </div>

      {/* Question */}
      <div className="bg-purple-50 rounded-2xl p-5 mb-6">
        <p className="text-purple-800 font-bold text-xl text-center">
          {step.instruction}
        </p>
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {step.options.map((option, index) => {
          // Determine button styling based on feedback state
          let buttonStyle =
            "bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 text-gray-700";

          if (feedback !== null) {
            if (index === step.correctIndex) {
              buttonStyle = "bg-green-100 border-2 border-green-500 text-green-800";
            } else if (feedback === "incorrect") {
              buttonStyle = "bg-gray-100 border-2 border-gray-200 text-gray-400";
            }
          }

          return (
            <button
              key={index}
              onClick={() => feedback === null && onAnswer(index)}
              disabled={feedback !== null}
              className={`
                w-full p-4 rounded-2xl text-lg font-semibold
                transition-all duration-200 text-left
                ${buttonStyle}
                ${feedback === null ? "cursor-pointer active:scale-95" : "cursor-default"}
              `}
            >
              <span className="mr-3 text-xl">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback message */}
      {feedback !== null && (
        <div
          className={`mt-6 p-5 rounded-2xl text-center ${
            feedback === "correct"
              ? "bg-green-50 border-2 border-green-300"
              : "bg-orange-50 border-2 border-orange-300"
          }`}
        >
          <p className="text-lg font-medium">
            {feedback === "correct" ? "⭐ " : "💡 "}
            {step.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default StoryMode;
