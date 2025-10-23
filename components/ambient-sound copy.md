"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Volume2, VolumeX, Settings } from "lucide-react";
import { motion } from "framer-motion";

const sounds = [
  { id: "rain", label: "🌧️ Rain", src: "/sounds/rain.mp3" },
  { id: "cafe", label: "☕ Cafe", src: "/sounds/cafe.mp3" },
  { id: "fire", label: "🔥 Fire", src: "/sounds/fire.mp3" },
  { id: "ocean", label: "🌊 Ocean", src: "/sounds/ocean.mp3" },
  { id: "white", label: "🤍 White Noise", src: "/sounds/white-noise.mp3" },
];

type ActiveSound = {
  id: string;
  audio: HTMLAudioElement;
  volume: number;
};

export function AmbientSound() {
  const [activeSounds, setActiveSounds] = useState<ActiveSound[]>([]);
  const [open, setOpen] = useState(false);

  // Toggle sound on/off
  const toggleSound = (sound: (typeof sounds)[number]) => {
    const existing = activeSounds.find((s) => s.id === sound.id);

    if (existing) {
      // Stop sound
      existing.audio.pause();
      existing.audio.volume = 0;
      setActiveSounds((prev) => prev.filter((s) => s.id !== sound.id));
    } else {
      // Play sound
      const audio = new Audio(sound.src);
      audio.loop = true;
      audio.volume = 0;
      audio.play();

      // Smooth fade in
      let v = 0;
      const fadeIn = setInterval(() => {
        v += 0.05;
        audio.volume = Math.min(v, 1);
        if (v >= 1) clearInterval(fadeIn);
      }, 50);

      setActiveSounds((prev) => [...prev, { id: sound.id, audio, volume: 1 }]);
    }
  };

  // Adjust individual sound volume
  const handleVolumeChange = (id: string, newVolume: number) => {
    setActiveSounds((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          s.audio.volume = newVolume;
          return { ...s, volume: newVolume };
        }
        return s;
      }),
    );
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      activeSounds.forEach((s) => {
        s.audio.pause();
        s.audio.src = "";
      });
    };
  }, [activeSounds]);

  return (
    <div className="flex justify-center my-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="size-4" />
            🎧 Ambient Mixer
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Ambient Mixer</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            {sounds.map((sound) => {
              const isActive = activeSounds.some((s) => s.id === sound.id);
              const activeData = activeSounds.find((s) => s.id === sound.id);

              return (
                <motion.div
                  key={sound.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <Button
                      variant={isActive ? "default" : "outline"}
                      className="flex items-center gap-2 w-[60%]"
                      onClick={() => toggleSound(sound)}
                    >
                      {isActive ? (
                        <Volume2 className="size-4" />
                      ) : (
                        <VolumeX className="size-4" />
                      )}
                      {sound.label}
                    </Button>
                    <span className="text-xs opacity-70">
                      {isActive ? "Playing" : "Off"}
                    </span>
                  </div>

                  {isActive && (
                    <Slider
                      value={[activeData?.volume! * 100]}
                      onValueChange={(val) =>
                        handleVolumeChange(sound.id, val[0] / 100)
                      }
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
