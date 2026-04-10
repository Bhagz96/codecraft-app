/**
 * DROP ZONE
 * =========
 * The area where users assemble their program by dropping code blocks.
 * Shows numbered slots and provides visual feedback on drag-over.
 */

import { useState } from "react";

function DropZone({ placedBlocks, totalSlots, codeBlocks, onDrop, onRemove, isDisabled }) {
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const handleDragOver = (e, slotIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(slotIndex);
  };

  const handleDragLeave = () => {
    setDragOverIndex(-1);
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    setDragOverIndex(-1);
    const blockIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!isNaN(blockIndex)) {
      onDrop(blockIndex, slotIndex);
    }
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: totalSlots }).map((_, slotIndex) => {
        const blockIndex = placedBlocks[slotIndex];
        const hasBlock = blockIndex !== undefined && blockIndex !== null;
        const isDragOver = dragOverIndex === slotIndex;

        return (
          <div
            key={slotIndex}
            onDragOver={(e) => !isDisabled && handleDragOver(e, slotIndex)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => !isDisabled && handleDrop(e, slotIndex)}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-lg
              border-2 border-dashed transition-all duration-200
              min-h-[48px]
              ${isDisabled
                ? hasBlock
                  ? "border-[#30363d] bg-[#161b22]"
                  : "border-[#30363d] bg-[#0d1117]"
                : isDragOver
                  ? "border-green-400 bg-green-500/5"
                  : hasBlock
                    ? "border-violet-500/30 bg-violet-500/5"
                    : "border-[#30363d] bg-[#0d1117] hover:border-[#484f58]"
              }
            `}
          >
            {/* Line number */}
            <span className="text-gray-600 font-mono text-xs w-6 text-right flex-shrink-0 pt-[1px]">
              {slotIndex + 1}
            </span>

            {/* Block content or empty slot */}
            {hasBlock ? (
              <div className="flex items-start justify-between flex-1">
                <span className="font-mono text-sm text-violet-300 whitespace-pre-wrap break-all min-w-0">
                  {codeBlocks[blockIndex]}
                </span>
                {!isDisabled && (
                  <button
                    onClick={() => onRemove(slotIndex)}
                    className="text-gray-600 hover:text-red-400 text-xs ml-2 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : (
              <span className="text-gray-600 text-sm italic">
                {isDragOver ? "Drop here..." : `Line ${slotIndex + 1}`}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DropZone;
