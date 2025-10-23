"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { Settings, Volume2, Sun, Moon, Laptop, Ellipsis } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sounds = [
  { id: "rain", label: "🌧️ Rain" },
  { id: "cafe", label: "☕ Cafe" },
  { id: "fire", label: "🔥 Fire" },
  { id: "ocean", label: "🌊 Ocean" },
  { id: "night", label: "🌙 Night" },
  { id: "train", label: "🚅 Train" },
];

export function SettingsModal() {
  const {
    sound,
    setSound,
    isPlaying,
    setIsPlaying,
    stopSound,
    volume,
    setVolume,
    audioRef,
  } = useAmbientSound();

  const { setTheme, theme } = useTheme();

  // Fade in/out untuk ambient sound
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    let fadeInterval: number | undefined;

    if (isPlaying) {
      audio.volume = 0;
      let v = 0;
      fadeInterval = window.setInterval(() => {
        v += 0.05;
        audio.volume = Math.min(v * volume, volume);
        if (v >= 1) clearInterval(fadeInterval);
      }, 50);
    } else {
      let v = volume;
      fadeInterval = window.setInterval(() => {
        v -= 0.05;
        audio.volume = Math.max(v, 0);
        if (v <= 0) clearInterval(fadeInterval);
      }, 50);
    }

    return () => clearInterval(fadeInterval);
  }, [sound, isPlaying]);

  return (
    <div className="flex justify-cente">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            size="icon"
          >
            <Settings className="size-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Settings</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-8 mt-4">
            {/* 🌿 Ambient Sound Section */}
            <div>
              <h3 className="font-medium mb-3">Ambient Sound</h3>
              <div className="grid grid-cols-2 gap-2">
                {sounds.map((s) => (
                  <Button
                    key={s.id}
                    variant={sound === s.id ? "default" : "outline"}
                    className="flex items-center gap-2 w-full"
                    onClick={() => {
                      if (sound === s.id && isPlaying) stopSound();
                      else {
                        setSound(s.id);
                        setIsPlaying(true);
                      }
                    }}
                  >
                    {sound === s.id && isPlaying && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Volume2 className="size-4" />
                      </motion.span>
                    )}
                    {s.label}
                  </Button>
                ))}
              </div>

              {/* Slider muncul hanya jika ada sound aktif */}
              <AnimatePresence mode="popLayout">
                {sound && (
                  <motion.div
                    key="controls"
                    layout
                    initial={{ opacity: 0, scaleY: 0.9 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center gap-2 mt-3"
                  >
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(val) => setVolume(val[0] / 100)}
                      className="w-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🌗 Theme Mode Section */}
            <div>
              <h3 className="font-medium mb-3">Appearance</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="size-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="size-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex items-center gap-2"
                >
                  <Laptop className="size-4" />
                  System
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
