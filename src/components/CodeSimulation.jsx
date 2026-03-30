/**
 * CODE SIMULATION MODE
 * ====================
 * A step-by-step code execution walkthrough, like using a debugger.
 *
 * Displays a code snippet with syntax highlighting, a variable watch panel,
 * and asks the user to trace what the code does. Multiple-choice answer.
 *
 * Props:
 *   step       – the current lesson step object (must have codeSnippet, traceQuestion)
 *   onAnswer   – callback when user picks an option (receives the index)
 *   feedback   – null, "correct", or "incorrect"
 */

import { useState, useEffect } from "react";

/**
 * Simple syntax highlighter — applies colour classes to code keywords.
 * Not a full parser, just regex-based for common JS tokens.
 */
function highlightCode(code) {
  if (!code) return "";

  // Order matters — process strings first to avoid highlighting keywords inside strings
  const tokens = [];
  let remaining = code;

  // Match strings (both single and double quotes), template literals
  const stringRegex = /(`[^`]*`|"[^"]*"|'[^']*')/g;
  let lastIndex = 0;
  let match;

  while ((match = stringRegex.exec(remaining)) !== null) {
    // Add text before this string
    if (match.index > lastIndex) {
      tokens.push({ type: "code", text: remaining.slice(lastIndex, match.index) });
    }
    tokens.push({ type: "string", text: match[0] });
    lastIndex = match.index + match[0].length;
  }
  // Add remaining text
  if (lastIndex < remaining.length) {
    tokens.push({ type: "code", text: remaining.slice(lastIndex) });
  }

  // Now highlight keywords in non-string tokens
  return tokens
    .map((token) => {
      if (token.type === "string") {
        return `<span class="syntax-string">${escapeHtml(token.text)}</span>`;
      }

      let text = escapeHtml(token.text);

      // Keywords
      text = text.replace(
        /\b(def|return|if|elif|else|for|while|break|continue|pass|in|not|and|or|is|class|import|from|try|except|finally|raise|with|as|True|False|None|print|range|len|int|str|float|list|dict|type|input|append|sum|max|min|sorted|enumerate)\b/g,
        '<span class="syntax-keyword">$1</span>'
      );

      // Numbers
      text = text.replace(
        /\b(\d+\.?\d*)\b/g,
        '<span class="syntax-number">$1</span>'
      );

      // Function calls (word followed by parenthesis)
      text = text.replace(
        /\b([a-zA-Z_]\w*)\s*(?=\()/g,
        '<span class="syntax-func">$1</span>'
      );

      // Comments
      text = text.replace(
        /(\/\/.*)/g,
        '<span class="syntax-comment">$1</span>'
      );

      return text;
    })
    .join("");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function CodeSimulation({ step, onAnswer, feedback }) {
  const [currentLine, setCurrentLine] = useState(0);
  const lines = step.codeSnippet ? step.codeSnippet.split("\n") : [];

  // Animate through code lines
  useEffect(() => {
    if (feedback !== null) return;
    setCurrentLine(0);

    const timer = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev >= lines.length - 1) {
          clearInterval(timer);
          return lines.length - 1;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [step, feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mode badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cyan-400 font-mono font-bold text-lg">&gt;_</span>
        <span className="bg-cyan-500/20 text-cyan-400 font-semibold px-3 py-1 rounded-full text-sm border border-cyan-500/30">
          CODE SIMULATION
        </span>
      </div>

      {/* Code display with line numbers */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden mb-6">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          <span className="text-xs text-gray-500 ml-2 font-mono">simulation.py</span>
        </div>

        {/* Code lines */}
        <div className="p-4 font-mono text-sm leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`flex transition-all duration-300 ${
                i === currentLine && feedback === null
                  ? "bg-cyan-500/10 border-l-2 border-cyan-400 -ml-[2px]"
                  : ""
              }`}
            >
              {/* Line number */}
              <span className="text-gray-600 w-8 text-right mr-4 select-none flex-shrink-0">
                {i + 1}
              </span>
              {/* Code content — whitespace-pre preserves Python indentation */}
              <span
                className={`${i <= currentLine || feedback !== null ? "opacity-100" : "opacity-30"} transition-opacity duration-300 whitespace-pre`}
                dangerouslySetInnerHTML={{ __html: highlightCode(line) }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Trace question */}
      <div className="bg-[#161b22] border border-cyan-500/30 rounded-xl p-5 mb-6">
        <p className="text-cyan-300 font-semibold text-lg text-center">
          {step.traceQuestion || step.instruction}
        </p>
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {step.options.map((option, index) => {
          let buttonStyle =
            "bg-[#161b22] hover:bg-[#1c2333] border border-[#30363d] hover:border-cyan-500/50 text-gray-200";

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
              onClick={() => feedback === null && onAnswer(index)}
              disabled={feedback !== null}
              className={`
                w-full p-4 rounded-xl text-left font-mono text-sm
                transition-all duration-200
                ${buttonStyle}
                ${feedback === null ? "cursor-pointer active:scale-[0.98]" : "cursor-default"}
              `}
            >
              <span className="text-gray-500 mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback !== null && (
        <div
          className={`mt-6 p-5 rounded-xl border ${
            feedback === "correct"
              ? "bg-green-500/5 border-green-500/30 text-green-300"
              : "bg-orange-500/5 border-orange-500/30 text-orange-300"
          }`}
        >
          <p className="font-medium text-sm leading-relaxed">
            {feedback === "correct" ? "✓ " : "✗ "}
            {step.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default CodeSimulation;
