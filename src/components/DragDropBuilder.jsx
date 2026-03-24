/**
 * DRAG & DROP CODE BUILDER
 * ========================
 * Arrange code blocks in the correct order and watch a visual character respond.
 *
 * Left side: Pool of shuffled draggable code blocks
 * Right side: Drop zone to assemble the "program"
 * Bottom: Visual output (SVG animation) showing success/failure
 *
 * Props:
 *   step       – the current lesson step object
 *   onAnswer   – callback (receives correctIndex if correct, -1 if wrong)
 *   feedback   – null, "correct", or "incorrect"
 */

import { useState, useEffect, useMemo } from "react";
import CodeBlock from "./drag-drop/CodeBlock";
import DropZone from "./drag-drop/DropZone";
import VisualOutput from "./drag-drop/VisualOutput";

function DragDropBuilder({ step, onAnswer, feedback, hero }) {
  const codeBlocks = step.codeBlocks || step.options || [];
  const correctOrder = step.correctOrder || [];
  const totalSlots = correctOrder.length;

  // Shuffle block indices for the pool (so they don't appear in order)
  const shuffledIndices = useMemo(() => {
    const indices = codeBlocks.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track which blocks are placed in which slots
  // placedBlocks[slotIndex] = blockIndex (or undefined)
  const [placedBlocks, setPlacedBlocks] = useState({});
  const [draggingBlock, setDraggingBlock] = useState(null);
  const [visualResult, setVisualResult] = useState(null);

  // Reset when step changes
  useEffect(() => {
    setPlacedBlocks({});
    setVisualResult(null);
  }, [step]);

  // Update visual when feedback comes in
  useEffect(() => {
    if (feedback === "correct") {
      setVisualResult("correct");
    } else if (feedback === "incorrect") {
      setVisualResult("incorrect");
    }
  }, [feedback]);

  // Check which blocks are already placed
  const placedBlockIndices = new Set(Object.values(placedBlocks));

  // Handle dropping a block into a slot
  const handleDrop = (blockIndex, slotIndex) => {
    if (feedback !== null) return;

    setPlacedBlocks((prev) => {
      const updated = { ...prev };
      // If this slot already has a block, remove it first
      // If this block is already in another slot, remove from there
      for (const [key, val] of Object.entries(updated)) {
        if (val === blockIndex) {
          delete updated[key];
        }
      }
      updated[slotIndex] = blockIndex;
      return updated;
    });
  };

  // Handle removing a block from a slot
  const handleRemove = (slotIndex) => {
    if (feedback !== null) return;
    setPlacedBlocks((prev) => {
      const updated = { ...prev };
      delete updated[slotIndex];
      return updated;
    });
  };

  // Check if all slots are filled
  const allSlotsFilled = Object.keys(placedBlocks).length === totalSlots;

  // Run code — check the order
  const handleRunCode = () => {
    if (feedback !== null || !allSlotsFilled) return;

    // Check if the placed order matches correctOrder
    const userOrder = [];
    for (let i = 0; i < totalSlots; i++) {
      userOrder.push(placedBlocks[i]);
    }

    const isCorrect = userOrder.every((blockIdx, slotIdx) => blockIdx === correctOrder[slotIdx]);

    if (isCorrect) {
      setVisualResult("correct");
      // Small delay so user sees the animation before feedback
      setTimeout(() => onAnswer(step.correctIndex), 500);
    } else {
      setVisualResult("incorrect");
      setTimeout(() => onAnswer(-1), 500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Mode badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-violet-400 font-mono text-lg font-bold">{ }</span>
        <span className="bg-violet-500/20 text-violet-400 font-semibold px-3 py-1 rounded-full text-sm border border-violet-500/30">
          DRAG & DROP
        </span>
      </div>

      {/* Instruction */}
      <div className="bg-[#161b22] border border-violet-500/20 rounded-xl p-4 mb-5">
        <p className="text-violet-300 font-semibold text-center">
          {step.instruction || "Arrange the code blocks in the correct order!"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Left: Code block pool */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Code Blocks
          </h3>
          <div className="space-y-2">
            {shuffledIndices.map((blockIndex) => (
              <CodeBlock
                key={blockIndex}
                text={codeBlocks[blockIndex]}
                index={blockIndex}
                isDragging={draggingBlock === blockIndex}
                isPlaced={placedBlockIndices.has(blockIndex)}
                isDisabled={feedback !== null}
                onDragStart={(idx) => setDraggingBlock(idx)}
                onDragEnd={() => setDraggingBlock(null)}
              />
            ))}
          </div>
        </div>

        {/* Right: Drop zone (the "program") */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Your Program
          </h3>
          <DropZone
            placedBlocks={placedBlocks}
            totalSlots={totalSlots}
            codeBlocks={codeBlocks}
            onDrop={handleDrop}
            onRemove={handleRemove}
            isDisabled={feedback !== null}
          />
        </div>
      </div>

      {/* Visual output */}
      <div className="mb-4">
        <VisualOutput
          result={visualResult}
          scene={step.visualScene || "hero-spawn"}
          hero={hero}
        />
      </div>

      {/* Run Code button */}
      {feedback === null && (
        <button
          onClick={handleRunCode}
          disabled={!allSlotsFilled}
          className={`w-full p-3 rounded-xl font-semibold transition-all duration-200 ${
            allSlotsFilled
              ? "bg-violet-500/20 border border-violet-500/50 text-violet-300 hover:bg-violet-500/30 cursor-pointer glow-purple"
              : "bg-[#161b22] border border-[#30363d] text-gray-600 cursor-not-allowed"
          }`}
        >
          {allSlotsFilled ? "▶ Run Code" : "Place all blocks first..."}
        </button>
      )}

      {/* Feedback */}
      {feedback !== null && (
        <div
          className={`mt-4 p-5 rounded-xl border ${
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

export default DragDropBuilder;
