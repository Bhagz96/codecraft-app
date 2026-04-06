import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioControl } from '../../components/AudioControl';

const defaultProps = {
  isMuted: false,
  toggleMute: vi.fn(),
  musicVolume: 0.55,
  setMusicVolume: vi.fn(),
};

describe('AudioControl', () => {
  it('renders an audio button', () => {
    render(<AudioControl {...defaultProps} />);
    expect(screen.getByTitle('Audio settings')).toBeInTheDocument();
  });

  it('shows high-volume icon when unmuted and volume is high', () => {
    render(<AudioControl {...defaultProps} musicVolume={0.8} />);
    expect(screen.getByTitle('Audio settings')).toHaveTextContent('🔊');
  });

  it('shows muted icon when isMuted is true', () => {
    render(<AudioControl {...defaultProps} isMuted={true} />);
    expect(screen.getByTitle('Audio settings')).toHaveTextContent('🔇');
  });

  it('shows low-volume icon when volume is low', () => {
    render(<AudioControl {...defaultProps} musicVolume={0.2} />);
    expect(screen.getByTitle('Audio settings')).toHaveTextContent('🔈');
  });

  it('opens volume panel when button is clicked', () => {
    render(<AudioControl {...defaultProps} />);
    fireEvent.click(screen.getByTitle('Audio settings'));
    expect(screen.getByRole('slider', { name: /music volume/i })).toBeInTheDocument();
  });

  it('panel is hidden by default', () => {
    render(<AudioControl {...defaultProps} />);
    expect(screen.queryByRole('slider', { name: /music volume/i })).not.toBeInTheDocument();
  });

  it('calls toggleMute when mute button in panel is clicked', () => {
    const toggleMute = vi.fn();
    render(<AudioControl {...defaultProps} toggleMute={toggleMute} />);
    fireEvent.click(screen.getByTitle('Audio settings'));
    fireEvent.click(screen.getByRole('button', { name: /mute/i }));
    expect(toggleMute).toHaveBeenCalledTimes(1);
  });

  it('calls setMusicVolume when slider changes', () => {
    const setMusicVolume = vi.fn();
    render(<AudioControl {...defaultProps} setMusicVolume={setMusicVolume} />);
    fireEvent.click(screen.getByTitle('Audio settings'));
    fireEvent.change(screen.getByRole('slider', { name: /music volume/i }), { target: { value: '0.4' } });
    expect(setMusicVolume).toHaveBeenCalledWith(0.4);
  });

  it('slider value reflects current musicVolume', () => {
    render(<AudioControl {...defaultProps} musicVolume={0.3} />);
    fireEvent.click(screen.getByTitle('Audio settings'));
    expect(screen.getByRole('slider', { name: /music volume/i })).toHaveValue('0.3');
  });
});
