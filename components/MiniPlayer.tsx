"use client";

import { useAudio } from "@/contexts/AudioContext";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export function MiniPlayer() {
  const router = useRouter();
  const { currentSong, isPlaying, currentTime, duration, togglePlayPause } = useAudio();

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleOpenPlayer = () => {
    router.push(`/song?id=${currentSong.id}`);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
    >
      {/* Progress bar at top */}
      <div className="h-[2px] bg-white/10">
        <motion.div
          className="h-full"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, hsl(330 81% 60%) 0%, hsl(330 81% 55%) 100%)",
          }}
        />
      </div>

      <div className="glass border-t border-white/5 px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Album art - clickable to open player */}
          <motion.button
            onClick={handleOpenPlayer}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-lg overflow-hidden shadow-lg flex-shrink-0"
          >
            <img
              src={currentSong.coverSrc}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
            {/* Playing indicator overlay */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-white rounded-full"
                      animate={{
                        height: [4, 10, 4],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.button>

          {/* Song info - clickable to open player */}
          <button
            onClick={handleOpenPlayer}
            className="flex-1 min-w-0 text-left"
          >
            <p className="text-sm font-semibold text-white truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {currentSong.artist}
            </p>
          </button>

          {/* Play/Pause button */}
          <motion.button
            onClick={togglePlayPause}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, hsl(330 81% 60%) 0%, hsl(330 81% 50%) 100%)",
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white fill-white" />
            ) : (
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
