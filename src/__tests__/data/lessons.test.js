import { describe, it, expect } from 'vitest';
import lessons from '../../data/lessons';

const REQUIRED_CONCEPT_FIELDS = ['id', 'title', 'concept', 'icon', 'color', 'description', 'intro', 'levels'];
const REQUIRED_INTRO_FIELDS = ['whyItMatters', 'codePreview', 'funFact'];
const REQUIRED_LEVEL_FIELDS = ['level', 'title', 'sceneId', 'completion', 'steps'];
const REQUIRED_COMPLETION_FIELDS = ['message', 'tip', 'nextPreview'];
const MODALITIES = ['codeSimulation', 'dragDrop', 'speedCoding'];

describe('lessons array', () => {
  it('exports an array', () => {
    expect(Array.isArray(lessons)).toBe(true);
  });

  it('contains exactly 3 concepts', () => {
    expect(lessons).toHaveLength(3);
  });

  it('contains the three expected concept IDs', () => {
    const ids = lessons.map((l) => l.id);
    expect(ids).toContain('variables');
    expect(ids).toContain('loops');
    expect(ids).toContain('conditions');
  });
});

describe.each(lessons)('concept: $id', (concept) => {
  it('has all required top-level fields', () => {
    for (const field of REQUIRED_CONCEPT_FIELDS) {
      expect(concept, `${concept.id} missing field: ${field}`).toHaveProperty(field);
    }
  });

  it('has all required intro fields', () => {
    for (const field of REQUIRED_INTRO_FIELDS) {
      expect(concept.intro, `${concept.id}.intro missing: ${field}`).toHaveProperty(field);
    }
  });

  it('has at least one level', () => {
    expect(concept.levels.length).toBeGreaterThan(0);
  });

  it('levels are numbered sequentially starting from 1', () => {
    concept.levels.forEach((lvl, idx) => {
      expect(lvl.level).toBe(idx + 1);
    });
  });

  describe.each(concept.levels)('level $level', (levelData) => {
    it('has all required level fields', () => {
      for (const field of REQUIRED_LEVEL_FIELDS) {
        expect(levelData, `${concept.id} level ${levelData.level} missing: ${field}`).toHaveProperty(field);
      }
    });

    it('completion object has required fields', () => {
      for (const field of REQUIRED_COMPLETION_FIELDS) {
        expect(
          levelData.completion,
          `${concept.id} level ${levelData.level} completion missing: ${field}`
        ).toHaveProperty(field);
      }
    });

    it('has at least one step', () => {
      expect(levelData.steps.length).toBeGreaterThan(0);
    });

    describe.each(levelData.steps.map((s, i) => ({ ...s, _index: i })))('step $_index', (step) => {
      it('has an instruction or instructions object', () => {
        const hasInstruction = step.instruction != null;
        const hasInstructions = step.instructions != null && typeof step.instructions === 'object';
        expect(hasInstruction || hasInstructions).toBe(true);
      });

      it('has a correctIndex when options are present', () => {
        if (step.options) {
          expect(step.correctIndex).toBeDefined();
          expect(typeof step.correctIndex).toBe('number');
        }
      });

      it('correctIndex is within bounds of options array', () => {
        if (step.options) {
          expect(step.correctIndex).toBeGreaterThanOrEqual(0);
          expect(step.correctIndex).toBeLessThan(step.options.length);
        }
      });

      it('has codeSnippet for codeSimulation steps', () => {
        if (step.instructions?.codeSimulation) {
          expect(step.codeSnippet).toBeDefined();
        }
      });

      it('dragDrop steps have codeBlocks and correctOrder arrays', () => {
        if (step.instructions?.dragDrop) {
          expect(Array.isArray(step.codeBlocks)).toBe(true);
          expect(Array.isArray(step.correctOrder)).toBe(true);
        }
      });

      it('correctOrder indices are valid codeBlocks indices', () => {
        if (step.correctOrder && step.codeBlocks) {
          for (const idx of step.correctOrder) {
            expect(idx).toBeGreaterThanOrEqual(0);
            expect(idx).toBeLessThan(step.codeBlocks.length);
          }
        }
      });

      it('speedCoding steps have codeTemplate and blanks array', () => {
        if (step.instructions?.speedCoding) {
          expect(step.codeTemplate).toBeDefined();
          expect(Array.isArray(step.blanks)).toBe(true);
        }
      });

      it('each blank has position, options, and correctIndex', () => {
        if (step.blanks) {
          for (const blank of step.blanks) {
            expect(blank).toHaveProperty('position');
            expect(blank).toHaveProperty('options');
            expect(blank).toHaveProperty('correctIndex');
            expect(Array.isArray(blank.options)).toBe(true);
            expect(blank.correctIndex).toBeGreaterThanOrEqual(0);
            expect(blank.correctIndex).toBeLessThan(blank.options.length);
          }
        }
      });
    });
  });
});
