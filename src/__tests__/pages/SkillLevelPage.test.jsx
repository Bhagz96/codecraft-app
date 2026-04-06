import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SkillLevelPage from '../../pages/SkillLevelPage';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { user_metadata: { first_name: 'Jane' } },
    updateSkillLevel: vi.fn().mockResolvedValue(undefined),
  }),
}));

function renderSkillLevelPage() {
  return render(
    <MemoryRouter>
      <SkillLevelPage />
    </MemoryRouter>
  );
}

describe('SkillLevelPage', () => {
  it('greets the user by first name', () => {
    renderSkillLevelPage();
    expect(screen.getByText(/Hey, Jane/i)).toBeInTheDocument();
  });

  it('shows three skill level options', () => {
    renderSkillLevelPage();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('continue button is disabled until a level is selected', () => {
    renderSkillLevelPage();
    expect(screen.getByRole('button', { name: /select your level/i })).toBeDisabled();
  });

  it('selecting a level enables the continue button', () => {
    renderSkillLevelPage();
    fireEvent.click(screen.getByText('Beginner').closest('button'));
    expect(screen.getByRole('button', { name: /start as beginner/i })).not.toBeDisabled();
  });

  it('shows the correct continue label after selecting expert', () => {
    renderSkillLevelPage();
    fireEvent.click(screen.getByText('Expert').closest('button'));
    expect(screen.getByRole('button', { name: /start as expert/i })).toBeInTheDocument();
  });
});
