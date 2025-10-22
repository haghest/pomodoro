import { useState, useEffect, useRef } from "react";

type Mode = "focus" | "break" | "longBreak";

export function useTimer(
  initialFocusMinutes = 25,
  initialBreakMinutes = 5,
  initialLongBreakMinutes = 15,
) {
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(() => initialFocusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const focusAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakAudioRef = useRef<HTMLAudioElement | null>(null);
  const didFinishRef = useRef(false);

  // 🎧 Inisialisasi audio
  useEffect(() => {
    focusAudioRef.current = new Audio("/finish.mp3");
    breakAudioRef.current = new Audio("/finish.mp3");
  }, []);

  // ▶️ Controls
  const start = () => {
    setIsRunning(true);
    didFinishRef.current = false;
  };
  const pause = () => setIsRunning(false);
  const reset = (minutes?: number) => {
    setIsRunning(false);
    didFinishRef.current = false;
    const mins =
      typeof minutes === "number"
        ? minutes
        : mode === "focus"
          ? initialFocusMinutes
          : mode === "break"
            ? initialBreakMinutes
            : initialLongBreakMinutes;
    setTimeLeft(mins * 60);
  };

  // 🔁 Ganti mode
  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    didFinishRef.current = false;
    setMode(newMode);

    const mins =
      newMode === "focus"
        ? initialFocusMinutes
        : newMode === "break"
          ? initialBreakMinutes
          : initialLongBreakMinutes;

    setTimeLeft(mins * 60);
  };

  // ⏱️ Interval tick
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // 🔔 Handle waktu habis
  useEffect(() => {
    if (timeLeft === 0 && isRunning && !didFinishRef.current) {
      didFinishRef.current = true;
      setTimeout(() => {
        setIsRunning(false);
        const audio =
          mode === "focus" ? focusAudioRef.current : breakAudioRef.current;
        audio?.play().catch(() => {});
      }, 0);
    }
  }, [timeLeft, isRunning, mode]);

  // 🪄 Update document title setiap detik
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const secs = (timeLeft % 60).toString().padStart(2, "0");

    const label =
      mode === "focus" ? "Focus" : mode === "break" ? "Break" : "Long Break";

    if (isRunning) {
      const emoji = mode === "focus" ? "💻" : mode === "break" ? "☕" : "🌿";
      document.title = `${emoji} ${mins}:${secs} — ${label}`;
    } else {
      document.title = `${label} Mode — Pomodoro 🍅`;
    }
  }, [timeLeft, mode, isRunning]);

  // Return data dan fungsi
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    mode,
    minutes,
    seconds,
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    switchMode,
  } as const;
}
