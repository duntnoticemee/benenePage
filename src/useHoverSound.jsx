// useHoverSound.js
import { useRef } from 'react';

export default function useHoverSound(soundUrl, volume = 0.5) {
  const audioRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(soundUrl);
    audioRef.current.volume = volume;
  }

  const playSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0; // rewind for repeated hover
    audio.play().catch(() => {}); // ignore if autoplay blocked
  };

  return playSound;
}
