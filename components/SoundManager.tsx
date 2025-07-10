'use client';

import { useEffect } from 'react';

// Simple sound manager for UI feedback
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  enable() {
    this.enabled = true;
    // Resume audio context if needed
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  disable() {
    this.enabled = false;
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sound effects
  success() {
    this.createTone(523.25, 0.2); // C5
    setTimeout(() => this.createTone(659.25, 0.2), 100); // E5
    setTimeout(() => this.createTone(783.99, 0.3), 200); // G5
  }

  click() {
    this.createTone(800, 0.1);
  }

  hover() {
    this.createTone(600, 0.05);
  }

  error() {
    this.createTone(200, 0.3);
  }

  notification() {
    this.createTone(400, 0.1);
    setTimeout(() => this.createTone(600, 0.1), 100);
  }
}

// Global sound manager instance
let soundManager: SoundManager | null = null;

export const getSoundManager = () => {
  if (!soundManager) {
    soundManager = new SoundManager();
  }
  return soundManager;
};

interface SoundProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function SoundProvider({ children, enabled = false }: SoundProviderProps) {
  useEffect(() => {
    const sm = getSoundManager();
    if (enabled) {
      sm.enable();
    } else {
      sm.disable();
    }
  }, [enabled]);

  return <>{children}</>;
}

// Custom hook for using sounds
export function useSound() {
  const soundManager = getSoundManager();
  
  return {
    playSuccess: () => soundManager.success(),
    playClick: () => soundManager.click(),
    playHover: () => soundManager.hover(),
    playError: () => soundManager.error(),
    playNotification: () => soundManager.notification(),
    enable: () => soundManager.enable(),
    disable: () => soundManager.disable(),
  };
}
