"use client";

import { useCallback, useState } from "react";

const isNotificationSupported =
  typeof window !== "undefined" && "Notification" in window;

export function useNotification() {
  // baca permission langsung saat hook dijalankan di client (lazy initial state)
  const [permission, setPermission] = useState<NotificationPermission>(
    isNotificationSupported ? Notification.permission : "default",
  );

  const requestPermission = useCallback(async () => {
    if (!isNotificationSupported) {
      // fallback UX: beri info ke user
      alert("Browser Anda tidak mendukung Notification API.");
      return "denied";
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (e) {
      // beberapa browser/edge-case mungkin throw
      console.warn("requestPermission failed:", e);
      setPermission("denied");
      return "denied";
    }
  }, []);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isNotificationSupported) return;
      if (Notification.permission === "granted") {
        try {
          new Notification(title, {
            icon: "/icon.png", // optional
            ...options,
          });
        } catch (e) {
          // fallback: mungkin permission revoked atau error
          console.warn("Failed to show notification", e);
        }
      }
    },
    [],
  );

  return { permission, requestPermission, showNotification } as const;
}
