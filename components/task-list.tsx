"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; // ✅ gunakan sonner
import { updateDailyLog } from "@/hooks/useDailyLog";

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
  const hasShownToastRef = useRef(false);

  // 🔧 Helper untuk menjaga urutan: task belum selesai di atas
  const sortTasks = (arr: Task[]) =>
    [...arr].sort((a, b) => Number(a.done) - Number(b.done));

  // 🔹 Load tasks dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setTasks(sortTasks(parsed)), 0);
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
      }
    }
  }, []);

  // 🔹 Simpan tasks ke localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 🎉 Toast ketika semua task selesai
  useEffect(() => {
    const allDone = tasks.length > 0 && tasks.every((t) => t.done);
    if (allDone && !hasShownToastRef.current) {
      toast.success("🎉 Semua tugas selesai!", {
        description: "Kerja bagus, kamu bisa istirahat sebentar ☕",
      });
      hasShownToastRef.current = true;
    }
    if (!allDone) hasShownToastRef.current = false;
  }, [tasks]);

  // ➕ Tambah task baru
  const addTask = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTask: Task = { id: Date.now(), text: trimmed, done: false };
    setTasks((prev) => sortTasks([newTask, ...prev]));
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // ✅ Toggle selesai/tidak dan re-sort
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      sortTasks(
        prev.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task,
        ),
      ),
    );
  };

  // ❌ Hapus task
  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // ✏️ Mulai edit
  const startEditing = (id: number) => {
    setEditingId(id);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  // ✅ Selesai edit
  const finishEditing = (id: number, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) {
      removeTask(id);
    } else {
      setTasks((prev) =>
        sortTasks(
          prev.map((task) =>
            task.id === id ? { ...task, text: trimmed } : task,
          ),
        ),
      );
    }
    setEditingId(null);
  };

  return (
    <div className="w-full mt-6">
      {/* Input dan tombol tambah */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="To do list.."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask} size="icon">
          <Plus />
        </Button>
      </div>

      {/* Daftar task */}
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
                    onChange={(e) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id ? { ...t, text: e.target.value } : t,
                        ),
                      )
                    }
                    onBlur={() => finishEditing(task.id, task.text)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && finishEditing(task.id, task.text)
                    }
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
