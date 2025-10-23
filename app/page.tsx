"use client";

import { motion } from "motion/react";
import Timer from "@/components/timer";
import TaskList from "@/components/task-list";

export default function PomodoroPage() {
  return (
    // <div
    //   className={`flex flex-col items-center justify-center min-h-screen  transition-colors duration-500 ${
    //     mode === "focus"
    //       ? "bg-white dark:bg-[#1f1f1f]"
    //       : mode === "break"
    //         ? "bg-white dark:bg-blue-900"
    //         : "bg-white dark:bg-green-900"
    //   }`}
    // >

    <motion.div className="sm:max-w-[500px] w-full px-6 md:py-32 py-12 mx-auto flex flex-col items-center justify-center min-h-screen">
      <Timer />
      <TaskList />
    </motion.div>

    // </div>
  );
}
