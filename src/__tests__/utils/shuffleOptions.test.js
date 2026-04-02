import { describe, it, expect } from "vitest";
import { shuffleOptions } from "../../utils/shuffleOptions";

describe("shuffleOptions", () => {
  const options = ["correct", "wrong1", "wrong2"];
  const correctIndex = 0;

  it("returns the same number of options", () => {
    const { shuffledOptions } = shuffleOptions(options, correctIndex);
    expect(shuffledOptions).toHaveLength(options.length);
  });

  it("contains all original options", () => {
    const { shuffledOptions } = shuffleOptions(options, correctIndex);
    expect(shuffledOptions).toEqual(expect.arrayContaining(options));
  });

  it("newCorrectIndex always points to the correct answer text", () => {
    for (let i = 0; i < 20; i++) {
      const { shuffledOptions, newCorrectIndex } = shuffleOptions(options, correctIndex);
      expect(shuffledOptions[newCorrectIndex]).toBe(options[correctIndex]);
    }
  });

  it("indexMap[shuffledPos] returns the original position", () => {
    const { shuffledOptions, indexMap } = shuffleOptions(options, correctIndex);
    shuffledOptions.forEach((opt, shuffledPos) => {
      const originalPos = indexMap[shuffledPos];
      expect(options[originalPos]).toBe(opt);
    });
  });

  it("works when correctIndex is not 0", () => {
    const opts = ["a", "b", "c"];
    const { shuffledOptions, newCorrectIndex } = shuffleOptions(opts, 2);
    expect(shuffledOptions[newCorrectIndex]).toBe("c");
  });

  it("handles a single option", () => {
    const { shuffledOptions, newCorrectIndex } = shuffleOptions(["only"], 0);
    expect(shuffledOptions).toEqual(["only"]);
    expect(newCorrectIndex).toBe(0);
  });
});
