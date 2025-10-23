"use client";

import { useEffect, useState, useCallback } from "react";

export function useSessionTracker() {
  const todayKey = new Date().toISOString().split("T")[0];
  const [count, setCount] = useState(0);

  // Load data dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sessionTracker");
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === todayKey) {
        setCount(data.count);
      } else {
        // reset jika sudah ganti hari
        localStorage.setItem(
          "sessionTracker",
          JSON.stringify({ date: todayKey, count: 0 }),
        );
      }
    } else {
      localStorage.setItem(
        "sessionTracker",
        JSON.stringify({ date: todayKey, count: 0 }),
      );
    }
  }, [todayKey]);

  // Fungsi tambah sesi
  const incrementSession = useCallback(() => {
    setCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem(
        "sessionTracker",
        JSON.stringify({ date: todayKey, count: newCount }),
      );
      return newCount;
    });
  }, [todayKey]);

  return { count, incrementSession };
}
