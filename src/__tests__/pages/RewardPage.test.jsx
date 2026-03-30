import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RewardPage from '../../pages/RewardPage';

function renderWithState(state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/reward', state }]}>
      <Routes>
        <Route path="/reward" element={<RewardPage />} />
        <Route path="/" element={<div>Home</div>} />
        <Route path="/lesson/:conceptId/:level" element={<div>Lesson</div>} />
      </Routes>
    </MemoryRouter>
  );
}

const baseState = {
  rewardType: 'badge',
  conceptTitle: 'Variables',
  levelTitle: 'Create Your Hero',
  levelNum: 1,
  correctCount: 3,
  totalSteps: 3,
  conceptId: 'variables',
  xpEarned: 70,
  completion: {
    message: 'You built something great.',
    tip: 'Variables store data.',
    nextPreview: 'Next: Data Types',
  },
};

describe('RewardPage — no state (direct navigation)', () => {
  it('shows fallback message when no state is provided', () => {
    renderWithState(null);
    expect(screen.getByText(/complete a level to earn rewards/i)).toBeInTheDocument();
  });

  it('shows a home link when no state is provided', () => {
    renderWithState(null);
    expect(screen.getByRole('link', { name: /cd \/home/i })).toBeInTheDocument();
  });
});

describe('RewardPage — with state', () => {
  it('shows "Level Complete" heading', () => {
    renderWithState(baseState);
    expect(screen.getByText('Level Complete')).toBeInTheDocument();
  });

  it('shows the concept title and level number', () => {
    renderWithState(baseState);
    expect(screen.getByText(/Variables — Level 1/i)).toBeInTheDocument();
  });

  it('shows the correct/total score', () => {
    renderWithState(baseState);
    expect(screen.getByText(/3\/3 correct/i)).toBeInTheDocument();
  });

  it('shows XP earned', () => {
    renderWithState(baseState);
    expect(screen.getByText(/\+70 XP/i)).toBeInTheDocument();
  });

  it('shows "Perfect!" when all answers are correct', () => {
    renderWithState(baseState);
    expect(screen.getByText(/Perfect!/i)).toBeInTheDocument();
  });

  it('shows "Great job!" when score is 66–99%', () => {
    renderWithState({ ...baseState, correctCount: 2, totalSteps: 3 });
    expect(screen.getByText(/Great job!/i)).toBeInTheDocument();
  });

  it('shows "Keep practicing!" when score is below 66%', () => {
    renderWithState({ ...baseState, correctCount: 1, totalSteps: 3 });
    expect(screen.getByText(/Keep practicing!/i)).toBeInTheDocument();
  });

  it('shows completion message', () => {
    renderWithState(baseState);
    expect(screen.getByText('You built something great.')).toBeInTheDocument();
  });

  it('shows dev tip', () => {
    renderWithState(baseState);
    expect(screen.getByText('Variables store data.')).toBeInTheDocument();
  });

  it('shows next preview text', () => {
    renderWithState(baseState);
    expect(screen.getByText('Next: Data Types')).toBeInTheDocument();
  });

  it('shows "Next Level" link for levels 1–4', () => {
    renderWithState(baseState);
    expect(screen.getByRole('link', { name: /Next Level/i })).toBeInTheDocument();
  });

  it('does not show "Next Level" link when on level 5', () => {
    renderWithState({ ...baseState, levelNum: 5 });
    expect(screen.queryByRole('link', { name: /Next Level/i })).not.toBeInTheDocument();
  });

  it('shows "All Concepts" link', () => {
    renderWithState(baseState);
    expect(screen.getByRole('link', { name: /All Concepts/i })).toBeInTheDocument();
  });
});

describe('RewardPage — badge reward type', () => {
  it('shows "Badge Earned" heading', () => {
    renderWithState({ ...baseState, rewardType: 'badge' });
    expect(screen.getByText('Badge Earned')).toBeInTheDocument();
  });
});

describe('RewardPage — coins reward type', () => {
  it('shows "XP Earned" heading', () => {
    renderWithState({ ...baseState, rewardType: 'coins' });
    expect(screen.getByText('XP Earned')).toBeInTheDocument();
  });

  it('shows "credits" text', () => {
    renderWithState({ ...baseState, rewardType: 'coins' });
    expect(screen.getByText(/credits/i)).toBeInTheDocument();
  });
});

describe('RewardPage — mystery box reward type', () => {
  it('shows "Mystery Drop" before revealing', () => {
    renderWithState({ ...baseState, rewardType: 'mysteryBox' });
    expect(screen.getByText('Mystery Drop')).toBeInTheDocument();
  });

  it('shows "sudo reveal" button before revealing', () => {
    renderWithState({ ...baseState, rewardType: 'mysteryBox' });
    expect(screen.getByText(/sudo reveal/i)).toBeInTheDocument();
  });

  it('reveals the item after clicking the box', () => {
    renderWithState({ ...baseState, rewardType: 'mysteryBox' });
    const revealButton = screen.getByText(/sudo reveal/i).closest('button');
    fireEvent.click(revealButton);
    // After reveal, "Mystery Drop" heading should be gone and a rarity label appears
    expect(screen.queryByText('Mystery Drop')).not.toBeInTheDocument();
    // A rarity label (common/uncommon/rare/legendary) should be visible
    const rarities = ['common', 'uncommon', 'rare', 'legendary'];
    const found = rarities.some((r) => screen.queryByText(r));
    expect(found).toBe(true);
  });
});
