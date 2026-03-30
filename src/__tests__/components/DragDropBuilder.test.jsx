import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DragDropBuilder from '../../components/DragDropBuilder';

const baseStep = {
  instruction: 'Arrange the code blocks',
  codeBlocks: ['hero_name = "Aria"', 'print(hero_name)'],
  correctOrder: [0, 1],
  options: [],
  explanation: 'You must assign before printing.',
};

const hero = { name: 'Aria', color: '#00d4ff' };

describe('DragDropBuilder', () => {
  it('renders the DRAG & DROP mode badge', () => {
    render(<DragDropBuilder step={baseStep} onAnswer={() => {}} feedback={null} hero={hero} />);
    expect(screen.getByText('DRAG & DROP')).toBeInTheDocument();
  });

  it('renders all code blocks', () => {
    render(<DragDropBuilder step={baseStep} onAnswer={() => {}} feedback={null} hero={hero} />);
    expect(screen.getByText('hero_name = "Aria"')).toBeInTheDocument();
    expect(screen.getByText('print(hero_name)')).toBeInTheDocument();
  });

  it('renders the correct number of drop slots', () => {
    render(<DragDropBuilder step={baseStep} onAnswer={() => {}} feedback={null} hero={hero} />);
    // There should be 2 slots (matching correctOrder.length)
    const slots = screen.getAllByText(/^Line \d/i);
    expect(slots.length).toBe(2);
  });

  it('shows explanation after correct feedback', () => {
    render(<DragDropBuilder step={baseStep} onAnswer={() => {}} feedback="correct" hero={hero} />);
    expect(screen.getByText(/You must assign before printing/i)).toBeInTheDocument();
  });

  it('shows explanation after incorrect feedback', () => {
    render(<DragDropBuilder step={baseStep} onAnswer={() => {}} feedback="incorrect" hero={hero} />);
    expect(screen.getByText(/You must assign before printing/i)).toBeInTheDocument();
  });

  it('shows the "Place all blocks first…" button when no slots are filled', () => {
    render(<DragDropBuilder step={baseStep} onAnswer={() => {}} feedback={null} hero={hero} />);
    expect(screen.getByRole('button', { name: /Place all blocks first/i })).toBeInTheDocument();
  });

  it('does not show the run button after feedback is given', () => {
    render(<DragDropBuilder step={baseStep} onAnswer={() => {}} feedback="correct" hero={hero} />);
    expect(screen.queryByRole('button', { name: /Place all blocks|Run Code/i })).not.toBeInTheDocument();
  });

  it('falls back to step.options when codeBlocks is absent', () => {
    const stepWithOptions = {
      ...baseStep,
      codeBlocks: undefined,
      options: ['line_a', 'line_b'],
    };
    render(<DragDropBuilder step={stepWithOptions} onAnswer={() => {}} feedback={null} hero={hero} />);
    expect(screen.getByText('line_a')).toBeInTheDocument();
    expect(screen.getByText('line_b')).toBeInTheDocument();
  });
});
