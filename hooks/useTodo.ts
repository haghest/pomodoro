// hooks/useTodo.ts
import { useEffect, useState } from "react";

export function useTodoList() {
  const [todos, setTodos] = useState<string[]>([]);

  // Load dari localStorage saat pertama kali mount
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  // Simpan ke localStorage setiap kali todos berubah
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (task: string) => setTodos((prev) => [...prev, task]);
  const removeTodo = (index: number) =>
    setTodos((prev) => prev.filter((_, i) => i !== index));
  const toggleTodo = (index: number) => {
    setTodos((prev) =>
      prev.map((task, i) =>
        i === index
          ? task.startsWith("[x] ")
            ? task.slice(4)
            : `[x] ${task}`
          : task,
      ),
    );
  };

  return { todos, addTodo, removeTodo, toggleTodo };
}
