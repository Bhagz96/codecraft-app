import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createHero,
  getHero,
  saveHero,
  updateHero,
  awardXP,
  hasHero,
  resetHero,
  setCurrentUser,
  loadHeroFromCloud,
} from '../../data/hero';

describe('createHero', () => {
  it('creates a hero with the given name', () => {
    const hero = createHero('Aria');
    expect(hero.name).toBe('Aria');
  });

  it('marks the hero as created', () => {
    const hero = createHero('Aria');
    expect(hero.created).toBe(true);
  });

  it('sets default stats', () => {
    const hero = createHero('Test');
    expect(hero.health).toBe(100);
    expect(hero.maxHealth).toBe(100);
    expect(hero.attack).toBe(10);
    expect(hero.defense).toBe(5);
    expect(hero.gold).toBe(0);
    expect(hero.xp).toBe(0);
    expect(hero.level).toBe(1);
  });

  it('uses the provided color', () => {
    const hero = createHero('Zara', '#ff6b35');
    expect(hero.color).toBe('#ff6b35');
  });

  it('defaults color to cyan when not provided', () => {
    const hero = createHero('Hero');
    expect(hero.color).toBe('#00d4ff');
  });

  it('falls back to "Hero" when name is empty', () => {
    const hero = createHero('');
    expect(hero.name).toBe('Hero');
  });

  it('persists the hero to localStorage', () => {
    createHero('Saved');
    const raw = localStorage.getItem('kidcode_hero');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw).name).toBe('Saved');
  });
});

describe('getHero', () => {
  it('returns default hero when localStorage is empty', () => {
    const hero = getHero();
    expect(hero.created).toBe(false);
    expect(hero.level).toBe(1);
  });

  it('returns the saved hero after creation', () => {
    createHero('Aria');
    const hero = getHero();
    expect(hero.name).toBe('Aria');
    expect(hero.created).toBe(true);
  });

  it('merges saved data with defaults (handles missing fields gracefully)', () => {
    localStorage.setItem('kidcode_hero', JSON.stringify({ name: 'Partial' }));
    const hero = getHero();
    expect(hero.name).toBe('Partial');
    expect(hero.health).toBe(100); // default filled in
  });

  it('returns default when localStorage contains invalid JSON', () => {
    localStorage.setItem('kidcode_hero', 'not-json');
    const hero = getHero();
    expect(hero.created).toBe(false);
  });
});

describe('saveHero', () => {
  it('saves hero data to localStorage', () => {
    const hero = { name: 'DirectSave', level: 3, xp: 250 };
    saveHero(hero);
    const stored = JSON.parse(localStorage.getItem('kidcode_hero'));
    expect(stored.name).toBe('DirectSave');
    expect(stored.level).toBe(3);
  });
});

describe('updateHero', () => {
  it('merges updates into existing hero', () => {
    createHero('Base');
    const updated = updateHero({ gold: 50 });
    expect(updated.gold).toBe(50);
    expect(updated.name).toBe('Base'); // unchanged field preserved
  });

  it('persists updates to localStorage', () => {
    createHero('Base');
    updateHero({ attack: 99 });
    expect(getHero().attack).toBe(99);
  });

  it('can update multiple fields at once', () => {
    createHero('Base');
    const updated = updateHero({ health: 80, defense: 20 });
    expect(updated.health).toBe(80);
    expect(updated.defense).toBe(20);
  });
});

describe('awardXP', () => {
  beforeEach(() => {
    createHero('XPHero');
  });

  it('adds XP to the hero', () => {
    const hero = awardXP(50);
    expect(hero.xp).toBe(50);
  });

  it('awards gold equal to half the XP', () => {
    const hero = awardXP(60);
    expect(hero.gold).toBe(30);
  });

  it('does NOT level up when XP stays below 100', () => {
    const hero = awardXP(99);
    expect(hero.level).toBe(1);
  });

  it('levels up when XP reaches exactly 100', () => {
    const hero = awardXP(100);
    expect(hero.level).toBe(2);
  });

  it('levels up when XP exceeds 100', () => {
    const hero = awardXP(150);
    expect(hero.level).toBe(2);
  });

  it('levels up multiple times correctly', () => {
    const hero = awardXP(250);
    expect(hero.level).toBe(3);
  });

  it('increases maxHealth by 10 on level-up', () => {
    const hero = awardXP(100);
    expect(hero.maxHealth).toBe(110);
  });

  it('restores health to new maxHealth on level-up', () => {
    const hero = awardXP(100);
    expect(hero.health).toBe(hero.maxHealth);
  });

  it('increases attack by 3 on level-up', () => {
    const hero = awardXP(100);
    expect(hero.attack).toBe(13);
  });

  it('increases defense by 2 on level-up', () => {
    const hero = awardXP(100);
    expect(hero.defense).toBe(7);
  });

  it('accumulates XP across multiple calls', () => {
    awardXP(40);
    awardXP(40);
    const hero = awardXP(40);
    expect(hero.xp).toBe(120);
    expect(hero.level).toBe(2);
  });

  it('persists changes to localStorage', () => {
    awardXP(50);
    expect(getHero().xp).toBe(50);
  });
});

describe('hasHero', () => {
  it('returns false when no hero has been created', () => {
    expect(hasHero()).toBe(false);
  });

  it('returns true after createHero is called', () => {
    createHero('Check');
    expect(hasHero()).toBe(true);
  });

  it('returns false when localStorage is cleared', () => {
    createHero('Temp');
    localStorage.clear();
    expect(hasHero()).toBe(false);
  });
});

describe('resetHero', () => {
  it('removes hero from localStorage', () => {
    createHero('ToReset');
    resetHero();
    expect(localStorage.getItem('kidcode_hero')).toBeNull();
  });

  it('causes hasHero to return false', () => {
    createHero('ToReset');
    resetHero();
    expect(hasHero()).toBe(false);
  });

  it('causes getHero to return the default', () => {
    createHero('ToReset');
    resetHero();
    expect(getHero().created).toBe(false);
  });
});

describe('setCurrentUser — per-user storage namespacing', () => {
  afterEach(() => {
    // Always reset to avoid cross-test pollution
    setCurrentUser(null);
  });

  it('setCurrentUser is exported as a function', () => {
    expect(typeof setCurrentUser).toBe('function');
  });

  it('loadHeroFromCloud is exported as a function', () => {
    expect(typeof loadHeroFromCloud).toBe('function');
  });

  it('when userId is set, createHero saves to namespaced key', () => {
    setCurrentUser('user_abc');
    createHero('NamespacedHero');
    const raw = localStorage.getItem('kidcode_hero_user_abc');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw).name).toBe('NamespacedHero');
  });

  it('when userId is set, getHero reads from namespaced key', () => {
    setCurrentUser('user_abc');
    createHero('CloudHero');
    const hero = getHero();
    expect(hero.name).toBe('CloudHero');
  });

  it('when userId is null, falls back to default kidcode_hero key', () => {
    setCurrentUser(null);
    createHero('GuestHero');
    const raw = localStorage.getItem('kidcode_hero');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw).name).toBe('GuestHero');
  });

  it('two different users have separate hero data', () => {
    setCurrentUser('user_1');
    createHero('HeroOne');

    setCurrentUser('user_2');
    createHero('HeroTwo');

    setCurrentUser('user_1');
    expect(getHero().name).toBe('HeroOne');

    setCurrentUser('user_2');
    expect(getHero().name).toBe('HeroTwo');
  });
});
