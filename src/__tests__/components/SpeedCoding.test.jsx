import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SpeedCoding from '../../components/SpeedCoding';

// Freeze timers so the countdown doesn't fire during tests
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const blankStep = {
  instruction: 'Fill in the blanks',
  codeTemplate: '___ = "{heroName}"\nprint(___)',
  blanks: [
    { position: 0, options: ['hero_name', '123', 'print'], correctIndex: 0 },
    { position: 1, options: ['hero_name', '"Aria"', 'print'], correctIndex: 0 },
  ],
  correctIndex: 0,
  explanation: 'Variables store values.',
};

const simpleStep = {
  instruction: 'Pick the right answer',
  options: ['hero_name', '"Aria"', 'None'],
  correctIndex: 0,
  explanation: 'hero_name is the variable.',
  blanks: [],
  codeTemplate: null,
};

describe('SpeedCoding — blank mode', () => {
  it('renders the SPEED CODING badge', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('SPEED CODING')).toBeInTheDocument();
  });

  it('renders the instruction', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('Fill in the blanks')).toBeInTheDocument();
  });

  it('renders blank option chips for each blank', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('Blank 1:')).toBeInTheDocument();
    expect(screen.getByText('Blank 2:')).toBeInTheDocument();
  });

  it('Submit button is disabled when no blanks are filled', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByRole('button', { name: /Submit Answer/i })).toBeDisabled();
  });

  it('Submit button enables after all blanks are selected', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback={null} />);
    // Find chip buttons by their container (Blank 1 and Blank 2 sections)
    // Each blank renders its options as buttons — use getAllByRole and filter
    const allButtons = screen.getAllByRole('button');
    // Click hero_name chip in blank 1 (first button with text 'hero_name')
    const heroNameBtns = allButtons.filter((b) => b.textContent === 'hero_name');
    fireEvent.click(heroNameBtns[0]); // blank 1
    fireEvent.click(heroNameBtns[1]); // blank 2
    expect(screen.getByRole('button', { name: /Submit Answer/i })).not.toBeDisabled();
  });

  it('calls onAnswer with correctIndex when all blanks are correct', () => {
    const onAnswer = vi.fn();
    render(<SpeedCoding step={blankStep} onAnswer={onAnswer} feedback={null} />);
    const allButtons = screen.getAllByRole('button');
    const heroNameBtns = allButtons.filter((b) => b.textContent === 'hero_name');
    fireEvent.click(heroNameBtns[0]);
    fireEvent.click(heroNameBtns[1]);
    fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }));
    expect(onAnswer).toHaveBeenCalledWith(0); // correctIndex
  });

  it('calls onAnswer with -1 when a blank is wrong', () => {
    const onAnswer = vi.fn();
    render(<SpeedCoding step={blankStep} onAnswer={onAnswer} feedback={null} />);
    // Select wrong option for blank 1 ('123') and correct for blank 2 ('hero_name')
    fireEvent.click(screen.getByRole('button', { name: '123' }));
    const allButtons = screen.getAllByRole('button');
    const heroNameBtns = allButtons.filter((b) => b.textContent === 'hero_name');
    fireEvent.click(heroNameBtns[heroNameBtns.length - 1]); // blank 2's hero_name
    fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }));
    expect(onAnswer).toHaveBeenCalledWith(-1);
  });

  it('shows explanation after feedback', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback="correct" />);
    expect(screen.getByText(/Variables store values/i)).toBeInTheDocument();
  });

  it('shows the timer countdown', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('20s')).toBeInTheDocument();
  });

  it('calls onAnswer(-1) when the timer runs out', () => {
    const onAnswer = vi.fn();
    render(<SpeedCoding step={blankStep} onAnswer={onAnswer} feedback={null} />);
    act(() => {
      vi.advanceTimersByTime(21000);
    });
    expect(onAnswer).toHaveBeenCalledWith(-1);
  });

  it('hides the timer after feedback', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback="correct" />);
    expect(screen.queryByText(/\d+s/)).not.toBeInTheDocument();
  });
});

describe('SpeedCoding — simple options mode (no blanks)', () => {
  it('renders all options', () => {
    render(<SpeedCoding step={simpleStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('hero_name')).toBeInTheDocument();
    expect(screen.getByText('"Aria"')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('calls onAnswer with the clicked option index', () => {
    const onAnswer = vi.fn();
    render(<SpeedCoding step={simpleStep} onAnswer={onAnswer} feedback={null} />);
    fireEvent.click(screen.getByText('hero_name').closest('button'));
    expect(onAnswer).toHaveBeenCalledWith(0);
  });

  it('disables options after feedback', () => {
    render(<SpeedCoding step={simpleStep} onAnswer={() => {}} feedback="correct" />);
    const buttons = screen.getAllByRole('button');
    for (const btn of buttons) {
      expect(btn).toBeDisabled();
    }
  });
});

describe('SpeedCoding — score display', () => {
  it('shows 0 pts initially', () => {
    render(<SpeedCoding step={blankStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('0 pts')).toBeInTheDocument();
  });
});
