"use client";

import { useAudio } from "@/contexts/AudioContext";
import { SONGS } from "@/data/songs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, Music2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MiniPlayer } from "./MiniPlayer";

export function Playlist() {
  const router = useRouter();
  const { currentSong } = useAudio();
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  const handleSongSelect = (songId: string) => {
    router.push(`/song?id=${songId}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalDuration = SONGS.reduce((acc, song) => acc + song.duration, 0);
  const totalMinutes = Math.floor(totalDuration / 60);


  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-radial-glow opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(240_10%_4%)]" />

      {/* Animated background orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20 -top-1/4 -right-1/4"
        style={{
          background: "radial-gradient(circle, hsl(330 81% 60% / 0.3) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 px-4 sm:px-6 py-4 glass border-b border-white/5">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center glass-light rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Go back to home"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="text-center">
              <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Your Collection
              </h2>
            </div>

            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
          {/* Playlist header */}
          <div className="text-center mb-10">
            {/* Album art collage */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6">
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, hsl(330 81% 60% / 0.4) 0%, hsl(270 91% 65% / 0.4) 100%)",
                  filter: "blur(40px)",
                  transform: "scale(1.2)",
                }}
              />

              {/* Main album art container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl glass-card">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music2 className="w-16 h-16 text-white/40" strokeWidth={1} />
                </div>
                <img
                  src="/playlist-cover.png"
                  alt="Playlist cover"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Play all button overlay */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => SONGS[0] && handleSongSelect(SONGS[0].id)}
                className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
                style={{
                  background: "linear-gradient(135deg, hsl(330 81% 55%) 0%, hsl(330 81% 45%) 100%)",
                  boxShadow: "0 8px 24px -4px rgba(236, 72, 153, 0.5)",
                }}
                aria-label="Play all songs"
              >
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </motion.button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-2 gradient-text-primary">
              Songs for Carolina
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base flex items-center justify-center gap-3">
              <span>{SONGS.length} songs</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {totalMinutes} min
              </span>
            </p>
          </div>

          {/* Songs list */}
          <div className="space-y-2">
            {SONGS.map((song, index) => (
              <motion.button
                key={song.id}
                onClick={() => handleSongSelect(song.id)}
                onMouseEnter={() => setHoveredSong(song.id)}
                onMouseLeave={() => setHoveredSong(null)}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative flex items-center gap-4 p-3 sm:p-4 rounded-2xl transition-all duration-300"
                style={{
                  background: hoveredSong === song.id
                    ? "linear-gradient(135deg, hsl(330 81% 60% / 0.1) 0%, hsl(270 91% 65% / 0.05) 100%)"
                    : "transparent",
                }}
                aria-label={`Play ${song.title} by ${song.artist}`}
              >
                {/* Track number / Play icon */}
                <div className="w-8 flex-shrink-0 text-center">
                  <AnimatePresence mode="wait">
                    {hoveredSong === song.id ? (
                      <motion.div
                        key="play"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Play className="w-5 h-5 text-pink-400 fill-pink-400 mx-auto" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-medium text-neutral-500"
                      >
                        {index + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Album art */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-lg flex-shrink-0 group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={song.coverSrc}
                    alt={`${song.title} album art`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0 text-left">
                  <h3
                    className={`text-base sm:text-lg font-semibold truncate transition-colors duration-300 ${
                      hoveredSong === song.id ? "text-pink-300" : "text-white"
                    }`}
                  >
                    {song.title}
                  </h3>
                  <p className="text-sm text-neutral-400 truncate">
                    {song.artist}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className="text-sm text-neutral-500 font-medium tabular-nums">
                    {formatDuration(song.duration)}
                  </span>
                </div>

                {/* Hover gradient line */}
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-px"
                  initial={false}
                  animate={{
                    opacity: hoveredSong === song.id ? 1 : 0,
                    scaleX: hoveredSong === song.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, hsl(330 81% 60% / 0.3) 50%, transparent 100%)",
                  }}
                />
              </motion.button>
            ))}
          </div>

          {/* Empty state */}
          {SONGS.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full glass-light flex items-center justify-center">
                <Music2 className="w-10 h-10 text-neutral-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-300 mb-2">
                No songs yet
              </h3>
              <p className="text-neutral-500">
                Songs will appear here once added
              </p>
            </motion.div>
          )}

          {/* Bottom spacing for safe area and mini player */}
          <div className={currentSong ? "h-24" : "h-8"} />
        </main>
      </div>

      {/* Mini player */}
      <AnimatePresence>
        {currentSong && <MiniPlayer />}
      </AnimatePresence>
    </div>
  );
}
