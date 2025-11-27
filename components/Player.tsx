"use client";

import { useAudio } from "@/contexts/AudioContext";
import { Song } from "@/data/songs";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlurredBackground } from "./BlurredBackground";
import { LyricsView } from "./LyricsView";

interface PlayerProps {
  song: Song;
}

export function Player({ song }: PlayerProps) {
  const router = useRouter();
  const progressRef = useRef<HTMLDivElement>(null);
  const { currentSong, isPlaying, currentTime, duration, playSong, togglePlayPause, seek } = useAudio();
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [localTime, setLocalTime] = useState(currentTime);

  // Auto-play this song when component mounts if not already the current song
  useEffect(() => {
    if (!currentSong || currentSong.id !== song.id) {
      playSong(song);
    }
    // Only run on mount, not when dependencies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.id]);

  // Sync local time with context time (unless dragging)
  useEffect(() => {
    if (!isDragging) {
      setLocalTime(currentTime);
    }
  }, [currentTime, isDragging]);

  const actualDuration = duration > 0 ? duration : song.duration;
  const displayTime = isDragging ? localTime : currentTime;

  const skipBackward = useCallback(() => {
    seek(Math.max(0, currentTime - 10));
  }, [seek, currentTime]);

  const skipForward = useCallback(() => {
    seek(Math.min(actualDuration, currentTime + 10));
  }, [seek, currentTime, actualDuration]);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const toggleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
  }, []);

  const handleBack = useCallback(() => {
    router.push("/playlist");
  }, [router]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * actualDuration;
    seek(newTime);
    setLocalTime(newTime);
  }, [actualDuration, seek]);

  const handleProgressDrag = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const progressBar = progressRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const dragPosition = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = dragPosition * actualDuration;
    setLocalTime(newTime);
  }, [isDragging, actualDuration]);

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      seek(localTime);
      setIsDragging(false);
    }
  }, [isDragging, localTime, seek]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseUp = () => handleDragEnd();
      const handleMouseMove = (e: MouseEvent) => {
        const progressBar = progressRef.current;
        if (!progressBar) return;
        const rect = progressBar.getBoundingClientRect();
        const dragPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setLocalTime(dragPosition * actualDuration);
      };

      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, actualDuration, handleDragEnd]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = actualDuration > 0 ? (displayTime / actualDuration) * 100 : 0;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <BlurredBackground imageSrc={song.coverSrc} isPlaying={isPlaying} />

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 safe-top px-3 pt-1 flex items-center justify-between"
        >
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 flex items-center justify-center glass-light rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300"
            aria-label="Go back to playlist"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>

          <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
            Now Playing
          </p>

          <div className="w-8" /> {/* Spacer */}
        </motion.header>

        {/* Album Art & Info */}
        <div className="flex-shrink-0 pt-1 pb-2 px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-2"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={isPlaying ? {
                opacity: [0.4, 0.6, 0.4],
                scale: [1.1, 1.15, 1.1],
              } : {
                opacity: 0.3,
                scale: 1.1,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(135deg, hsl(330 81% 60% / 0.5) 0%, hsl(270 91% 65% / 0.5) 100%)",
                filter: "blur(50px)",
              }}
            />

            {/* Album cover */}
            <motion.div
              animate={isPlaying ? {
                scale: [1, 1.02, 1],
              } : {
                scale: 1,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <img
                src={song.coverSrc}
                alt={`${song.title} album cover`}
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Song info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-lg sm:text-xl font-bold tracking-tight gradient-text-primary">
              {song.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">
              {song.artist}
            </p>
          </motion.div>
        </div>

        {/* Lyrics */}
        <LyricsView currentTime={displayTime} lyrics={song.lyrics} />

        {/* Controls */}
        <div className="flex-shrink-0">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 sm:px-6 pb-safe pt-2 glass border-t border-white/5"
            style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
          >
            {/* Progress bar */}
            <div className="mb-1">
              <div
                ref={progressRef}
                className="relative h-5 flex items-center cursor-pointer group"
                onClick={handleProgressClick}
                onMouseDown={() => setIsDragging(true)}
                onMouseEnter={() => setIsHoveringProgress(true)}
                onMouseLeave={() => setIsHoveringProgress(false)}
                onMouseMove={handleProgressDrag}
                role="slider"
                aria-label="Song progress"
                aria-valuemin={0}
                aria-valuemax={actualDuration}
                aria-valuenow={displayTime}
                tabIndex={0}
              >
                {/* Track background */}
                <div className="absolute left-0 right-0 h-[3px] bg-white/20 rounded-full overflow-hidden">
                  {/* Progress fill */}
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPercentage}%`,
                      background: "linear-gradient(90deg, hsl(330 81% 60%) 0%, hsl(330 81% 55%) 100%)",
                    }}
                  />
                </div>

                {/* Thumb */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
                  style={{
                    left: `calc(${progressPercentage}% - 6px)`,
                  }}
                  animate={{
                    scale: isHoveringProgress || isDragging ? 1 : 0,
                    opacity: isHoveringProgress || isDragging ? 1 : 0,
                  }}
                  transition={{ duration: 0.15 }}
                />
              </div>

              {/* Time display */}
              <div className="flex justify-between text-[10px] text-neutral-500 font-medium tabular-nums">
                <span>{formatTime(displayTime)}</span>
                <span>{formatTime(actualDuration)}</span>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {/* Like button */}
              <motion.button
                onClick={toggleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isLiked
                    ? "text-pink-400"
                    : "text-neutral-400 hover:text-white"
                }`}
                aria-label={isLiked ? "Unlike song" : "Like song"}
                aria-pressed={isLiked}
              >
                <Heart
                  className={`w-4 h-4 transition-all duration-300 ${isLiked ? "fill-pink-400" : ""}`}
                />
              </motion.button>

              {/* Skip back */}
              <motion.button
                onClick={skipBackward}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </motion.button>

              {/* Play/Pause button */}
              <motion.button
                onClick={togglePlayPause}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, hsl(330 81% 60%) 0%, hsl(330 81% 50%) 100%)",
                  boxShadow: "0 6px 24px -4px rgba(236, 72, 153, 0.5)",
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPlaying ? "playing" : "paused"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white fill-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Skip forward */}
              <motion.button
                onClick={skipForward}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </motion.button>

              {/* Repeat button */}
              <motion.button
                onClick={toggleRepeat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isRepeat
                    ? "text-pink-400"
                    : "text-neutral-400 hover:text-white"
                }`}
                aria-label={isRepeat ? "Disable repeat" : "Enable repeat"}
                aria-pressed={isRepeat}
              >
                <Repeat className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
