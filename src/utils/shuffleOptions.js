/**
 * shuffleOptions
 * ==============
 * Randomises the order of MCQ options while tracking where the correct
 * answer ends up, so components can highlight it and translate clicks
 * back to the original index for the parent's answer-checking logic.
 *
 * Returns:
 *   shuffledOptions  – options array in randomised order
 *   newCorrectIndex  – position of the correct answer after shuffling
 *   indexMap         – indexMap[shuffledPos] = originalPos, used to
 *                      translate a shuffled click back to original index
 */
export function shuffleOptions(options, correctIndex) {
  // Build an array of original positions, then Fisher-Yates shuffle it
  const positions = options.map((_, i) => i);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return {
    shuffledOptions: positions.map((i) => options[i]),
    newCorrectIndex: positions.indexOf(correctIndex),
    indexMap: positions, // indexMap[shuffledPos] === originalPos
  };
}
