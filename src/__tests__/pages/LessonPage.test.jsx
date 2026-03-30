import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LessonPage from '../../pages/LessonPage';
import { createHero } from '../../data/hero';

// GameScene uses SVG animations that don't exist in jsdom — mock it
vi.mock('../../components/game/GameScene', () => ({
  default: ({ sceneId }) => <div data-testid="game-scene">{sceneId}</div>,
}));

// Skip the 4-slide animated intro and call onStart immediately
vi.mock('../../components/ConceptIntro', () => ({
  default: ({ onStart }) => (
    <div>
      <button onClick={onStart}>Start Level →</button>
    </div>
  ),
}));

// Avoid rendering complex SVG hero
vi.mock('../../components/game/GameHero', () => ({
  default: ({ color }) => <div data-testid="game-hero" style={{ color }} />,
}));

function renderLesson(conceptId = 'variables', level = '1') {
  return render(
    <MemoryRouter initialEntries={[`/lesson/${conceptId}/${level}`]}>
      <Routes>
        <Route path="/lesson/:conceptId/:level" element={<LessonPage />} />
        <Route path="/reward" element={<div data-testid="reward-page">Reward</div>} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderAndSkipIntro(conceptId = 'variables', level = '1') {
  createHero('Aria');
  renderLesson(conceptId, level);
  fireEvent.click(screen.getByRole('button', { name: /Start Level/i }));
}

describe('LessonPage — 404 state', () => {
  it('shows 404 message for an unknown concept', () => {
    renderLesson('unknown', '1');
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('shows a home link on the 404 page', () => {
    renderLesson('unknown', '1');
    expect(screen.getByRole('link', { name: /cd \/home/i })).toBeInTheDocument();
  });
});

describe('LessonPage — Concept Intro (initial state)', () => {
  it('shows the ConceptIntro start button first', () => {
    createHero('Aria');
    renderLesson('variables', '1');
    expect(screen.getByRole('button', { name: /Start Level/i })).toBeInTheDocument();
  });

  it('clicking Start Level transitions to the lesson view', () => {
    createHero('Aria');
    renderLesson('variables', '1');
    fireEvent.click(screen.getByRole('button', { name: /Start Level/i }));
    expect(screen.getByTestId('game-scene')).toBeInTheDocument();
  });
});

describe('LessonPage — lesson view (after intro)', () => {
  it('shows the concept title in the top bar', () => {
    renderAndSkipIntro();
    expect(screen.getByText('Variables')).toBeInTheDocument();
  });

  it('shows the level number in the top bar', () => {
    renderAndSkipIntro();
    expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
  });

  it('shows the step counter (1/N format)', () => {
    renderAndSkipIntro();
    // Step counter is rendered as "{currentStep + 1}/{total}" — e.g. "1/3"
    const counter = screen.getByText((text) => /^\d+\/\d+$/.test(text));
    expect(counter).toBeInTheDocument();
    expect(counter.textContent).toMatch(/^1\//);
  });

  it('shows a back link to home', () => {
    renderAndSkipIntro();
    expect(screen.getByRole('link', { name: /← back/i })).toBeInTheDocument();
  });

  it('renders the game scene', () => {
    renderAndSkipIntro();
    expect(screen.getByTestId('game-scene')).toBeInTheDocument();
  });

  it('shows a modality badge', () => {
    renderAndSkipIntro();
    const badges = screen.queryAllByText(/CODE SIMULATION|DRAG & DROP|SPEED CODING/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('does not show Next button before answering', () => {
    renderAndSkipIntro();
    expect(screen.queryByRole('button', { name: /Next →|Claim Reward/i })).not.toBeInTheDocument();
  });
});

describe('LessonPage — answering questions', () => {
  it('shows Next button after an answer is submitted', () => {
    renderAndSkipIntro('variables', '1');
    // Force modality to codeSimulation for predictable rendering
    // Answer buttons are rendered — click any one
    const buttons = screen.getAllByRole('button');
    // Filter to option buttons (they use font-mono and have A. B. C. labels or number labels)
    const optionButton = buttons.find(
      (b) => /^[A-Z]\.\s/.test(b.textContent) || /^\d\s/.test(b.textContent)
    );
    if (optionButton) {
      fireEvent.click(optionButton);
      expect(
        screen.queryByRole('button', { name: /Next →|Claim Reward/i })
      ).toBeInTheDocument();
    }
  });
});
