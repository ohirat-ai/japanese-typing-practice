import { useCallback, useRef, useEffect } from 'react';

interface SoundEffectsOptions {
  enabled: boolean;
  volume: number;
}

const createAudioContext = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContext();
};

export const useSoundEffects = (options: SoundEffectsOptions = { enabled: true, volume: 0.3 }) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (options.enabled && !audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [options.enabled]);

  const playCorrectSound = useCallback(() => {
    if (!options.enabled || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Pleasant "correct" sound
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(options.volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  }, [options.enabled, options.volume]);

  const playIncorrectSound = useCallback(() => {
    if (!options.enabled || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Lower "error" sound
    oscillator.frequency.setValueAtTime(300, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(options.volume * 0.7, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.15);
  }, [options.enabled, options.volume]);

  const playCompletionSound = useCallback(() => {
    if (!options.enabled || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (higher octave)

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      const startTime = context.currentTime + index * 0.1;
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(options.volume, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }, [options.enabled, options.volume]);

  return {
    playCorrectSound,
    playIncorrectSound,
    playCompletionSound,
  };
};