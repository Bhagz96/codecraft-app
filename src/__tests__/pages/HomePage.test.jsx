import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import { createHero, resetHero } from '../../data/hero';
import { resetProgress } from '../../data/progress';

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe('HomePage — story landing (no hero)', () => {
  it('shows the CodeCraft title', () => {
    renderHomePage();
    expect(screen.getByText('CodeCraft')).toBeInTheDocument();
  });

  it('shows the "Begin Your Quest" CTA button', () => {
    renderHomePage();
    expect(screen.getByRole('button', { name: /Begin Your Quest/i })).toBeInTheDocument();
  });

  it('shows the "The Summit Awaits" story section', () => {
    renderHomePage();
    expect(screen.getByText('The Summit Awaits')).toBeInTheDocument();
  });

  it('shows the three feature cards', () => {
    renderHomePage();
    expect(screen.getByText('Write Real Code')).toBeInTheDocument();
    expect(screen.getByText('Build a Game')).toBeInTheDocument();
    expect(screen.getByText('Level Up')).toBeInTheDocument();
  });

  it('clicking "Begin Your Quest" navigates to hero creation', () => {
    renderHomePage();
    fireEvent.click(screen.getByRole('button', { name: /Begin Your Quest/i }));
    expect(screen.getByText('Create Your Crafter')).toBeInTheDocument();
  });
});

describe('HomePage — hero creation screen', () => {
  it('shows the hero creation form after clicking CTA', () => {
    renderHomePage();
    fireEvent.click(screen.getByRole('button', { name: /Begin Your Quest/i }));
    expect(screen.getByPlaceholderText('Enter a name...')).toBeInTheDocument();
  });

  it('create button is disabled when name is empty', () => {
    renderHomePage();
    fireEvent.click(screen.getByRole('button', { name: /Begin Your Quest/i }));
    const createBtn = screen.getByRole('button', { name: /Enter a name first/i });
    expect(createBtn).toBeDisabled();
  });

  it('create button becomes enabled after typing a name', () => {
    renderHomePage();
    fireEvent.click(screen.getByRole('button', { name: /Begin Your Quest/i }));
    const input = screen.getByPlaceholderText('Enter a name...');
    fireEvent.change(input, { target: { value: 'Aria' } });
    expect(screen.getByRole('button', { name: /Start as Aria/i })).not.toBeDisabled();
  });

  it('shows the hero name in the create button', () => {
    renderHomePage();
    fireEvent.click(screen.getByRole('button', { name: /Begin Your Quest/i }));
    fireEvent.change(screen.getByPlaceholderText('Enter a name...'), { target: { value: 'Zara' } });
    expect(screen.getByRole('button', { name: /Start as Zara/i })).toBeInTheDocument();
  });

  it('clicking Back returns to the landing page', () => {
    renderHomePage();
    fireEvent.click(screen.getByRole('button', { name: /Begin Your Quest/i }));
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(screen.getByText('The Summit Awaits')).toBeInTheDocument();
  });

  it('shows 6 color swatches', () => {
    renderHomePage();
    fireEvent.click(screen.getByRole('button', { name: /Begin Your Quest/i }));
    // 6 color buttons + Back button = all buttons; filter by title attribute presence
    const colorButtons = screen.getAllByRole('button').filter((b) => b.title);
    expect(colorButtons.length).toBeGreaterThanOrEqual(6);
  });

  it('submitting a valid name transitions to the main home page', () => {
    renderHomePage();
    fireEvent.click(screen.getByRole('button', { name: /Begin Your Quest/i }));
    fireEvent.change(screen.getByPlaceholderText('Enter a name...'), { target: { value: 'TestHero' } });
    fireEvent.click(screen.getByRole('button', { name: /Start as TestHero/i }));
    // Should now show the concept picker
    expect(screen.getByText('Variables')).toBeInTheDocument();
  });
});

describe('HomePage — main concept picker (hero exists)', () => {
  it('shows all 3 concept cards', () => {
    createHero('Aria');
    renderHomePage();
    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('Loops')).toBeInTheDocument();
    expect(screen.getByText('Conditions')).toBeInTheDocument();
  });

  it('shows the hero name in the hero card', () => {
    createHero('Aria');
    renderHomePage();
    expect(screen.getByText('Aria')).toBeInTheDocument();
  });

  it('shows hero stats (level, HP, ATK, gold)', () => {
    createHero('Aria');
    renderHomePage();
    expect(screen.getByText(/Lvl 1/i)).toBeInTheDocument();
    expect(screen.getByText(/HP 100/i)).toBeInTheDocument();
  });

  it('shows Level 1 as an unlocked link for all concepts', () => {
    createHero('Aria');
    renderHomePage();
    const levelOneLinks = screen.getAllByTitle(/Level 1/i);
    expect(levelOneLinks.length).toBeGreaterThanOrEqual(3);
  });

  it('shows Level 2 as locked when no levels are completed', () => {
    createHero('Aria');
    renderHomePage();
    const lockedIcons = screen.getAllByTitle(/Locked/i);
    expect(lockedIcons.length).toBeGreaterThan(0);
  });

  it('shows 0/N progress for fresh hero', () => {
    createHero('Aria');
    renderHomePage();
    // Each concept card shows 0/total
    const zeroProgress = screen.getAllByText(/^0\//);
    expect(zeroProgress.length).toBe(3);
  });

  it('shows /admin link', () => {
    createHero('Aria');
    renderHomePage();
    expect(screen.getByRole('link', { name: /\/admin/i })).toBeInTheDocument();
  });

  it('shows completed checkmark when a level is done', () => {
    createHero('Aria');
    // Manually set progress
    localStorage.setItem('kidcode_progress', JSON.stringify({ variables: 1 }));
    renderHomePage();
    // Level 1 variables should show ✓
    expect(screen.getByTitle(/Level 1 — Create Your Hero \(Completed\)/i)).toBeInTheDocument();
  });
});
