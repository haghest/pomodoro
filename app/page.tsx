"use client";

import { useEffect } from "react";
import { useTimer } from "@/hooks/useTimer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ModeToggle } from "@/components/theme-toggle";
import { AmbientSound } from "@/components/ambient-sound";
import { RotateCcw } from "lucide-react";
import TaskList from "@/components/task-list";

export default function PomodoroPage() {
  const { mode, minutes, seconds, isRunning, start, pause, reset, switchMode } =
    useTimer(25, 5, 15); // ✅ tambahkan 15 untuk long break

  useEffect(() => {
    if (mode === "focus") reset(25);
    else if (mode === "break") reset(5);
    else reset(15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen  transition-colors duration-500 ${
        mode === "focus"
          ? "bg-white dark:bg-[#1f1f1f]"
          : mode === "break"
            ? "bg-white dark:bg-blue-900"
            : "bg-white dark:bg-green-900"
      }`}
    >
      <motion.div className="w-[450px] ">
        <AmbientSound />

        <div className="">
          <Tabs
            value={mode}
            onValueChange={(val) =>
              switchMode(val as "focus" | "break" | "longBreak")
            }
            className=" mb-8"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="break">Break</TabsTrigger>
              <TabsTrigger value="longBreak">Long Break</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="rounded-2xl text-center p-6 relative">
            <div className="absolute top-2 right-2">
              <ModeToggle />
            </div>

            <CardContent>
              <h1 className="text-6xl font-semibold my-6 select-none">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </h1>

              <div className="flex justify-center gap-3">
                {!isRunning ? (
                  <Button onClick={start}>Start</Button>
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
            </CardContent>
          </Card>
        </div>
      </motion.div>
      <div className="w-[450px]">
        <TaskList />
      </div>
    </div>
  );
}
