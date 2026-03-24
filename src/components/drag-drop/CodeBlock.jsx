/**
 * DRAGGABLE CODE BLOCK
 * ====================
 * A single line of code that can be dragged from the pool
 * into the drop zone to assemble a program.
 */

function CodeBlock({ text, index, isDragging, onDragStart, onDragEnd, isPlaced, isDisabled }) {
  return (
    <div
      draggable={!isDisabled}
      onDragStart={(e) => {
        if (isDisabled) return;
        e.dataTransfer.setData("text/plain", String(index));
        e.dataTransfer.effectAllowed = "move";
        onDragStart && onDragStart(index);
      }}
      onDragEnd={() => onDragEnd && onDragEnd()}
      className={`
        px-4 py-3 rounded-lg font-mono text-sm
        border transition-all duration-200
        ${isDisabled
          ? "bg-[#0d1117] border-[#30363d] text-gray-600 cursor-default"
          : isPlaced
            ? "bg-[#0d1117] border-[#30363d] text-gray-600 cursor-default opacity-40"
            : isDragging
              ? "bg-violet-500/20 border-violet-400 text-violet-300 scale-105 opacity-70 cursor-grabbing"
              : "bg-[#161b22] border-[#30363d] text-gray-200 cursor-grab hover:border-violet-500/50 hover:bg-[#1c2333] active:scale-95"
        }
      `}
    >
      <span className="text-gray-500 mr-2">{isDisabled ? "  " : "::"}</span>
      {text}
    </div>
  );
}

export default CodeBlock;
