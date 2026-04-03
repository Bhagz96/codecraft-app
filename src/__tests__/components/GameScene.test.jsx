import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameScene from '../../components/game/GameScene';

const hero = { name: 'Aria', color: '#00d4ff', health: 110, maxHealth: 110, gold: 60, avatarId: 'm01' };

describe('GameScene — ObstacleScene (conditions L1)', () => {
  describe('heroCheckWeather', () => {
    it('renders the rocky shelter label in idle state', () => {
      render(
        <GameScene
          sceneId="mountain-obstacle"
          hero={hero}
          gameAction="heroCheckWeather"
          sceneConfig={{ varDisplay: 'temp = 35', conditionLabel: 'if temp > 30:', successAction: '→ rest in shade' }}
        />
      );
      expect(screen.getByText(/rocky shelter|rest in shade/i)).toBeInTheDocument();
    });

    it('renders the summit direction indicator', () => {
      render(
        <GameScene
          sceneId="mountain-obstacle"
          hero={hero}
          gameAction="heroCheckWeather"
          sceneConfig={{ varDisplay: 'temp = 35', conditionLabel: 'if temp > 30:' }}
        />
      );
      expect(screen.getByText(/SUMMIT/i)).toBeInTheDocument();
    });

    it('renders the condition panel with varDisplay', () => {
      render(
        <GameScene
          sceneId="mountain-obstacle"
          hero={hero}
          gameAction="heroCheckWeather"
          sceneConfig={{ varDisplay: 'temp = 35', conditionLabel: 'if temp > 30:' }}
        />
      );
      expect(screen.getByText('temp = 35')).toBeInTheDocument();
    });

    it('shows success action when result is correct', () => {
      render(
        <GameScene
          sceneId="mountain-obstacle"
          result="correct"
          hero={hero}
          gameAction="heroCheckWeather"
          sceneConfig={{ varDisplay: 'temp = 35', conditionLabel: 'if temp > 30:', successAction: '→ rest in shade' }}
        />
      );
      expect(screen.getByText('→ rest in shade')).toBeInTheDocument();
    });
  });

  describe('heroObstacle — energy barrier', () => {
    it('renders the gorge / energy barrier scene', () => {
      render(
        <GameScene
          sceneId="mountain-obstacle"
          hero={hero}
          gameAction="heroObstacle"
          sceneConfig={{ varDisplay: 'energy = 15', conditionLabel: 'if energy >= 20:' }}
        />
      );
      // Should show energy barrier label or condition label
      expect(screen.getByText('energy = 15')).toBeInTheDocument();
    });

    it('renders the obstacle condition label', () => {
      render(
        <GameScene
          sceneId="mountain-obstacle"
          hero={hero}
          gameAction="heroObstacle"
          sceneConfig={{ varDisplay: 'energy = 15', conditionLabel: 'if energy >= 20:' }}
        />
      );
      expect(screen.getByText(/if energy >= 20:/)).toBeInTheDocument();
    });
  });

  describe('heroForkPath', () => {
    it('renders the two path choices', () => {
      render(
        <GameScene
          sceneId="mountain-obstacle"
          hero={hero}
          gameAction="heroForkPath"
          sceneConfig={{ varDisplay: 'a=7 · b=3', conditionLabel: 'if a > b:', pathALabel: '⚠ A: 7', pathBLabel: '✓ B: 3' }}
        />
      );
      expect(screen.getByText(/A: 7|⚠/)).toBeInTheDocument();
    });

    it('renders the path condition variable display', () => {
      render(
        <GameScene
          sceneId="mountain-obstacle"
          hero={hero}
          gameAction="heroForkPath"
          sceneConfig={{ varDisplay: 'a=7 · b=3', conditionLabel: 'if a > b:' }}
        />
      );
      expect(screen.getByText('a=7 · b=3')).toBeInTheDocument();
    });
  });
});
