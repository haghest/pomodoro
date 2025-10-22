"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const sounds = [
  { id: "rain", label: "🌧️ Rain" },
  { id: "cafe", label: "☕ Cafe" },
  { id: "fire", label: "🔥 Fire" },
  { id: "ocean", label: "🌊 Ocean" },
];

export function AmbientSound() {
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

  // Crossfade halus antar suara
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    let fadeInterval: number | undefined;

    if (isPlaying) {
      // Fade in
      audio.volume = 0;
      let v = 0;
      fadeInterval = window.setInterval(() => {
        v += 0.05;
        audio.volume = Math.min(v * volume, volume);
        if (v >= 1) clearInterval(fadeInterval);
      }, 50);
    } else {
      // Fade out
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
    <div className="w-full flex flex-col gap-3 my-6">
      {/* Tombol Ambient */}
      <div className="grid grid-cols-2 gap-2">
        {sounds.map((s) => (
          <Button
            key={s.id}
            variant={sound === s.id ? "default" : "outline"}
            className="flex items-center gap-2 w-full"
            onClick={() => {
              if (sound === s.id && isPlaying) {
                // klik lagi = stop sepenuhnya
                stopSound();
              } else {
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
            transition={{
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1], // natural ease
            }}
            className="flex items-center justify-center gap-2 mt-2 w-full"
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
  );
}
