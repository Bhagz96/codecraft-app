import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CodeSimulation from '../../components/CodeSimulation';

const baseStep = {
  codeSnippet: 'hero_name = "Aria"\nprint(hero_name)',
  traceQuestion: 'What does this print?',
  options: ['"Aria"', 'hero_name', 'None'],
  correctIndex: 0,
  explanation: 'print() outputs the value stored in hero_name.',
};

describe('CodeSimulation', () => {
  it('renders the CODE SIMULATION badge', () => {
    render(<CodeSimulation step={baseStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('CODE SIMULATION')).toBeInTheDocument();
  });

  it('renders the trace question', () => {
    render(<CodeSimulation step={baseStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('What does this print?')).toBeInTheDocument();
  });

  it('renders all answer options', () => {
    render(<CodeSimulation step={baseStep} onAnswer={() => {}} feedback={null} />);
    // Use getAllByRole to avoid ambiguity with syntax-highlighted code display
    const buttons = screen.getAllByRole('button');
    const buttonTexts = buttons.map((b) => b.textContent);
    expect(buttonTexts.some((t) => t.includes('"Aria"'))).toBe(true);
    expect(buttonTexts.some((t) => t.includes('hero_name'))).toBe(true);
    expect(buttonTexts.some((t) => t.includes('None'))).toBe(true);
  });

  it('calls onAnswer with the clicked index', () => {
    const onAnswer = vi.fn();
    render(<CodeSimulation step={baseStep} onAnswer={onAnswer} feedback={null} />);
    const buttons = screen.getAllByRole('button');
    const ariaBtn = buttons.find((b) => b.textContent.includes('"Aria"'));
    fireEvent.click(ariaBtn);
    expect(onAnswer).toHaveBeenCalledWith(0);
  });

  it('shows correct feedback with explanation', () => {
    render(<CodeSimulation step={baseStep} onAnswer={() => {}} feedback="correct" />);
    expect(screen.getByText(/print\(\) outputs/i)).toBeInTheDocument();
  });

  it('shows incorrect feedback with explanation', () => {
    render(<CodeSimulation step={baseStep} onAnswer={() => {}} feedback="incorrect" />);
    expect(screen.getByText(/print\(\) outputs/i)).toBeInTheDocument();
  });

  it('disables answer buttons after feedback is given', () => {
    render(<CodeSimulation step={baseStep} onAnswer={() => {}} feedback="correct" />);
    const buttons = screen.getAllByRole('button');
    for (const btn of buttons) {
      expect(btn).toBeDisabled();
    }
  });

  it('does not call onAnswer when a button is clicked after feedback', () => {
    const onAnswer = vi.fn();
    render(<CodeSimulation step={baseStep} onAnswer={onAnswer} feedback="correct" />);
    const buttons = screen.getAllByRole('button');
    const ariaBtn = buttons.find((b) => b.textContent.includes('"Aria"'));
    fireEvent.click(ariaBtn);
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it('falls back to step.instruction when traceQuestion is absent', () => {
    const step = { ...baseStep, traceQuestion: undefined, instruction: 'Fallback instruction' };
    render(<CodeSimulation step={step} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('Fallback instruction')).toBeInTheDocument();
  });

  it('renders the filename "simulation.py"', () => {
    render(<CodeSimulation step={baseStep} onAnswer={() => {}} feedback={null} />);
    expect(screen.getByText('simulation.py')).toBeInTheDocument();
  });
});
