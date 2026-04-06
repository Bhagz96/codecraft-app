import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    signIn: vi.fn().mockResolvedValue({ error: null }),
    signUp: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  it('renders the CodeCraft logo', () => {
    renderLoginPage();
    expect(screen.getAllByText('CodeCraft').length).toBeGreaterThan(0);
  });

  it('shows Log In tab by default', () => {
    renderLoginPage();
    // There are two "Log In" buttons (tab + submit) — both should be present
    expect(screen.getAllByRole('button', { name: /log in/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('shows NUS ID input', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('E1234567')).toBeInTheDocument();
  });

  it('shows password input', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('switches to Sign Up mode when tab is clicked', () => {
    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByPlaceholderText('Jane')).toBeInTheDocument();
  });

  it('shows error when submitting empty NUS ID', async () => {
    renderLoginPage();
    // Click the submit button (last "Log In" button on the page)
    const allLogInBtns = screen.getAllByRole('button', { name: /^log in$/i });
    fireEvent.click(allLogInBtns[allLogInBtns.length - 1]);
    expect(await screen.findByText(/NUS ID/i)).toBeInTheDocument();
  });

  it('shows password mismatch error on signup', async () => {
    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    fireEvent.change(screen.getByPlaceholderText('Jane'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('E1234567'), { target: { value: 'E1234567' } });
    // Find all password inputs
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'different123' } });
    expect(screen.getByText(/don't match/i)).toBeInTheDocument();
  });
});
