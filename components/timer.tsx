"use client";

import { useEffect, useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

export default function Timer() {
  const {
    mode,
    minutes,
    seconds,
    isRunning,
    start,
    pause,
    reset,
    switchMode,
    timeLeft,
  } = useTimer(25, 5, 15); // ✅ long break

  const [focusSessions, setFocusSessions] = useState(0);

  // 🔁 Reset waktu sesuai mode
  useEffect(() => {
    if (mode === "focus") reset(25);
    else if (mode === "break") reset(5);
    else reset(15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // 🧠 Ambil data sesi hari ini
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("focusSessions");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) setFocusSessions(parsed.count);
    }
  }, []);

  // 🎯 Simpan sesi fokus selesai
  const incrementSession = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("focusSessions");
    let data = { date: today, count: 0 };

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) data = parsed;
    }

    data.count += 1;
    localStorage.setItem("focusSessions", JSON.stringify(data));
    setFocusSessions(data.count);
  };

  // ✅ Auto reset ketika waktu habis
  useEffect(() => {
    if (minutes === 0 && seconds === 0 && isRunning) {
      pause();

      if (mode === "focus") incrementSession();

      // beri sedikit jeda biar efeknya smooth
      const timeout = setTimeout(() => {
        if (mode === "focus") reset(25);
        else if (mode === "break") reset(5);
        else reset(15);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [minutes, seconds, isRunning, mode, pause, reset]);

  // 🧩 Fix utama: reset otomatis kalau user tekan Start saat waktu 0
  const handleStart = () => {
    if (timeLeft === 0) {
      if (mode === "focus") reset(25);
      else if (mode === "break") reset(5);
      else reset(15);
      // beri sedikit delay supaya reset selesai dulu
      setTimeout(() => start(), 100);
    } else {
      start();
    }
  };

  return (
    <div>
      <Tabs
        value={mode}
        onValueChange={(val) =>
          switchMode(val as "focus" | "break" | "longBreak")
        }
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="break">Break</TabsTrigger>
          <TabsTrigger value="longBreak">Long Break</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="rounded-xl text-center p-6 relative">
        <div className="absolute top-2 right-2">
          <ModeToggle />
        </div>

        <CardContent>
          <h1 className="text-7xl my-6 select-none font-semibold">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </h1>

          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button onClick={handleStart}>Start</Button>
            ) : (
              <Button variant="secondary" onClick={pause}>
                Pause
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() =>
                reset(mode === "focus" ? 25 : mode === "break" ? 5 : 15)
              }
            >
              <RotateCcw />
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Mode:{" "}
            {mode === "focus"
              ? "Focus (25:00)"
              : mode === "break"
                ? "Break (5:00)"
                : "Long Break (15:00)"}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            🔥 Focus sessions today: {focusSessions}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
