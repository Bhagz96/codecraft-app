import { describe, it, expect } from 'vitest';
import { injectHeroData, injectHeroIntoLevel } from '../../data/lessonTemplates';

const baseHero = {
  name: 'Aria',
  health: 85,
  maxHealth: 100,
  attack: 13,
  defense: 7,
  gold: 30,
  level: 2,
  xp: 120,
  color: '#a855f7',
};

describe('injectHeroData', () => {
  it('replaces {heroName} in a string field', () => {
    const step = { instruction: 'Hello {heroName}!' };
    const result = injectHeroData(step, baseHero);
    expect(result.instruction).toBe('Hello Aria!');
  });

  it('replaces {heroHealth}', () => {
    const step = { text: 'HP: {heroHealth}' };
    expect(injectHeroData(step, baseHero).text).toBe('HP: 85');
  });

  it('replaces {heroMaxHealth}', () => {
    const step = { text: 'Max: {heroMaxHealth}' };
    expect(injectHeroData(step, baseHero).text).toBe('Max: 100');
  });

  it('replaces {heroAttack}', () => {
    const step = { text: 'ATK {heroAttack}' };
    expect(injectHeroData(step, baseHero).text).toBe('ATK 13');
  });

  it('replaces {heroDefense}', () => {
    const step = { text: 'DEF {heroDefense}' };
    expect(injectHeroData(step, baseHero).text).toBe('DEF 7');
  });

  it('replaces {heroGold}', () => {
    const step = { text: 'Gold: {heroGold}' };
    expect(injectHeroData(step, baseHero).text).toBe('Gold: 30');
  });

  it('replaces {heroLevel}', () => {
    const step = { text: 'Level {heroLevel}' };
    expect(injectHeroData(step, baseHero).text).toBe('Level 2');
  });

  it('replaces {heroXP}', () => {
    const step = { text: 'XP: {heroXP}' };
    expect(injectHeroData(step, baseHero).text).toBe('XP: 120');
  });

  it('replaces {heroColor}', () => {
    const step = { text: 'Color: {heroColor}' };
    expect(injectHeroData(step, baseHero).text).toBe('Color: #a855f7');
  });

  it('replaces multiple tokens in a single string', () => {
    const step = { instruction: '{heroName} has {heroHealth} HP at level {heroLevel}' };
    const result = injectHeroData(step, baseHero);
    expect(result.instruction).toBe('Aria has 85 HP at level 2');
  });

  it('replaces tokens inside nested objects', () => {
    const step = { sceneConfig: { message: 'Hi {heroName}' } };
    const result = injectHeroData(step, baseHero);
    expect(result.sceneConfig.message).toBe('Hi Aria');
  });

  it('replaces tokens inside arrays', () => {
    const step = { options: ['{heroName}', 'other'] };
    const result = injectHeroData(step, baseHero);
    expect(result.options[0]).toBe('Aria');
    expect(result.options[1]).toBe('other');
  });

  it('replaces all occurrences of a token in a string', () => {
    const step = { instruction: '{heroName} said hello, {heroName}!' };
    const result = injectHeroData(step, baseHero);
    expect(result.instruction).toBe('Aria said hello, Aria!');
  });

  it('does not mutate the original step object', () => {
    const step = { instruction: '{heroName} is here' };
    injectHeroData(step, baseHero);
    expect(step.instruction).toBe('{heroName} is here');
  });

  it('returns the step unchanged when hero is null', () => {
    const step = { instruction: '{heroName} rules' };
    expect(injectHeroData(step, null)).toBe(step);
  });

  it('returns the step unchanged when hero has no name', () => {
    const step = { instruction: '{heroName} rules' };
    expect(injectHeroData(step, {})).toBe(step);
  });

  it('leaves non-token strings untouched', () => {
    const step = { instruction: 'Just a plain string' };
    const result = injectHeroData(step, baseHero);
    expect(result.instruction).toBe('Just a plain string');
  });

  it('passes through non-string, non-object values unchanged', () => {
    const step = { correctIndex: 2, someFlag: true };
    const result = injectHeroData(step, baseHero);
    expect(result.correctIndex).toBe(2);
    expect(result.someFlag).toBe(true);
  });

  it('uses default stat values when hero fields are missing', () => {
    const minimalHero = { name: 'Min' };
    const step = { text: 'HP {heroHealth} Gold {heroGold}' };
    const result = injectHeroData(step, minimalHero);
    expect(result.text).toBe('HP 100 Gold 0');
  });
});

describe('injectHeroIntoLevel', () => {
  it('injects hero data into every step', () => {
    const level = {
      title: 'Test Level',
      steps: [
        { instruction: 'Hello {heroName}' },
        { instruction: '{heroName} attacks' },
      ],
    };
    const result = injectHeroIntoLevel(level, baseHero);
    expect(result.steps[0].instruction).toBe('Hello Aria');
    expect(result.steps[1].instruction).toBe('Aria attacks');
  });

  it('preserves other level fields', () => {
    const level = { title: 'My Level', level: 3, steps: [] };
    const result = injectHeroIntoLevel(level, baseHero);
    expect(result.title).toBe('My Level');
    expect(result.level).toBe(3);
  });

  it('returns levelData unchanged when it has no steps', () => {
    const level = { title: 'No steps' };
    const result = injectHeroIntoLevel(level, baseHero);
    expect(result).toEqual(level);
  });

  it('returns levelData unchanged when levelData is null', () => {
    expect(injectHeroIntoLevel(null, baseHero)).toBeNull();
  });

  it('does not mutate the original level object', () => {
    const level = { title: 'Original', steps: [{ instruction: '{heroName}' }] };
    injectHeroIntoLevel(level, baseHero);
    expect(level.steps[0].instruction).toBe('{heroName}');
  });
});
