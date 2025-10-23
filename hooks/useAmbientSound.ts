"use client";

import { useEffect, useRef, useState } from "react";

export function useAmbientSound() {
  const [sound, setSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const soundMap: Record<string, string> = {
    rain: "/sounds/rain.mp3",
    cafe: "/sounds/cafe.mp3",
    fire: "/sounds/fire.mp3",
    ocean: "/sounds/ocean.mp3",
    night: "/sounds/night.mp3",
    train: "/sounds/train.mp3",
  };

  // Main audio effect
  useEffect(() => {
    if (!sound) return;

    const audio = new Audio(soundMap[sound]);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [sound]);

  // Instant volume change
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Stop dengan fade-out
  const stopSound = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    let v = audio.volume;

    const fadeOut = setInterval(() => {
      v -= 0.05;
      if (v <= 0) {
        clearInterval(fadeOut);
        audio.pause();
        audio.currentTime = 0;
        audioRef.current = null;
        setSound(null);
        setIsPlaying(false);
      } else {
        audio.volume = v;
      }
    }, 50);
  };

  return {
    sound,
    setSound,
    isPlaying,
    setIsPlaying,
    stopSound,
    volume,
    setVolume,
    audioRef,
  };
}
