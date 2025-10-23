"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Load tasks dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // tunda setTasks ke tick berikutnya
        setTimeout(() => setTasks(parsed), 0);
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
      }
    }
  }, []);

  // Simpan tasks ke localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: Date.now(),
      text: trimmed,
      done: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const startEditing = (id: number) => {
    setEditingId(id);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const finishEditing = (id: number, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) {
      removeTask(id);
    } else {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, text: trimmed } : task,
        ),
      );
    }
    setEditingId(null);
  };

  return (
    <div className="w-full mt-8">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="To do list.."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <Button onClick={addTask} size="icon">
          <Plus />
        </Button>
      </div>

      <ul className="mt-6 space-y-2">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between bg-secondary/40 dark:bg-secondary/20 rounded-2xl p-3"
            >
              <div className="flex items-center gap-2 w-full">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                {editingId === task.id ? (
                  <Input
                    ref={editInputRef}
                    value={task.text}
                    onChange={(e) => {
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id ? { ...t, text: e.target.value } : t,
                        ),
                      );
                    }}
                    onBlur={() => finishEditing(task.id, task.text)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") finishEditing(task.id, task.text);
                    }}
                    className="flex-1 text-sm md:text-base"
                  />
                ) : (
                  <span
                    className={`flex-1 text-sm md:text-base cursor-text ${
                      task.done
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                    onClick={() => startEditing(task.id)}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTask(task.id)}
              >
                ✕
              </Button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
